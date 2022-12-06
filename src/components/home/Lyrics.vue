<template>
  <div class="m-lyrics-wrap">
    <ul class="m-lyrics-list" ref="lyricsListRef">
      <li :class="`m-lyrics-item ${curPlayMusicLocation === index ? 'isCurPlay' : ''}`" v-for="(item,index) in lyrics" :key="index">
        <span class="m-bg">{{item.text?item.text:'~ ~ ~'}}
          <span ref="lyricsItemRef" class="m-play">{{item.text?item.text:'~ ~ ~'}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 当前播放音乐位置
      curPlayMusicLocation: 0
    }
  },
  computed: {
    lyrics () {
      const lyric = this.$store.getters.curPlayingMusicInfo.musicSong.lyric
      if (!lyric) return ''
      const [arr, res] = [lyric.split('\n'), []]
      arr.forEach(item => {
        const temp = item.split(']')
        const frame = temp[0].slice(1).split(':')
        let dt = Number(frame[0]) * 60 + Math.round(Number(frame[1]))
        res.push({
          frame: isNaN(dt) ? '' : dt,
          text: temp[1]
        })
      })
      return res
    },
    curPlayTime () {
      return this.$store.getters.curPlayTime
    }
  },
  watch: {
    curPlayTime (newV) {
      if (!this.lyrics) return
      if (newV === 0) {
        this.$refs.lyricsListRef.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
      this.lyrics.forEach((item, i) => {
        if (item.frame === newV) {
          let [len, count, timer] = [this.lyrics[i + 1].frame - newV, 1, null]
          timer = setInterval(() => {
            if (!this.$refs.lyricsItemRef[i]) return
            this.$refs.lyricsItemRef[i].style.animation = `gradient ${len > 1 ? len - 1 : 1}s linear forwards`
            count++
            if (count > len) clearInterval(timer)
          }, 1000)
          this.curPlayMusicLocation = i
          this.$refs.lyricsListRef.scrollTo({
            top: (i - 5) * 40,
            behavior: 'smooth'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.m-lyrics-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 99;
  left: 0;
  top: 0;
  color: #ccc;
  padding: 15px 100px;
  .m-lyrics-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    text-align: center;
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 0px;
    }
    .m-lyrics-item {
      width: auto;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      color: #eee;
      text-align: center;
      .m-bg {
        position: relative;
        .m-play {
          display: none;
          position: absolute;
          overflow: hidden;
          white-space: nowrap;
          left: 0;
        }
      }
    }
    .isCurPlay {
      transform: scale(1.2);
      .m-bg {
        .m-play {
          display: inline-block;
          width: 0%;
          color: #517049;
        }
      }
    }
  }
}
</style>

<style lang='less' >
@keyframes gradient {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
