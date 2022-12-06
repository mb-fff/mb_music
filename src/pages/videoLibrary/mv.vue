<template>
  <div class="m-mv-wrap">
    <!-- 最新mv -->
    <nav class="m-mv-nav" v-show="isShowNav">
      <div class="m-left">
        <h2 class="m-title">最新MV
          <span @click="isShowNav=false">
            <a-icon type="right" style="font-size:16px;color:#000" />
          </span>
        </h2>
      </div>
      <div class="m-right">
        <ul class="m-mv-tabs">
          <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabByArea(index)" v-for="(item,index) in areaTabs" :key="item.name">{{item.name}}</li>
        </ul>
      </div>
    </nav>
    <!-- 全部mv -->
    <div class="m-allmv" v-show="!isShowNav">
      <h2 class="m-title">全部MV
        <span @click="isShowNav=true">
          <a-icon type="rollback" style="font-size:16px;color:#000" />
        </span>
      </h2>
      <ul class="m-mv-tabs">
        <li class="m-tabs-item">地区:</li>
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabByArea(index)" v-for="(item,index) in areaTabs" :key="item.name">{{item.name}}</li>
      </ul>
      <ul class="m-mv-tabs">
        <li class="m-tabs-item">类型:</li>
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabByType(index)" v-for="(item,index) in typeTabs" :key="item.name">{{item.name}}</li>
      </ul>
      <ul class="m-mv-tabs">
        <li class="m-tabs-item">排序:</li>
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabBySort(index)" v-for="(item,index) in sortTabs" :key="item.name">{{item.name}}</li>
      </ul>
    </div>
    <!-- mv列表 -->
    <div class="m-mv-list-wrap infinite-list" v-infinite-scroll="scrollLoad" :infinite-scroll-immediate="false" :infinite-scroll-delay="1000">
      <div class="m-mv-item" @click="handlePlay(item)" v-for="(item,index) in mvs" :key="index">
        <div class="m-item-box">
          <img :src="item.cover">
          <!-- 播放量 -->
          <div class="m-playCount"><span></span>{{item.playCount | playCountFormat}}</div>
        </div>
        <div class="m-item-desc">
          <!-- 歌曲名称 -->
          <div class="m-song-name">{{item.name}}</div>
          <!-- 歌手 -->
          <div class="m-singer">{{item.artistName}}</div>
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
      areaTabs: [
        {
          name: '全部',
          isActive: true
        },
        {
          name: '内地',
          isActive: false
        },
        {
          name: '港台',
          isActive: false
        },
        {
          name: '欧美',
          isActive: false
        },
        {
          name: '日本',
          isActive: false
        },
        {
          name: '韩国',
          isActive: false
        }
      ],
      typeTabs: [
        {
          name: '全部',
          isActive: true
        },
        {
          name: '官方版',
          isActive: false
        },
        {
          name: '原生',
          isActive: false
        },
        {
          name: '现场版',
          isActive: false
        },
        {
          name: '网易出品',
          isActive: false
        }
      ],
      sortTabs: [
        {
          name: '最新',
          isActive: true
        },
        {
          name: '最热',
          isActive: false
        },
        {
          name: '上升最快',
          isActive: false
        }
      ],
      curArea: '全部',
      curType: '全部',
      curSort: '最新',
      isShowNav: true,
      mvs: [],
      limit: 30,
      offset: 0,
      isLoading: false
    }
  },
  methods: {
    // 切换tab
    changeTabByArea (index) {
      this.areaTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curArea = this.areaTabs[index] ? this.areaTabs[index].name : ''
      this.offset = 0
      this.mvs = []
      this.getAllMV()
    },
    changeTabByType (index) {
      this.typeTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curType = this.typeTabs[index] ? this.typeTabs[index].name : ''
      this.offset = 0
      this.mvs = []
      this.getAllMV()
    },
    changeTabBySort (index) {
      this.sortTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curSort = this.sortTabs[index] ? this.sortTabs[index].name : ''
      this.offset = 0
      this.mvs = []
      this.getAllMV()
    },
    // 获取标签下mv
    async getAllMV () {
      const param = {
        area: this.curArea,
        type: this.curType,
        order: this.curSort,
        limit: this.limit,
        offset: this.offset
      }
      const res = await api.getAllMV(param)
      this.mvs.push(...res.data.data)
      this.isLoading = false
    },
    // 下拉加载
    scrollLoad () {
      this.isLoading = true
      this.getAllMV()
      this.offset++
    },
    // 播放mv
    handlePlay (val) {
      this.$router.push({ name: 'mvPage' })
      localStorage.setItem('mvId', JSON.stringify(val.id))
    }
  }
}
</script>

<style scoped lang='less'>
.m-mv-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .m-mv-nav {
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
      .m-mv-tabs {
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
  .m-allmv {
    height: 150px;
    padding-top: 8px;
    .m-title {
      font-size: 16px;
      font-weight: bold;
      color: #000;
      margin-bottom: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    .m-mv-tabs {
      height: 25px;
      display: flex;
      margin-bottom: 10px;
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
  .m-mv-list-wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .m-mv-item {
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

<style lang="less">
.m-mv-wrap {
  .ant-btn {
    border-radius: 20px;
    background: #ddd;
    &:hover,
    &:focus {
      color: #333;
      border-color: #ccc;
    }
  }
}
</style>
