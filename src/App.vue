<template>
  <div id="app">
    <PrevalenceMap/>
  </div>
</template>

<script>
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
