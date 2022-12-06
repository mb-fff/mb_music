<template>
  <div>
    <div v-show="!isShowAutorDetail" @click="isDrop = false">
      <div class="highquality">
        <div class="highPic">
          <img :src="highImg">
        </div>
        <div class="highTxt">
          <el-button @click="changeHigh"><i class="iconfont icon-Crown" /> 精品歌单</el-button>
          <div class="highTitle">{{ highTitle }}</div>
        </div>
      </div>
      <div class="btn">
        <el-button @click.stop="isDrop = true"> {{listType}}
          <a-icon type="right" />
        </el-button>
        <div class="hot">
          <el-tag v-for="item in hotList" :key="item.id" @click="getCatPalyList({cat: item.name})">
            {{item.name}}
          </el-tag>
        </div>
      </div>
      <div style="position: relative;">
        <div class="dropDown" v-show="isDrop">
          <div class="dropHeader" @click="getAllList">
            <span>全部歌单</span>
          </div>
          <div class="dropBody" @click.stop="isDrop = true">
            <ul v-for="(item,index) in categories" :key="index">
              <div class="catTitle">
                <i class="iconfont" :class="icon[index]" />
                <span>{{item}}</span>
              </div>
              <div class="catBody">
                <li v-for="sub in subs[index]" :key="sub.name" @click="getCatPalyList({cat: sub.name})" @click.stop="isDrop = false">
                  {{sub.name}}
                  <span v-if="sub.hot">HOT</span>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <div class="playList">
          <div class="pl-body">
            <div class="pl-item" v-for="item in playlists" :key="item.id">
              <div class="pl-item-box" @click="detail(item.id)">
                <img :src="item.coverImgUrl">
                <div class="m-playCount"><span></span>{{item.playCount | playCountFormat}}</div>
                <!-- 播放 -->
                <div class="m-play-btn" @click.stop="getPlayListDetailData(item.id)">
                  <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
                </div>
                <!-- 作者 -->
                <div class="m-play-autor" @click.stop="getAutor(item.creator.userId)">
                  <i class="el-icon-user" />
                  <span>{{item.creator.nickname}}</span>
                  <!-- vip信息 -->
                  <div v-if="item.creator.avatarDetail" style="display: inline-block;">
                    <img :src="item.creator.avatarDetail.identityIconUrl">
                  </div>
                </div>
              </div>
              <span>{{item.name}}</span>
            </div>
          </div>
          <div class="page">
            <el-pagination background layout="prev, pager,next" :page-size="50" :total="total" @current-change="currentChange">
            </el-pagination>
          </div>
        </div>
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
  props: {
    rollInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      highImg: '',
      highTitle: '',
      hotList: [],
      catlist: {},
      playlists: [],
      total: 0,
      categories: [],
      subs: {},
      type: this.$route.query.type || '全部',
      listType: '全部歌单',
      icon: [
        'icon-globe',
        'icon-baobao',
        'icon-coffee',
        'icon-weixiao',
        'icon-caidan'
      ],
      isDrop: false,
      autorId: '',
      isShowAutorDetail: false
    }
  },
  watch: {
    rollInfo (val) {
      if (val) {
        const { highImg, highTitle, hotList, catlist } = val
        this.highImg = highImg,
          this.highTitle = highTitle,
          this.hotList = hotList,
          this.catlist = catlist
        if (val.catlist) {
          const sub = {}
          const categories = []
          // 接口中categories是键值为自然数的对象（没有length属性）
          for (let item in val.catlist.categories) {
            categories[item] = val.catlist.categories[item]
          }
          categories.forEach((item, index) => sub[index] = [])
          val.catlist.sub.forEach(item => sub[item.category]?.push(item))
          this.categories = categories
          this.subs = sub
        }
      }
    },
    deep: true,
    immediate: true
  },
  mounted () {
    if (this.type) {
      this.getCatPalyList({ cat: this.type })
    }
    if (this.$route.query.userId) {
      this.isShowAutorDetail = true
    }
  },
  methods: {
    changeHigh () {
      this.$emit('changeHigh')
    },
    // 获取全部歌单
    getAllList () {
      this.listType = '全部歌单'
      this.playlists = this.rollInfo.playlists
      this.total = this.rollInfo.total
    },
    // 获取不同类型歌单
    getCatPalyList (params) {
      if (params.cat) {
        this.type = params.cat
        this.listType = params.cat
      } else {
        params.cat = '全部'
      }
      api.getplaylist(params).then(res => {
        if (res.data.code === 200) {
          this.playlists = res.data.playlists
          this.total = res.data.total
        }
      })
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
    // 进入歌单详情
    detail (id) {
      this.$router.push({ path: '/musicLibrary/listDetail', query: { id } })
      sessionStorage.setItem('active-music-level-two', 5)
    },
    // 查看作者信息
    getAutor (autorId) {
      this.autorId = autorId
      this.isShowAutorDetail = true
    },
    handleGoBack () {
      this.isShowAutorDetail = false
    },
    currentChange (evt) {
      const params = {
        offset: evt - 1,
        cat: this.type
      }
      this.getCatPalyList(params)
    }
  }
}
</script>

<style scoped lang='less'>
.highquality {
  display: flex;
  background: url('../../assets/img/highlist.jpg') no-repeat center center;
  background-size: cover;
  height: 200px;
  border-radius: 5px;
  padding: 20px;
  .highPic {
    height: 160px;
    border-radius: 5px;
    overflow: hidden;
    img {
      height: 100%;
    }
  }
  .highTxt {
    margin-left: 10px;
    button {
      margin-top: 20px;
      padding: 5px 12px;
      border-radius: 50px;
      background: rgba(0, 0, 0, 0);
      color: #dab43c;
      border: 1px solid #dab43c;
    }
    .highTitle {
      margin-top: 20px;
      font-size: 16px;
      color: #f55555;
    }
  }
}
.btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  button {
    width: 100px;
    padding: 6px 12px;
    border-radius: 50px;
    background: rgba(0, 0, 0, 0);
    color: #3c3939;
    border: 1px solid #80889d;
    .anticon {
      color: #3c3939;
      font-size: 14px;
    }
  }
  button:focus,
  button:hover {
    background-color: #cfcbcc;
  }
  .hot {
    span {
      background: rgba(0, 0, 0, 0);
      border: none;
      color: #565c61;
      cursor: default;
    }
    span:focus,
    span:hover {
      color: #2e2c2c;
    }
  }
}
.dropDown {
  width: 90%;
  position: absolute;
  top: 0;
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
      background-color: #e9d6da;
      color: #ef4242;
    }
  }
  .dropBody {
    padding: 10px;
    ul {
      display: flex;
      .catTitle {
        width: 200px;
        i {
          font-size: 22px;
          vertical-align: middle;
        }
        span {
          margin-left: 5px;
          color: #938b8b;
          vertical-align: middle;
        }
      }
      .catBody {
        flex: 1;
        li {
          margin: 0 20px 20px;
          display: inline-block;
          cursor: pointer;
          span {
            display: inline-block;
            margin-left: -8px;
            color: red;
            font-size: 12px;
            font-weight: bold;
            vertical-align: super;
            transform: scale(0.5);
            -webkit-transform: scale(0.5);
          }
        }
      }
    }
  }
}
.pl-body {
  display: flex;
  flex-wrap: wrap;
  min-height: 300px;
  .pl-item {
    width: calc(100% / 5);
    height: 250px;
    padding: 0 10px;
    margin-bottom: 10px;
    .pl-item-box {
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 5px;
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
      .m-play-autor {
        position: absolute;
        left: 10px;
        bottom: 0;
        color: #fff;
        span {
          margin: 5px;
          font-size: 13px;
          color: #fff;
        }
        img {
          width: 13px;
          height: 13px;
        }
      }
      &:hover {
        cursor: pointer;
        .m-play-btn {
          display: flex;
        }
      }
    }
    img {
      width: 100%;
      height: 200px;
    }
    span {
      color: #313234;
      display: inline-block;
    }
    &:nth-child(1) {
      padding: 0 10px 0 0;
    }
    &:nth-child(5) {
      padding: 0 0 0 10px;
    }
  }
}
.page {
  text-align: center;
  .el-pager li {
    font-weight: normal;
  }
  /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #ef5858;
    color: #fff;
  }
}
</style>

