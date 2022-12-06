<template>
  <div>
    <!-- title -->
    <h2 class="m-title">独家放送
      <a-icon type="right" style="font-size:16px;color:#000" />
    </h2>
    <!-- 列表 -->
    <div class="m-private-list">
      <div class="m-private-item" v-for="item in privateContentList" :key="item.id">
        <div class="m-item-box">
          <img :src="item.picUrl" alt="">
          <!-- 播放按钮 -->
          <div class="m-play-btn">
            <a-icon type="caret-right" style="color:#fff;font-size:18px" theme="filled" />
          </div>
        </div>
        <div class="m-item-desc">{{item.name}}</div>
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
      privateContentList: []
    }
  },
  created () {
    this.getPrivateContentData()
  },
  methods: {
    async getPrivateContentData () {
      const param = {}
      const res = await api.getPrivateContentData(param)
      if (res.status !== 200) return
      this.privateContentList = res.data.result
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
.m-private-list {
  width: 100%;
  height: 250px;
  display: flex;
  margin-bottom: 20px;
  .m-private-item {
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
      .m-play-btn {
        width: 24px;
        height: 24px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .m-item-desc {
      height: 50px;
      padding: 5px;
    }
    &:nth-child(1) {
      padding: 0 10px 0 0;
    }
    &:nth-child(3) {
      padding: 0 0 0 10px;
    }
  }
}
</style>
