<template>
  <div class="m-video">
    <video controls autoplay :src="videoUrl"></video>
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
    const videoId = JSON.parse(localStorage.getItem('videoId'))
    this.$store.commit('play/SET_VIDEO_ID', videoId)
    this.$store.dispatch('play/getVideoUrl')
  },
  computed: {
    videoUrl () {
      return this.$store.getters.videoInfo.videoUrl
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
.m-video {
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
