<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(0, 0, 0, 0.65);
  width: 100vw;
  height: 100vh;
  padding: 30px 100px;
  background: url('./assets/img/bg.jpg') no-repeat center center;
  background-size: cover;
  box-sizing: border-box;
  position: relative;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
