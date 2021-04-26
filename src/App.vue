<template>
  <div id="app">
    <!--疫情图表-->
    <PrevalenceMap/>
  </div>
</template>

<script>
  // 引入图表组件
  import PrevalenceMap from "./components/PrevalenceMap";
  export default {
    name: 'App',
    components: {PrevalenceMap},
  }
</script>

<style>
html,body,#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
