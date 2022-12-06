<template>
  <div class="m-home">
    <Header></Header>
    <div class="m-content">
      <Section></Section>
      <!-- 渲染路由 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <!-- 歌词区域 -->
      <Lyrics v-show="isShowLyrics"></Lyrics>
      <!-- 当前播放列表 -->
      <div class="m-playlist-wrap" v-show="isShowPlaylist">
        <h2 class="m-title">当前播放</h2>
        <div class="m-playlist-top">
          <span class="m-left">
            总{{playlist.length}}首
          </span>
          <span @click="clear()" class="m-right">清空列表</span>
        </div>
        <!-- 播放列表 -->
        <div class="m-playlist-box">
          <el-table :data="playlist" stripe style="width: 100%" :show-header="false" size="mini">
            <el-table-column width="20">
              <template slot-scope="scope">
                <a-icon style="color:#60c695;font-size:12px" v-show="curPlayingMusicId===scope.row.musicId" type='pause' />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="name">
              <template slot-scope="scope">
                <span :title="scope.row.musicName" @click="playMusic(scope.row)" class="m-music-item" :style="curPlayingMusicId===scope.row.musicId?'color:#60c695':''">{{scope.row.musicName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="singer" label="singer" width="150">
              <template slot-scope="scope">
                <span :title="scope.row.singer" class="m-music-item" :style="curPlayingMusicId===scope.row.musicId?'color:#60c695':''">{{scope.row.singer}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="time" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.musicDuration | formatMusicTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@components/home/Header.vue'
import Section from '@components/home/Section.vue'
import Lyrics from '@components/home/Lyrics.vue'
import Footer from '@components/home/Footer.vue'
export default {
  data () {
    return {}
  },
  components: {
    Header,
    Section,
    Lyrics,
    Footer
  },
  computed: {
    isShowLyrics () {
      return this.$store.getters.isShowLyrics
    },
    isShowPlaylist () {
      return this.$store.getters.isShowPlaylist
    },
    // 播放列表
    playlist () {
      return this.$store.getters.playlist
    },
    // 当前播放音乐id
    curPlayingMusicId () {
      return this.$store.getters.curPlayingMusicInfo.musicId
    }
  },
  mounted () {
    // 点击播放列表外，隐藏播放列表
    document.addEventListener('click', e => {
      const [classNames, target] = [[], e.target || e.srcElement]
      e.path.forEach(el => {
        el.className ? classNames.push(el.className) : classNames.push(false)
      })
      if (classNames.indexOf('m-playlist-wrap') !== -1 || target.tagName === 'svg' || target.tagName === 'path') return
      this.$store.commit('play/SET_ISSHOW_PLAYLIST', 1)
    }, false)
  },
  methods: {
    playMusic (musicinfo) {
      this.$store.commit('play/SET_MUSIC_INFO', musicinfo)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    },
    clear () {
      this.$store.commit('play/SET_PALY_LIST', [])
    }
  }
}
</script>

<style scoped lang='less'>
.m-home {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
  min-width: 1200px;
  min-height: 500px;
  .m-content {
    width: 100%;
    height: calc(~'100% - 140px');
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    position: relative;
    .m-playlist-wrap {
      width: 35%;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      background: #fff;
      z-index: 999;
      .m-title {
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        margin: 20px 0 0 20px;
      }
      .m-playlist-top {
        height: 30px;
        line-height: 30px;
        position: relative;
        .m-left {
          position: absolute;
          left: 20px;
          font-size: 12px;
          color: #ccc;
        }
        .m-right {
          position: absolute;
          right: 20px;
          font-size: 13px;
          color: #6c92bc;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .m-playlist-box {
        width: 100%;
        height: calc(~'100% - 80px');
        overflow-y: auto;
        overflow-x: hidden;
        // 滚动条样式
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 3px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background: #bbb;
        }
      }
    }
  }
}
</style>

<style lang="less">
.m-playlist-box {
  // 重置表格样式
  .el-table {
    .cell {
      white-space: nowrap;
      .m-music-item {
        &:hover {
          cursor: pointer;
        }
      }
    }
    .el-table__row {
      td:nth-child(1) {
        .cell {
          padding: 0;
          text-align: center;
        }
      }
      td:nth-child(2) {
        .cell {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
