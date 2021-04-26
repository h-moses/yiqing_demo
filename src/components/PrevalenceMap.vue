<template>
    <div id="prevalence-map">
        <!--三个按钮，切换不同的数据-->
        <button class="btn" @click="showConfirm">确诊</button>
        <button class="btn" @click="showCure">治愈</button>
        <button class="btn" @click="showDeath">死亡</button>
        <!--疫情地图容器-->
        <div id="map" style="width: 1400px; height: 750px"></div>
    </div>
</template>

<script>
    // 引入echarts
    import echarts from 'echarts'
    require('echarts/theme/macarons')
    import china from 'echarts/map/json/china'

    export default {
        name: "PrevalenceMap",
        data() {
            return {
                // 地图
                chart: null,
                // 累计确诊数据
                confirmData: [],
                // 累计治愈数据
                cureData: [],
                // 累计死亡数据
                deathData: []
            }
        },
        created() {
            // 获取数据
            this.getData()
        },
        mounted() {
            // 初始化图表
            this.$nextTick( () => {
                this.initChart()
            })
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            // 销毁图表
            this.chart.dispose()
            this.chart = null
        },
        methods: {
            // 获取数据
            async getData() {
              const {data:res} = await this.$http.get('http://ncovdata.market.alicloudapi.com/ncov/cityDiseaseInfoWithTrend')
                if (res === null) {
                    return
                }
                for (let i = 0;i < res.provinceArray.length;++i) {
                    // 取出各省累计确诊、累计治愈和累计死亡数据
                    // 针对一些名字不符的数据进行处理
                    if (res.provinceArray[i].childStatistic === '中国香港') {
                        this.confirmData.push({name:'香港',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'香港',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'香港',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '中国台湾'){
                        this.confirmData.push({name:'台湾',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'台湾',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'台湾',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '中国澳门'){
                        this.confirmData.push({name:'澳门',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'澳门',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'澳门',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '西藏自治区'){
                        this.confirmData.push({name:'西藏',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'西藏',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'西藏',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '内蒙古自治区'){
                        this.confirmData.push({name:'内蒙古',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'内蒙古',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'内蒙古',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '广西壮族自治区'){
                        this.confirmData.push({name:'广西',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'广西',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'广西',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '新疆维吾尔自治区'){
                        this.confirmData.push({name:'新疆',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'新疆',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'新疆',value: res.provinceArray[i].totalDeath})
                        continue
                    } else if (res.provinceArray[i].childStatistic === '宁夏回族自治区'){
                        this.confirmData.push({name:'宁夏',value: res.provinceArray[i].totalConfirmed})
                        this.cureData.push({name:'宁夏',value: res.provinceArray[i].totalCured})
                        this.deathData.push({name:'宁夏',value: res.provinceArray[i].totalDeath})
                        continue
                    }
                    this.confirmData.push({name:res.provinceArray[i].childStatistic.substring(0,res.provinceArray[i].childStatistic.length-1),value: res.provinceArray[i].totalConfirmed})
                    this.cureData.push({name:res.provinceArray[i].childStatistic.substring(0,res.provinceArray[i].childStatistic.length-1),value: res.provinceArray[i].totalCured})
                    this.deathData.push({name:res.provinceArray[i].childStatistic.substring(0,res.provinceArray[i].childStatistic.length-1),value: res.provinceArray[i].totalDeath})
                }
            },
            // 初始化图表
            initChart() {
                // 注册中国地图
                echarts.registerMap('china',china)
                this.chart = echarts.init(document.getElementById('map'),'macarons')
                this.setOptions('confirm')
            },
             setOptions(type) {
                let option;
                // 分别为确诊、治愈、死亡视觉映射颜色
                let colors =[
                    ['#E03D06','#E86B41','#E47A56','#E9967A','#EFAD96','#FAE3DB'],
                    ['#4AA86E','#57C481','#31DBA0','#66E597','#9EEFD3','#CEF7E9'],
                    ['#494949','#5B5B5B','#6D6D6D','#929292','#B6B6B6','#DADADA']
                ]
                option = {
                    backgroundColor: '#EBF6F4',
                    title: {
                        // 图表标题
                        text: type === 'confirm' ? '全国疫情累计确诊' : (type === 'cure' ? '全国疫情累计治愈' : '全国疫情累计死亡'),
                        left: 'center',
                        top: '20px',
                        textStyle: {
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 30
                        }
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    //左侧小导航图标
                    visualMap: {
                        show : true,
                        left: '20px',
                        top: 'center',
                        splitList: [
                            {start: 1, end: 9},
                            {start: 10, end: 99},
                            {start: 100, end: 499},
                            {start: 500, end:999},
                            {start: 1000, end:9999},
                            {start: 10000}
                        ],
                        // 根据不同数据使用不同颜色
                        color: type === 'confirm' ? colors[0] : (type === 'cure' ? colors[1] : colors[2]),
                    },

                    //配置属性
                    series: [{
                        name: type === 'confirm' ? '省份累计确诊数' : (type === 'cure' ? '省份累计治愈数' : '省份累计死亡数'),
                        type: 'map',
                        mapType: 'china',
                        roam: true,
                        label: {
                            normal: {
                                show: true,  //省份名称
                                color: '#000'
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        // 系列数据
                        data: type === 'confirm' ? this.confirmData : (type === 'cure' ? this.cureData : this.deathData)
                    }]
                }
                option && this.chart.setOption(option)
            },
            // 显示累计确诊数据
            showConfirm() {
                this.setOptions('confirm')
            },
            // 显示累计治愈数据
            showCure() {
                this.setOptions('cure')
            },
            // 显示累计死亡数据
            showDeath() {
                this.setOptions('death')
            }
        },
        watch: {
            // 监视三个数据的变化，重新给图表赋予数据
            cureData: {
                deep: true,
                handler() {
                    this.setOptions('cure')
                }
            },
            deathData: {
                deep: true,
                handler() {
                    this.setOptions('death')
                }
            },
            confirmData: {
                deep: true,
                handler() {
                    this.setOptions('confirm')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
#prevalence-map {
    width: 100%;
    height: 100%;
    background-color: #EBF6F4;
    display: flex;
    justify-content: center;
}

    .btn {
        width: 100px;
        height: 30px;
        float: left;
        margin: 50px 0 0 10px;
    }
</style>
