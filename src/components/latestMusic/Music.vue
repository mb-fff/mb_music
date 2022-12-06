<template>
  <div class="m-music-wrap">
    <!-- 标签 -->
    <div class="m-tabs-wrap">
      <ul class="m-music-tabs">
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTab(index)" v-for="(item,index) in tabs" :key="item.name">{{item.name}}</li>
      </ul>
    </div>
    <!-- 列表 -->
    <div class="m-music-list">
      <el-table :data="playlist" style="width: 100%;" size="mini" :show-header="false" v-show="isShowMusicList">
        <el-table-column width="50" type="index">
        </el-table-column>
        <el-table-column width="60" prop="musicIcon" label="logo">
          <template slot-scope="scoped">
            <img @click="playMusic(scoped.row)" class="m-icon" :src="scoped.row.musicIcon" alt="">
          </template>
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
      <p v-show="!isShowMusicList" class="m-loading">载入中
        <a-icon type="loading" />
      </p>
    </div>
  </div>
</template>

<script>
import musicLibrary from '@/api/musicLibrary.js'
const api = new musicLibrary()
export default {
  data () {
    return {
      tabs: [
        {
          name: '全部',
          value: 0,
          isActive: true
        },
        {
          name: '华语',
          value: 7,
          isActive: false
        },
        {
          name: '欧美',
          value: 96,
          isActive: false
        },
        {
          name: '日本',
          value: 8,
          isActive: false
        },
        {
          name: '韩国',
          value: 16,
          isActive: false
        }
      ],
      curTabs: 0,
      playlist: [],
      isShowMusicList: false
    }
  },
  created () {
    this.getNewMusic()
  },
  methods: {
    // 切换tab
    changeTab (index) {
      this.tabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curTabs = this.tabs[index] ? this.tabs[index].value : ''
      this.playlist = []
      this.isShowMusicList = false
      this.getNewMusic()
    },
    // 获取新歌速递
    async getNewMusic () {
      const param = {
        type: this.curTabs
      }
      const res = await api.getNewMusic(param)
      res.data.data.forEach(item => {
        this.playlist.push({
          musicId: item.id,
          musicName: item.name,
          alia: item.alias.length !== 0 ? item.alias[0] : '',
          alName: item.album.name,
          singer: item.artists[0].name,
          musicIcon: item.album.blurPicUrl,
          musicSong: '',
          musicDuration: Math.floor(item.duration / 1000),
          musicURL: ''
        })
      })
      this.isShowMusicList = true
    },
    // 播放音乐
    playMusic (val) {
      // 将搜索到的数据插入到播放列表
      this.$store.commit('play/SET_PALY_LIST', this.playlist)
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', val)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    }
  }
}
</script>

<style scoped lang='less'>
.m-music-wrap {
  .m-tabs-wrap {
    .m-music-tabs {
      height: 25px;
      display: flex;
      margin: 0;
      .m-tabs-item {
        height: 100%;
        font-size: 12px;
        margin: 0 10px;
        padding: 5px;
        &:hover {
          cursor: pointer;
        }
      }
      .active {
        background: #fcebeb;
        color: #ec4141;
        border-radius: 5px;
      }
    }
  }
  .m-music-list {
    margin-top: 20px;
    .m-icon {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
      }
    }
    .m-loading {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      margin: 0;
    }
  }
}
</style>

<style lang="less">
.m-music-wrap {
  .m-music-list {
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
  }
}
</style>
