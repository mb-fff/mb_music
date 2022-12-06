<template>
  <div>
    <div v-show="!isShowAutorDetail" @click="isDrop = false">
      <div class="header">
        <span class="title">精品歌单</span>
        <div class="btn" @click.stop="isDrop = true">
          <span><i class="iconfont icon-loudou" />{{cat}}</span>
        </div>
      </div>
      <div style="position: relative;">
        <div class="dropDown" v-show="isDrop">
          <div class="dropHeader" @click="getAllList">
            <span>全部歌单</span>
          </div>
          <div class="dropBody" @click.stop="isDrop = true">
            <li v-for="item in categories" :key="item.id">
              <span @click="getCatPalyList({cat: item.name})" @click.stop="isDrop = false">{{item.name}}</span>
            </li>
          </div>
        </div>
      </div>
      <div class="list" v-infinite-scroll="load" :infinite-scroll-immediate="false" :infinite-scroll-delay="1000">
        <div class="listItem" v-for="item in playList" :key="item.id">
          <div class="listImg" @click="listDetail(item.id)">
            <img :src="item.coverImgUrl">
            <div class="m-playCount"><span></span>{{item.playCount | playCountFormat}}</div>
            <!-- 播放 -->
            <div class="m-play-btn" @click.stop="getPlayListDetailData(item.id)">
              <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
            </div>
          </div>
          <div class="listTxt">
            <div class="listName">
              <span class="nameItem" @click="listDetail(item.id)">{{item.name}}</span>
            </div>
            <div class="autorName">
              <span @click.stop="getAutor(item.creator.userId)">by {{item.creator.nickname}}</span>
              <span v-if="item.creator.avatarDetail" class="vip">
                <img :src="item.creator.avatarDetail.identityIconUrl">
              </span>
            </div>
            <div class="tags"><span>{{item.tag}}</span></div>
          </div>
        </div>
        <p class="m-loading" v-show="isLoading">载入中
          <a-icon type="loading" />
        </p>
      </div>
    </div>
    <!-- 作者 -->
    <AutorDetail v-show="isShowAutorDetail" @goBackAutor="handleGoBack" :autorId="autorId"></AutorDetail>
  </div>
</template>

<script>
import musicLibrary from '@/api/musicLibrary'
const api = new musicLibrary()
import AutorDetail from './AutorDetail'
export default {
  components: {
    AutorDetail
  },
  data () {
    return {
      highList: [],
      playList: [],
      cat: '全部',
      isLoading: false,
      autorId: '',
      isShowAutorDetail: false,
      isDrop: false,
      categories: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      await this.getList({ limit: 20 })
      this.playList = this.highList
      this.getHighTags()
    },
    // 每次获取20条歌单
    async getList (params) {
      await api.getHighquality(params).then(res => {
        if (res.data.code === 200) {
          this.highList = res.data.playlists
        }
      })
      this.isLoading = false
    },
    // 获取精品歌单列表标签
    getHighTags () {
      api.getHighTags().then(res => {
        if (res.data.code === 200) {
          this.categories = res.data.tags
        }
      })
    },
    // 跳转至列表详情页
    listDetail (id) {
      this.$router.push({ path: '/musicLibrary/listDetail', query: { id } })
      sessionStorage.setItem('active-music-level-two', 5)
    },
    // 滚动加载
    async load () {
      this.isLoading = true
      console.log(123);
      if (!this.playList.length) {
        return
      }
      const before = this.playList[this.playList.length - 1].updateTime
      const params = {
        limit: 20,
        before,
        cat: this.cat
      }
      await this.getList(params)
      this.playList.push(...this.highList)
    },
    // 获取全部类型歌单
    getAllList () {
      const params = { cat: '全部' }
      this.getCatPalyList(params)
    },
    // 获取不同类型歌单
    async getCatPalyList (params) {
      params.limit = 20
      this.cat = params.cat
      await this.getList(params)
      this.playList = this.highList
    },
    // 获取歌单列表
    async getPlayListDetailData (id) {
      const res = await api.getPlayListDetailData({ id })
      const [tracks, playlist] = [res.data.playlist.tracks, []]
      tracks.forEach(item => {
        playlist.push({
          musicId: item.id,
          musicName: item.name,
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: ''
        })
      })
      this.$store.commit('play/SET_PALY_LIST', playlist)
      // 默认播放第一首
      this.$store.commit('play/SET_MUSIC_INFO', playlist[0])
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    },
    // 查看作者信息
    getAutor (autorId) {
      this.autorId = autorId
      this.isShowAutorDetail = true
    },
    handleGoBack () {
      this.isShowAutorDetail = false
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 20px;
    font-weight: bold;
  }
  .btn {
    border: solid 1px #8b8686;
    border-radius: 14px;
    overflow: hidden;
    padding: 1px 8px;
  }
  .btn:focus,
  .btn:hover {
    cursor: pointer;
    background-color: #cdccd3;
  }
}
.dropDown {
  width: 70%;
  position: absolute;
  top: 10px;
  right: 0;
  z-index: 2;
  background-color: #e5f0f3;
  border: solid 1px #c3b8b8;
  border-radius: 5px;
  box-shadow: 0 1px 2px #9b959f;
  .dropHeader {
    height: 50px;
    line-height: 50px;
    font-size: 15px;
    border-bottom: solid 1px #a7a2a2;
    span {
      margin-left: 20px;
      padding: 6px 12px;
      border-radius: 50px;
    }
  }
  .dropHeader:focus,
  .dropHeader:hover {
    cursor: pointer;
    color: #ef4242;
  }
  .dropBody {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    li {
      padding: 20px 30px;
      span:focus,
      span:hover {
        cursor: pointer;
        color: #ef4242;
      }
    }
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  .listItem {
    width: 50%;
    display: flex;
    margin-top: 20px;
    align-items: center;
    .listImg {
      height: 150px;
      width: 150px;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
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
      .m-play-btn {
        width: 30px;
        height: 30px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        position: absolute;
        right: 10px;
        bottom: 10px;
        display: none;
        justify-content: center;
        align-items: center;
      }
      img {
        height: 100%;
      }
      &:hover {
        cursor: pointer;
        .m-play-btn {
          display: flex;
        }
      }
    }
    .listImg:focus,
    .listImg:hover {
      cursor: pointer;
    }
    .listTxt {
      flex: 1;
      margin-left: 10px;
      padding-right: 10px;
      width: 0;
      .listName {
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .autorName {
        color: #8b8686;
        margin: 20px 0;
        .vip {
          margin-left: 3px;
          img {
            height: 16px;
          }
        }
      }
      .autorName span:focus,
      .autorName span:hover,
      .nameItem:focus,
      .nameItem:hover {
        cursor: pointer;
        color: #0e0e0e;
      }
      .tags {
        span {
          color: #d33333;
          border: solid 1px #d33333;
          border-radius: 2px;
          padding: 2px;
        }
      }
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
</style>
