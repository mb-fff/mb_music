<template>
  <div>
    <el-carousel :interval="5000" type="card" height="200px">
      <el-carousel-item v-for="(item,index) in bannerList" :key="index">
        <img class="m-banner-img" :src="item.imageUrl">
        <span class="m-banner-type" :style="`background:${item.titleColor}`">{{item.typeTitle}}</span>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import musicLibrary from '../../api/musicLibrary'
const api = new musicLibrary()
export default {
  data () {
    return {
      // 轮播图数据
      bannerList: []
    }
  },
  created () {
    this.getBannerData()
  },
  methods: {
    // 获取轮播图数据
    async getBannerData () {
      const param = {
        type: 0
      }
      const res = await api.getBannerData(param)
      if (res.status !== 200) return
      this.bannerList = res.data.banners
    }
  }
}
</script>

<style scoped lang='less'>
.m-banner-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  position: relative;
  border-radius: 5px;
}
.m-banner-type {
  width: 60px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
  color: #fff;
  display: inline-block;
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  border-radius: 5px 0 5px 0;
}
</style>
