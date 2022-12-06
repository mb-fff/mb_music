<template>
  <div class="m-officlist-wrap">
    <!-- 官方榜 -->
    <h2 class="m-title">官方榜</h2>
    <!-- 骨架屏 -->
    <el-skeleton animated :loading="loading">
      <template slot="template">
        <div class="m-officlist-item" v-for="item in 4" :key="item">
          <div class="m-left-wrap">
            <el-skeleton-item variant="image" style="width: 180px; height: 180px;border-radius:5px;" />
          </div>
          <div class="m-right-wrap">
            <div class="m-skeleton-list-wrap" v-for="p in 5" :key="p">
              <el-skeleton-item class="m-skeleton-item" style="width:30px" variant="p" />
              <el-skeleton-item class="m-skeleton-item" variant="p" />
              <el-skeleton-item class="m-skeleton-item" variant="p" />
            </div>
            <el-skeleton-item variant="p" style="height:24px;margin:3px 5px;width:60px" />
          </div>
        </div>
      </template>
    </el-skeleton>
    <div class="m-officlist-item" v-show="!loading" v-for="(item,index) in officList" :key="item.id">
      <!-- 左边logo -->
      <div class="m-left-wrap">
        <div class="m-img" @click="playMusic(item.playlist[0],index)">
          <img :src="item.imgSrc" alt="">
          <!-- 播放按钮 -->
          <div class="m-play-btn">
            <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
          </div>
          <!-- 描述 -->
          <p class="m-desc">{{updateTime}}更新</p>
        </div>
      </div>
      <!-- 右边列表 -->
      <div class="m-right-wrap">
        <!-- 列表 -->
        <el-table :data="item.playlist.slice(0,5)" style="width: 100%;height:180px" :show-header="false" size="mini">
          <el-table-column width="30" type="index">
          </el-table-column>
          <el-table-column prop="musicName">
            <template slot-scope="scoped">
              <span @click="playMusic(scoped.row,index)" class="m-musicName">{{scoped.row.musicName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="singer" width="100">
          </el-table-column>
        </el-table>
        <!-- 查看全部 -->
        <p class="m-query-all" @click="queryAll(item)">查看全部
          <a-icon type="right" style="font-size:12px;" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 更新日期
      updateTime: `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
      loading: true
    }
  },
  props: {
    officList: {
      type: Array,
      required: true
    }
  },
  watch: {
    officList: {
      deep: true,
      handler (newV) {
        if (newV[0].playlist.length !== 0 && newV[1].playlist.length !== 0) this.loading = false
      }
    }
  },
  methods: {
    // 播放音乐
    playMusic (val, index) {
      // 将搜索到的数据插入到播放列表
      this.$store.commit('play/SET_PALY_LIST', this.officList[index].playlist)
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', val)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    },
    // 查看全部
    queryAll (playlist) {
      this.$emit('queryAll', playlist)
    }
  }
}
</script>

<style scoped lang='less'>
.m-officlist-wrap {
  width: 100%;
  .m-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .m-officlist-item {
    width: 100%;
    height: 220px;
    display: flex;
    margin-bottom: 20px;
    .m-left-wrap {
      width: 200px;
      .m-img {
        width: 180px;
        height: 180px;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        &:hover {
          cursor: pointer;
          .m-play-btn {
            display: flex;
          }
        }
        .m-play-btn {
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: none;
          justify-content: center;
          align-items: center;
        }
        .m-desc {
          width: 100%;
          position: absolute;
          margin: 0;
          height: 30px;
          line-height: 30px;
          text-align: center;
          left: 50%;
          top: 70%;
          transform: translate(-50%, -50%);
          color: #fff;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .m-right-wrap {
      width: calc(~'100% - 200px');
      .m-query-all {
        margin: 0;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: #333;
        padding-left: 10px;
        &:hover {
          cursor: pointer;
        }
      }
      .m-skeleton-list-wrap {
        display: flex;
        .m-skeleton-item {
          height: 24px;
          margin: 3px 5px;
          width: calc(~'(100% - 60px) / 2');
        }
      }
    }
  }
}
</style>

<style lang="less">
.m-officlist-wrap {
  .el-table {
    background: transparent;
    .el-table__expanded-cell {
      background: transparent;
    }
    tr {
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
</style>
