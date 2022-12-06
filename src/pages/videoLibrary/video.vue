<template>
  <div class="m-video-wrap">
    <!-- 导航栏 -->
    <nav class="m-video-nav">
      <div class="m-left">
        <h2 class="m-title" @click="isShowAllTabs=!isShowAllTabs">{{curTabs}}
          <span>
            <a-icon type="right" style="font-size:16px;color:#000" />
          </span>
        </h2>
      </div>
      <div class="m-right">
        <ul class="m-video-tabs">
          <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTab(index)" v-for="(item,index) in tabs" :key="item.name">{{item.name}}</li>
        </ul>
      </div>
    </nav>
    <!-- 全部标签列表 -->
    <div class="m-video-alltabs" v-show="isShowAllTabs">
      <h2 @click="queryAllVideo()">全部视频</h2>
      <ul class="m-allTabs-list">
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTab(index)" v-for="(item,index) in allTabs" :key="item.name">{{item.name}}</li>
      </ul>
    </div>
    <!-- 视频列表 -->
    <div class="m-video-list-wrap infinite-list" v-infinite-scroll="scrollLoad" :infinite-scroll-immediate="false" :infinite-scroll-delay="1000">
      <div class="m-video-item infinite-list-item" @click="handlePlay(item)" v-for="(item,index) in videos" :key="index">
        <div class="m-item-box">
          <img :src="item.coverUrl">
          <!-- 播放量 -->
          <div class="m-playCount"><span></span>{{item.praisedCount}}</div>
        </div>
        <div class="m-item-desc">
          <!-- 标题 -->
          <div class="m-song-name">{{item.title}}</div>
        </div>
      </div>
      <p class="m-loading" v-show="isLoading">载入中
        <a-icon type="loading" />
      </p>
    </div>
  </div>
</template>

<script>
import videoLibrary from '@/api/videoLibrary.js'
const api = new videoLibrary()
export default {
  data () {
    return {
      tabs: [],
      allTabs: [],
      curTabs: '全部视频',
      isShowAllTabs: false,
      videos: [],
      tabId: '',
      offset: 0,
      isLoading: false
    }
  },
  created () {
    this.getAllVideo()
    this.getVideoGroupList()
  },
  methods: {
    // 切换tab
    changeTab (index) {
      this.tabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.allTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curTabs = this.allTabs[index] ? this.allTabs[index].name : ''
      this.tabId = this.allTabs[index] ? this.allTabs[index].id : ''
      this.isShowAllTabs = false
      this.videos = []
      this.offset = 0
      if (this.tabId === '') return
      this.getVideoGroupAndCategoryById()
    },
    queryAllVideo () {
      this.changeTab(9999)
      this.curTabs = '全部视频'
      this.getAllVideo()
    },
    // 获取全部视频列表
    getAllVideo () {
      for (let i = 0; i < 3; i++) {
        this._getAllVideo()
        this.offset++
      }
    },
    async _getAllVideo () {
      const param = {
        offset: this.offset
      }
      const res = await api.getAllVideo(param)
      const list = res.data.datas
      list.forEach(item => {
        this.videos.push(item.data)
      })
      this.isLoading = false
    },
    // 获取视频标签列表
    async getVideoGroupList () {
      const param = {}
      const res = await api.getVideoGroupList(param)
      const data = res.data.data
      data.forEach(item => {
        this.allTabs.push({
          id: item.id,
          name: item.name,
          isActive: false
        })
      })
      this.tabs = this.allTabs.slice(0, 9)
    },
    // 获取标签下的视频
    getVideoGroupAndCategoryById () {
      for (let i = 0; i < 3; i++) {
        this._getVideoGroupAndCategoryById()
        this.offset++
      }
    },
    // 获取标签下的视频
    async _getVideoGroupAndCategoryById () {
      const param = {
        id: this.tabId,
        offset: this.offset
      }
      const res = await api.getVideoGroupAndCategoryById(param)
      const list = res.data.datas
      list.forEach(item => {
        this.videos.push(item.data)
      })
      this.isLoading = false
    },
    // 下拉加载
    scrollLoad () {
      this.isLoading = true
      this.curTabs === '全部视频' ? this.getAllVideo() : this.getVideoGroupAndCategoryById()
    },
    // 获取视频详情
    async getVideoDetail (id) {
      const param = { id }
      const res = await api.getVideoDetail(param)
      console.log(res)
    },
    // 播放视频
    handlePlay (val) {
      this.$router.push({ name: 'videoPage' })
      localStorage.setItem('videoId', JSON.stringify(val.vid))
    }
  }
}
</script>

<style scoped lang='less'>
.m-video-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .m-video-nav {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .m-left {
      .m-title {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        margin-bottom: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .m-right {
      .m-video-tabs {
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
  }
  .m-video-alltabs {
    position: absolute;
    left: 0;
    top: 50px;
    width: 600px;
    height: 350px;
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px;
    border-radius: 5px;
    z-index: 99;
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 4px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: #bbb;
    }
    h2 {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin: 0;
      &:hover {
        cursor: pointer;
      }
    }
    .m-allTabs-list {
      width: 100%;
      height: calc(~'100% - 30px');
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      .m-tabs-item {
        width: calc(~'100% / 6');
        text-align: center;
        height: 25px;
        font-size: 12px;
        margin: 5px 0;
        padding: 5px;
        &:hover {
          cursor: pointer;
        }
      }
      .active {
        background: #fcebeb;
        color: #ec4141;
        border-radius: 10px;
      }
    }
  }
  .m-video-list-wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .m-video-item {
      width: calc(~'100% / 3');
      height: 250px;
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
            background: url('../../assets/img/右三角.svg') no-repeat center
              center;
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
      &:nth-child(3n + 1) {
        padding: 0 10px 0 0;
      }
      &:nth-child(3n) {
        padding: 0 0 0 10px;
      }
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
