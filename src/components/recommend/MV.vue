<template>
  <div>
    <!-- title -->
    <h2 class="m-title">推荐MV
      <a-icon type="right" style="font-size:16px;color:#000" />
    </h2>
    <!-- 列表 -->
    <div class="m-mv-list">
      <div class="m-mv-item" @click="handlePlay(item)" v-for="item in mvList" :key="item.id">
        <div class="m-item-box">
          <img :src="item.picUrl">
          <!-- 播放量 -->
          <div class="m-playCount"><span></span>{{item.playCount}}</div>
        </div>
        <div class="m-item-desc">
          <!-- 歌曲名称 -->
          <div class="m-song-name">{{item.name}}</div>
          <!-- 歌手 -->
          <div class="m-singer">{{item.artistName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import musicLibrary from '../../api/musicLibrary'
const api = new musicLibrary()
export default {
  data () {
    return {
      mvList: []
    }
  },
  created () {
    this.getMVData()
  },
  methods: {
    //  获取推荐MV
    async getMVData () {
      const param = {}
      const res = await api.getMVData(param)
      if (res.status !== 200) return
      const data = res.data.result
      this.mvList = [data[0], data[1], data[2]]
    },
    // 播放mv
    handlePlay (val) {
      this.$router.push({ name: 'mvPage' })
      localStorage.setItem('mvId', val.id)
    }
  }
}
</script>

<style scoped lang='less'>
.m-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
  }
}
.m-mv-list {
  width: 100%;
  height: 250px;
  display: flex;
  margin-bottom: 30px;
  .m-mv-item {
    width: calc(~'100% / 3');
    height: 100%;
    padding: 0 10px;
    .m-item-box {
      width: 100%;
      height: 200px;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .m-playCount {
        position: absolute;
        right: 10px;
        top: 5px;
        color: #ddd;
        font-size: 12px;
        display: flex;
        align-items: center;
        span {
          width: 16px;
          height: 16px;
          display: inline-block;
          background: url('../../assets/img/右三角.svg') no-repeat center center;
          background-size: cover;
        }
      }
    }
    .m-item-desc {
      height: 50px;
      padding: 5px;
      .m-song-name {
        color: #000;
      }
      .m-singer {
        font-size: 12px;
      }
    }
    &:nth-child(1) {
      padding: 0 10px 0 0;
    }
    &:nth-child(3) {
      padding: 0 0 0 10px;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
