<template>
  <div>
    <footer>
      <!-- 左侧音乐信息 -->
      <div class="m-left-wrap">
        <!-- 歌手头像 -->
        <a-avatar shape="square" :size="49" :src="curMusicInfo.icon" />
        <!-- 歌曲信息 -->
        <div class="m-music-info">
          <p class="m-music-name" :title="curMusicInfo.name">{{curMusicInfo.name}}</p>
          <p class="m-music-singer">{{curMusicInfo.singer}}</p>
        </div>
        <!-- 我喜欢 -->
        <a-icon class="m-heart" type="heart" />
      </div>
      <!-- 中间播放器 -->
      <div class="m-mid-wrap">
        <audio class="m-audio" ref="audioRef" :src="musicUrl"></audio>
        <!-- 播放器 -->
        <div class="m-mid-top">
          <span class="m-top-box">
            <a-icon type="retweet" />
          </span>
          <span class="m-top-box">
            <a-icon @click="changeMusic('prev')" type="step-backward" />
          </span>
          <span class="m-top-box" @click="controlMusic()">
            <a-icon v-show="playLoading" type="loading" />
            <a-icon v-show="!playLoading" :type="isPlay ? 'pause' : 'caret-right'" />
          </span>
          <span class="m-top-box">
            <a-icon @click="changeMusic('next')" type="step-forward" />
          </span>
          <span :class="`m-top-box ${isShowLyrics?'isActive':''}`" @click="showLyrics()">词</span>
        </div>
        <!-- 进度条 -->
        <div class="m-mid-bottom">
          <div class="m-progress-left-val">{{playingTime | formatMusicTime}}</div>
          <el-slider style="width:400px" @change="handleChange" :min="0" :max="curMusicInfo.duration" v-model="playingTime" :show-tooltip="false"></el-slider>
          <div class="m-progress-right-val">{{curMusicInfo.duration | formatMusicTime}}</div>
        </div>
      </div>
      <!-- 右侧功能 -->
      <div class="m-right-wrap">
        <!-- 音质 -->
        <a-button class="m-btn" size="small" ghost>
          无损
        </a-button>
        <!-- 声音 -->
        <a-icon class="m-sound" type="sound" />
        <!-- 播放列表 -->
        <a-icon class="m-music-list" @click="showPlaylist()" type="menu-unfold" />
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 当前已播放时长
      playingTime: 0,
      // 播放状态
      isPlay: false,
      timer: null
    }
  },
  computed: {
    curMusicInfo () {
      const curMusicInfo = this.$store.getters.curPlayingMusicInfo
      return {
        id: curMusicInfo.musicId,
        name: curMusicInfo.musicName,
        singer: curMusicInfo.singer,
        icon: curMusicInfo.musicIcon,
        song: curMusicInfo.musicSong,
        duration: curMusicInfo.musicDuration
      }
    },
    musicUrl () {
      const musicURL = this.$store.getters.curPlayingMusicInfo.musicURL
      return musicURL
    },
    playLoading () {
      return this.$store.getters.playLoading
    },
    isShowLyrics () {
      return this.$store.getters.isShowLyrics
    }
  },
  watch: {
    musicUrl (newV) {
      if (newV !== '') {
        clearInterval(this.timer)
        this.isPlay = false
        this.playingTime = 0
        this.controlMusic()
      }
    },
    playingTime (newV) {
      this.$store.commit('play/SET_CUR_PLAY_TIME', newV)
    }
  },
  methods: {
    // 控制音乐播放与暂停
    controlMusic () {
      if (this.curMusicInfo.duration === 0) return
      if (this.musicUrl === '') return
      const audio = this.$refs.audioRef
      audio.load()
      this.$nextTick(() => {
        this.isPlay ? audio.pause() : audio.play()
        this.isPlay = !this.isPlay
        if (this.isPlay) {
          this.timer = setInterval(() => {
            this.playingTime++
            if (this.playingTime >= this.curMusicInfo.duration) {
              this.isPlay = false
              clearInterval(this.timer)
              // 自动播放列表下一首
              this.changeMusic('next')
            }
          }, 1000)
        } else {
          clearInterval(this.timer)
        }
      })
    },
    // 展示当前播放列表
    showPlaylist () {
      this.$store.commit('play/SET_ISSHOW_PLAYLIST')
    },
    // 切换音乐
    changeMusic (type) {
      this.playingTime = 0
      const [musicId, playlist] = [this.$store.getters.curPlayingMusicInfo.musicId, this.$store.getters.playlist]
      if (playlist.length === 0) return
      playlist.forEach((item, index) => {
        if (musicId === item.musicId) {
          switch (type) {
            case 'prev':
              this.$store.commit('play/SET_MUSIC_INFO', index === 0 ? playlist[playlist.length - 1] : playlist[index - 1])
              break
            case 'next':
              this.$store.commit('play/SET_MUSIC_INFO', index + 1 === playlist.length ? playlist[0] : playlist[index + 1])
              break
            default:
              break
          }
          this.$store.dispatch('play/play')
          this.$store.dispatch('play/getlyric')
          return
        }
      })
    },
    // 音乐进度改变
    handleChange (val) {
      const audio = this.$refs.audioRef
      audio.currentTime = val
    },
    // 展示歌词
    showLyrics () {
      this.$store.commit('play/SET_ISSHOW_LYRICS')
    }
  }
}
</script>

<style scoped lang='less'>
footer {
  width: 100%;
  height: 69px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  padding: 10px;
  // 左侧音乐信息
  .m-left-wrap {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    .m-music-info {
      margin: 0 10px;
      .m-music-name {
        white-space: nowrap;
        font-size: 14px;
        max-width: 200px;
        overflow: hidden;
      }
      .m-music-singer {
        font-size: 12px;
      }
    }
    .m-heart {
      margin-top: 6px;
      font-size: 18px;
      align-self: flex-start;
    }
  }
  // 中间播放器
  .m-mid-wrap {
    height: 100%;
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .m-mid-top {
      width: 100%;
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      .m-top-box {
        display: inline-block;
        margin: 0 15px;
        font-size: 14px;
        color: #000;
        width: 20px;
        height: 20px;
        .anticon {
          font-size: 20px;
          color: #333;
        }
        &:nth-child(3) {
          .anticon {
            font-size: 22px;
          }
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &:hover {
          cursor: pointer;
        }
      }
      .isActive {
        color: #517049;
      }
    }
    .m-mid-bottom {
      width: 100%;
      height: 30%;
      padding: 0 90px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .m-progress-left-val {
        width: 30px;
        font-size: 12px;
      }
      .m-progress-right-val {
        width: 30px;
        font-size: 12px;
      }
    }
  }
  // 右侧功能
  .m-right-wrap {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .m-btn {
      color: rgba(74, 188, 118, 0.5);
      border-color: rgba(74, 188, 118, 0.5);
      margin-right: 15px;
    }
    .m-sound {
      margin-right: 15px;
      font-size: 18px;
    }
    .m-music-list {
      margin-right: 10px;
      font-size: 18px;
    }
  }
}
</style>

<style lang="less">
footer {
  p {
    margin: 0;
  }
  .el-slider__runway {
    height: 4px;
  }
  .el-slider__button {
    width: 8px;
    height: 8px;
    background: #5dc78a;
    border-color: #5dc78a;
  }
  .el-slider__bar {
    height: 4px;
    background: #5dc78a;
  }
  .el-slider__button-wrapper {
    top: -16px;
  }
}
</style>
