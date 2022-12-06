<template>
  <div class="m-myMusic-wrap">
    <div v-if="isLogin" class="m-myMusic-inner">
      <!-- 骨架屏 -->
      <el-skeleton animated :loading="loading">
        <template slot="template">
          <div class="m-skeleton-wrap">
            <div class="m-left-wrap">
              <el-skeleton-item variant="image" style="width: 180px; height: 180px;border-radius:5px;" />
            </div>
            <div class="m-right-wrap">
              <el-skeleton-item variant="p" style="height:30px;margin-bottom:10px" />
              <el-skeleton-item v-for="p in 3" :key="p" variant="p" style="height:20px;margin-bottom:10px" />
            </div>
          </div>
          <div class="m-skeleton-list-wrap" v-for="item in 8" :key="item">
            <el-skeleton-item class="m-skeleton-item" style="width:50px;" variant="p" />
            <el-skeleton-item class="m-skeleton-item" variant="p" />
            <el-skeleton-item class="m-skeleton-item" variant="p" />
            <el-skeleton-item class="m-skeleton-item" variant="p" />
            <el-skeleton-item class="m-skeleton-item" variant="p" />
          </div>
        </template>
      </el-skeleton>
      <!-- 歌单信息 -->
      <div class="m-top-wrap" v-show="!loading">
        <div class="m-left">
          <img :src="myMusicList.imgSrc" alt="">
        </div>
        <div class="m-right">
          <h2>{{myMusicList.name}}</h2>
          <p class="m-late">最近更新: <span>{{updateTime}}</span></p>
          <p class="m-num">歌曲: <span style="margin-right:10px">{{myMusicList.playlist?myMusicList.playlist.length:0}}</span>播放: <span>{{myMusicList.playCount | playCountFormat}}</span></p>
          <p class="m-desc">简介: <span>{{myMusicList.desc}}</span></p>
        </div>
      </div>
      <!-- 详细列表 -->
      <div class="m-list-wrap" v-show="!loading">
        <el-table :data="myMusicList.playlist" style="width: 100%;" size="mini">
          <el-table-column width="50" type="index">
          </el-table-column>
          <el-table-column prop="musicName" label="歌曲名称">
            <template slot-scope="scoped">
              <span @click="playMusic(scoped.row)" class="m-musicName">{{scoped.row.musicName}}</span>
              <span @click="playMusic(scoped.row)" class="m-alia">{{scoped.row.alia!==''?`(${scoped.row.alia})`:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="singer" label="歌手">
          </el-table-column>
          <el-table-column prop="alName" label="专辑">
          </el-table-column>
          <el-table-column prop="musicDuration" width="60" label="时长">
            <template slot-scope="scoped">
              {{scoped.row.musicDuration | formatMusicTime}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else-if="!isLogin" class="m-empty">
      <img class="m-img" src="../../assets/img/m-1.png" alt="">
      <p class="m-desc">未登录，请您先进行登录！</p>
    </div>
  </div>
</template>

<script>
import userinfoAPI from '@/api/userinfoAPI.js'
import musicLibrary from '@/api/musicLibrary.js'
const musicApi = new musicLibrary()
const userApi = new userinfoAPI()
export default {
  data () {
    return {
      myMusicList: {},
      // 更新日期
      updateTime: `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
      loading: true,
      isLogin: false
    }
  },
  created () {
    const isLogin = localStorage.getItem('isLogin')
    if (!isLogin) {
      this.$store.commit('play/SET_ISSHOW_LOGIN', true)
    } else {
      this.isLogin = true
      this.getPlayList()
    }
    this.$router.beforeEach((to, from, next) => {
      const isLogin = localStorage.getItem('isLogin')
      if (to.name === 'MyMusic' && !isLogin) {
        this.$store.commit('play/SET_ISSHOW_LOGIN', true)
      }
      next()
    })
  },
  methods: {
    // 获取用户歌单
    async getPlayList () {
      const userId = JSON.parse(localStorage.getItem('userinfo')).userId
      const param = {
        uid: userId
      }
      const res = await userApi.getPlayList(param)
      const playlist = res.data.playlist[0]
      this.myMusicList = {
        id: playlist.id,
        name: playlist.name,
        imgSrc: playlist.coverImgUrl,
        desc: playlist.description,
        playCount: playlist.playCount,
        updateTime: playlist.updateTime,
        playlist: []
      }
      this.getMusicList(playlist.id)
    },
    // 根据榜单id查询歌曲
    async getMusicList (id) {
      const param = {
        id
      }
      const res = await musicApi.getPlayListDetailData(param)
      const tracks = res.data.playlist.tracks
      tracks.forEach(item => {
        this.myMusicList.playlist.push({
          musicId: item.id,
          musicName: item.name,
          alia: item.alia.length !== 0 ? item.alia[0] : '',
          alName: item.al.name,
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: ''
        })
      })
      this.loading = false
    },
    // 播放音乐
    playMusic (val) {
      // 将搜索到的数据插入到播放列表
      this.$store.commit('play/SET_PALY_LIST', this.myMusicList.playlist)
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', val)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    }
  }
}
</script>

<style scoped lang='less'>
.m-myMusic-wrap {
  width: calc(~'100% - 200px');
  padding: 20px 20px 0 20px;
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
  .m-myMusic-inner {
    width: 100%;
    height: 100%;
    .m-skeleton-wrap {
      display: flex;
      height: 200px;
      .m-left-wrap {
        width: 200px;
      }
      .m-right-wrap {
        width: 200px;
      }
    }
    .m-skeleton-list-wrap {
      display: flex;
      .m-skeleton-item {
        width: calc(~'(100% - 100px) / 4');
        height: 24px;
        margin: 6px 5px;
      }
    }
    .m-page-header {
      height: 30px;
    }
    .m-top-wrap {
      height: 200px;
      display: flex;
      .m-left {
        width: 180px;
        height: 180px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 180px;
          height: 180px;
        }
      }
      .m-right {
        width: calc(~'100% - 180px');
        padding: 0 20px;
        h2 {
          font-size: 20px;
          color: #000;
        }
        .m-late {
          font-size: 13px;
        }
        .m-num {
          font-size: 13px;
        }
        .m-desc {
          font-size: 13px;
        }
      }
    }
  }
  .m-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .m-img {
      width: 300px;
      height: 300px;
    }
    .m-desc {
      margin: 10px;
    }
  }
}
</style>

<style lang="less">
.m-myMusic-wrap {
  .el-table {
    background: transparent;
    .el-table__expanded-cell {
      background: transparent;
    }
    tr,
    th {
      background: transparent;
    }
    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &::before {
      height: 0;
    }
    .m-musicName {
      color: #333;
      &:hover {
        cursor: pointer;
      }
    }
    .m-alia {
      color: #aaa;
      &:hover {
        cursor: pointer;
      }
    }
    .el-table__row {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        .el-table__cell:nth-child(1) {
          color: #3bba7d;
        }
      }
    }
  }
  .el-page-header__left::after {
    background: rgba(0, 0, 0, 0.3);
  }
}
.m-main .el-table .el-table__row td:nth-child(2) .cell {
  padding-left: 10px;
}
</style>

