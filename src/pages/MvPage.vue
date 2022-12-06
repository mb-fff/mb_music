<template>
  <div class="m-mv">
    <video controls autoplay :src="mvUrl"></video>
    <div class="m-close">
      <a-icon type="close" @click="backHome()" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    const mvId = JSON.parse(localStorage.getItem('mvId'))
    this.$store.commit('play/SET_MV_ID', mvId)
    this.$store.dispatch('play/getMvUrl')
  },
  computed: {
    mvUrl () {
      return this.$store.getters.mvInfo.mvUrl
    }
  },
  methods: {
    backHome () {
      this.$store.commit('play/SET_VIDEO_URL', '')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang='less'>
.m-mv {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
  min-width: 1200px;
  min-height: 500px;
  position: relative;
  video {
    width: 100%;
    height: 100%;
  }
  .m-close {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    .anticon {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
