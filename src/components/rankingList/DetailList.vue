<template>
  <div class="m-detaillist-wrap">
    <!-- 页头 -->
    <div class="m-page-header">
      <el-page-header @back="goBack" content="榜单详情">
      </el-page-header>
    </div>
    <!-- 歌单信息 -->
    <div class="m-top-wrap">
      <div class="m-left">
        <img :src="detaillist.imgSrc" alt="">
      </div>
      <div class="m-right">
        <h2>{{detaillist.name}}</h2>
        <p class="m-late">最近更新: <span>{{updateTime}}</span></p>
        <p class="m-num">歌曲: <span style="margin-right:10px">{{detaillist.playlist?detaillist.playlist.length:0}}</span>播放: <span>{{detaillist.playCount | playCountFormat}}</span></p>
        <p class="m-desc">简介: <span>{{detaillist.desc}}</span></p>
      </div>
    </div>
    <!-- 详细列表 -->
    <div class="m-list-wrap">
      <el-table :data="detaillist.playlist" style="width: 100%;" size="mini">
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
</template>

<script>
export default {
  data () {
    return {
      detaillist: {},
      // 更新日期
      updateTime: `${new Date().getMonth() + 1}月${new Date().getDate()}日`
    }
  },
  props: {
    detailList: {
      type: Object,
      required: true
    }
  },
  watch: {
    detailList (newV) {
      this.detaillist = newV
    }
  },
  methods: {
    // 播放音乐
    playMusic (val) {
      // 将搜索到的数据插入到播放列表
      this.$store.commit('play/SET_PALY_LIST', this.detaillist.playlist)
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', val)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    },
    // 返回上一级
    goBack () {
      this.$emit('goBack')
    }
  }
}
</script>

<style scoped lang='less'>
.m-detaillist-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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
</style>

<style lang="less">
.m-detaillist-wrap {
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
