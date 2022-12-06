<template>
  <div class="m-main">
    <main>
      <a-tabs v-model="activeKey" :animated="false" @change="changeTab">
        <a-tab-pane v-for="(item,index) in tabList" :key="index" :tab="item.tabName">
          <div class="m-curPage-wrap">
            <!-- 渲染路由 -->
            <keep-alive v-if="!$route.meta.isNotKeepAlive">
              <router-view></router-view>
            </keep-alive>
            <router-view v-if="$route.meta.isNotKeepAlive"></router-view>
          </div>
        </a-tab-pane>
      </a-tabs>
    </main>
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
</template>

<script>
export default {
  data () {
    return {
      // 默认标签页索引
      activeKey: 0,
      // 标签页数据
      tabList: [
        {
          tabName: '个性推荐'
        },
        {
          tabName: '歌单'
        },
        {
          tabName: '排行榜'
        },
        {
          tabName: '歌手'
        },
        {
          tabName: '最新音乐'
        }
      ]
    }
  },
  created () {
    const activeKey = JSON.parse(sessionStorage.getItem('active-music-level-two'))
    const temp = activeKey ? activeKey : 0
    this.activeKey = temp === 5 ? 1 : temp
    this.changeTab(temp)
    this.$router.beforeEach((to, from, next) => {
      if (to.name === 'MusicLibrary') {
        const key = JSON.parse(sessionStorage.getItem('active-music-level-two'))
        this.changeTab(key)
      }
      next()
    })
  },
  computed: {
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
    changeTab (key) {
      switch (key) {
        case 0:
          this.$router.push({ name: 'Recommendation' })
          break;
        case 1:
          this.$router.push({ name: 'PlayList' })
          break;
        case 2:
          this.$router.push({ name: 'Rankinglist' })
          break;
        case 3:
          this.$router.push({ name: 'Singer' })
          break;
        case 4:
          this.$router.push({ name: 'LatestMusic' })
          break;
        default:
          break;
      }
      sessionStorage.setItem('active-music-level-two', key === 5 ? 1 : key)
    },
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
.m-main {
  width: calc(~'100% - 201px');
  height: 100%;
  position: relative;
  main {
    width: 100%;
    height: 100%;
    .m-curPage-wrap {
      padding: 10px 20px !important;
    }
  }
  .m-playlist-wrap {
    width: 40%;
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
</style>

<style lang="less">
.m-main {
  // 重置标签页样式--start
  .ant-tabs {
    height: 100%;
    .ant-tabs-top-content {
      height: calc(~'100% - 70px');
      // 标签页内容区溢出显示滚动条
      overflow: auto;
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
  .ant-tabs-nav {
    .ant-tabs-tab {
      padding: 12px 0;
      &:hover {
        color: #000;
      }
    }
  }
  .ant-tabs-bar {
    border-bottom: none;
    margin-bottom: 5px;
    padding: 10px 20px;
  }
  .ant-tabs-tab-active {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .ant-tabs-ink-bar {
    background-color: rgba(74, 188, 118, 0.5);
  }
  // 重置标签页样式--end
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
