<template>
  <!-- 歌手 -->
  <div class="m-singer-wrap">
    <!-- 歌手列表 -->
    <div class="m-singer-inner" v-show="!isShowSingerDetail">
      <!-- 筛选条件 -->
      <div class="m-allsinger">
        <ul class="m-singer-tabs">
          <li class="m-tabs-title">语种:</li>
          <ul class="m-tabs-items">
            <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabByArea(index)" v-for="(item,index) in areaTabs" :key="item.name">{{item.name}}</li>
          </ul>
        </ul>
        <ul class="m-singer-tabs">
          <li class="m-tabs-title">分类:</li>
          <ul class="m-tabs-items">
            <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabByType(index)" v-for="(item,index) in typeTabs" :key="item.name">{{item.name}}</li>
          </ul>
        </ul>
        <ul class="m-singer-tabs">
          <li class="m-tabs-title">筛选:</li>
          <ul class="m-tabs-items">
            <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabBySort(index)" v-for="(item,index) in sortTabs" :key="item.name">{{item.name}}</li>
          </ul>
        </ul>
      </div>
      <!-- 歌手列表 -->
      <div class="m-singer-list infinite-list" v-infinite-scroll="scrollLoad" :infinite-scroll-immediate="false" :infinite-scroll-delay="1000">
        <div class="m-singer-item infinite-list-item" @click="querySingerInfo(item)" v-for="(item,index) in singerlist" :key="index">
          <img class="m-singer-img" :src="item.picUrl" alt="">
          <p class="m-singer-name">{{item.name}}</p>
        </div>
        <p class="m-loading" v-show="isLoading">载入中
          <a-icon type="loading" />
        </p>
      </div>
    </div>
    <!-- 歌手详情 -->
    <SingerDetail v-show="isShowSingerDetail" @goBackSinger="handleGoBack" :singerInfo="singerInfo"></SingerDetail>
  </div>
</template>

<script>
import SingerDetail from '@/components/singer/singerDetail.vue'
import musicLibrary from '@/api/musicLibrary.js'
const api = new musicLibrary()
export default {
  data () {
    return {
      // 歌手列表
      singerlist: [],
      areaTabs: [
        {
          name: '全部',
          value: -1,
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
        },
        {
          name: '其他',
          value: 0,
          isActive: false
        }
      ],
      typeTabs: [
        {
          name: '全部',
          value: -1,
          isActive: true
        },
        {
          name: '男歌手',
          value: 1,
          isActive: false
        },
        {
          name: '女歌手',
          value: 2,
          isActive: false
        },
        {
          name: '乐队组合',
          value: 3,
          isActive: false
        }
      ],
      sortTabs: [
        {
          name: '热门',
          value: -1,
          isActive: true
        },
        {
          name: 'A',
          value: 'a',
          isActive: false
        },
        {
          name: 'B',
          value: 'b',
          isActive: false
        },
        {
          name: 'C',
          value: 'c',
          isActive: false
        },
        {
          name: 'D',
          value: 'd',
          isActive: false
        },
        {
          name: 'E',
          value: 'e',
          isActive: false
        },
        {
          name: 'F',
          value: 'f',
          isActive: false
        },
        {
          name: 'G',
          value: 'g',
          isActive: false
        },
        {
          name: 'H',
          value: 'h',
          isActive: false
        },
        {
          name: 'I',
          value: 'i',
          isActive: false
        },
        {
          name: 'J',
          value: 'j',
          isActive: false
        },
        {
          name: 'K',
          value: 'k',
          isActive: false
        },
        {
          name: 'L',
          value: 'l',
          isActive: false
        },
        {
          name: 'M',
          value: 'm',
          isActive: false
        },
        {
          name: 'N',
          value: 'n',
          isActive: false
        },
        {
          name: 'O',
          value: 'o',
          isActive: false
        },
        {
          name: 'P',
          value: 'p',
          isActive: false
        },
        {
          name: 'Q',
          value: 'q',
          isActive: false
        },
        {
          name: 'R',
          value: 'r',
          isActive: false
        },
        {
          name: 'S',
          value: 's',
          isActive: false
        },
        {
          name: 'T',
          value: 't',
          isActive: false
        },
        {
          name: 'U',
          value: 'u',
          isActive: false
        },
        {
          name: 'V',
          value: 'v',
          isActive: false
        },
        {
          name: 'W',
          value: 'w',
          isActive: false
        },
        {
          name: 'X',
          value: 'x',
          isActive: false
        },
        {
          name: 'Y',
          value: 'y',
          isActive: false
        },
        {
          name: 'Z',
          value: 'z',
          isActive: false
        },
        {
          name: '#',
          value: 0,
          isActive: false
        }
      ],
      curArea: -1,
      curType: -1,
      curSort: -1,
      limit: 30,
      offset: 0,
      isLoading: false,
      isShowSingerDetail: false,
      singerInfo: {}
    }
  },
  components: {
    SingerDetail
  },
  methods: {
    // 切换tab
    changeTabByArea (index) {
      this.areaTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curArea = this.areaTabs[index] ? this.areaTabs[index].value : -1
      this.offset = 0
      this.singerlist = []
      this.getSingerList()
    },
    changeTabByType (index) {
      this.typeTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curType = this.typeTabs[index] ? this.typeTabs[index].value : -1
      this.offset = 0
      this.singerlist = []
      this.getSingerList()
    },
    changeTabBySort (index) {
      this.sortTabs.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curSort = this.sortTabs[index] ? this.sortTabs[index].value : -1
      this.offset = 0
      this.singerlist = []
      this.getSingerList()
    },
    // 获取歌手列表
    async getSingerList () {
      const param = {
        limit: this.limit,
        offset: this.offset,
        initial: this.curSort,
        type: this.curType,
        area: this.curArea
      }
      const res = await api.getSingerList(param)
      this.singerlist.push(...res.data.artists)
      this.isLoading = false
    },
    // 无限滚动加载
    scrollLoad () {
      this.isLoading = true
      this.getSingerList()
      this.offset++
    },
    // 查看歌手详情
    querySingerInfo (val) {
      this.isShowSingerDetail = true
      this.singerInfo = val
    },
    handleGoBack () {
      this.isShowSingerDetail = false
    }
  }
}
</script>

<style scoped lang='less'>
.m-singer-wrap {
  .m-allsinger {
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
    .m-singer-tabs {
      height: 25px;
      display: flex;
      margin-bottom: 10px;
      .m-tabs-title {
        width: 40px;
        font-size: 12px;
        height: 100%;
        line-height: 25px;
      }
      .m-tabs-items {
        width: calc(~'100% - 100px');
        display: flex;
        flex-wrap: wrap;
        .m-tabs-item {
          width: calc(~'100% / 18');
          white-space: nowrap;
          height: 100%;
          font-size: 12px;
          margin: 0 15px;
          padding: 5px;
          text-align: center;
          margin-bottom: 5px;
          &:hover {
            cursor: pointer;
          }
        }
        .active {
          background: #f4fbf8;
          color: #3bba7d;
          border-radius: 5px;
        }
      }
    }
  }
  .m-singer-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
    .m-singer-item {
      width: calc(~'(100% - 100px ) / 6');
      height: 200px;
      .m-singer-img {
        width: 160px;
        height: 160px;
        border-radius: 5px;
      }
      .m-singer-name {
        height: 40px;
        line-height: 30px;
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
