<template>
  <div class="m-album-wrap">
    <!-- 标签 -->
    <div class="m-tabs-wrap">
      <ul class="m-music-tabs-l">
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabl(index)" v-for="(item,index) in tabsl" :key="item.name">{{item.name}}</li>
      </ul>
      <ul class="m-music-tabs-r">
        <li :class="item.isActive?'m-tabs-item active':'m-tabs-item'" @click="changeTabr(index)" v-for="(item,index) in tabsr" :key="item.name">{{item.name}}</li>
      </ul>
    </div>
    <!-- 列表 -->
    <div class="m-album-list">
      <!-- 本周新碟 -->
      <div class="m-week-album">
        <div class="m-left">
          <h2>本周新碟</h2>
        </div>
        <div class="m-right">
          <p v-show="!isShowMusicList" class="m-loading">载入中
            <a-icon type="loading" />
          </p>
          <div class="m-week-album-list">
            <div class="m-album-item" v-for="item in weekData" :key="item.id">
              <div class="m-img">
                <img :src="item.picUrl">
                <!-- 播放按钮 -->
                <div class="m-play-btn" @click="getAlbumList(item.id)">
                  <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
                </div>
              </div>
              <p class="m-album-name">{{item.name}}</p>
              <p class="m-album-singer">{{item.artist.name}}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 本月新碟 -->
      <div class="m-month-album" v-show="isShowMusicList">
        <div class="m-left">
          <h2>本月新碟</h2>
        </div>
        <div class="m-right">
          <div class="m-month-album-list">
            <div class="m-album-item" v-for="item in monthData" :key="item.id">
              <div class="m-img">
                <img :src="item.picUrl">
                <!-- 播放按钮 -->
                <div class="m-play-btn" @click="getAlbumList(item.id)">
                  <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
                </div>
              </div>
              <p class="m-album-name">{{item.name}}</p>
              <p class="m-album-singer">{{item.artist.name}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import musicLibrary from '@/api/musicLibrary.js'
const api = new musicLibrary()
export default {
  data () {
    return {
      tabsl: [
        {
          name: '全部',
          value: 'ALL',
          isActive: true
        },
        {
          name: '华语',
          value: 'ZH',
          isActive: false
        },
        {
          name: '欧美',
          value: 'EA',
          isActive: false
        },
        {
          name: '日本',
          value: 'JP',
          isActive: false
        },
        {
          name: '韩国',
          value: 'KR',
          isActive: false
        }
      ],
      tabsr: [
        {
          name: '推荐',
          value: 'hot',
          isActive: true
        },
        {
          name: '全部',
          value: 'new',
          isActive: false
        }
      ],
      curTabsl: 'ALL',
      curTabsr: 'hot',
      limit: 50,
      offset: 0,
      isShowMusicList: false,
      // 周新碟
      weekData: [],
      // 月新碟
      monthData: [],
      playlist: []
    }
  },
  created () {
    this.getNewAlbum()
  },
  methods: {
    // 切换tab
    changeTabl (index) {
      this.tabsl.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curTabsl = this.tabsl[index] ? this.tabsl[index].value : ''
      this.weekData = []
      this.monthData = []
      this.isShowMusicList = false
      this.getNewAlbum()
    },
    changeTabr (index) {
      this.tabsr.forEach((item, i) => {
        item.isActive = index === i ? true : false
      })
      this.curTabsr = this.tabsr[index] ? this.tabsr[index].value : ''
      this.weekData = []
      this.monthData = []
      this.isShowMusicList = false
      this.getNewAlbum()
    },
    // 获取新碟上架
    async getNewAlbum () {
      const param = {
        area: this.curTabsl,
        limit: this.limit,
        offset: this.offset,
        type: this.curTabsr
      }
      const res = await api.getNewAlbum(param)
      this.weekData = res.data.weekData.slice(0, this.limit)
      this.monthData = res.data.monthData.slice(0, this.limit)
      this.isShowMusicList = true
    },
    // 获取专辑列表
    async getAlbumList (id) {
      const params = { id }
      const res = await api.getAlbumList(params)
      const songs = res.data.songs
      this.playlist = []
      songs.forEach(item => {
        this.playlist.push({
          musicId: item.id,
          musicName: item.name,
          alia: '',
          alName: '',
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: ''
        })
      })
      this.playMusic(this.playlist[0])
    },
    // 播放音乐
    playMusic (val) {
      // 将搜索到的数据插入到播放列表
      this.$store.commit('play/SET_PALY_LIST', this.playlist)
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', val)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
    }
  }
}
</script>

<style scoped lang='less'>
.m-album-wrap {
  .m-tabs-wrap {
    display: flex;
    .m-music-tabs-l {
      width: 50%;
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
    .m-music-tabs-r {
      width: 50%;
      height: 25px;
      display: flex;
      justify-content: flex-end;
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
        background: #ecf8f2;
        color: #3bba7d;
        border-radius: 5px;
      }
    }
  }
  .m-album-list {
    margin-top: 20px;
    .m-week-album {
      margin-bottom: 50px;
    }
    .m-week-album,
    .m-month-album {
      width: 100%;
      display: flex;
      .m-left {
        width: 8%;
        h2 {
          margin: 0;
          font-size: 20px;
          color: #333;
          writing-mode: vertical-lr;
          height: 100px;
        }
      }
      .m-right {
        width: 92%;
        .m-loading {
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          margin: 0;
        }
        .m-week-album-list,
        .m-month-album-list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .m-album-item {
            width: calc(~'100% / 5');
            height: 240px;
            &:hover {
              cursor: pointer;
            }
            .m-img {
              width: 180px;
              height: 180px;
              position: relative;
              &:hover {
                .m-play-btn {
                  display: flex;
                }
              }
              img {
                width: 100%;
                height: 100%;
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
            }
            .m-album-name {
              height: 24px;
              line-height: 24px;
              color: #333;
              margin: 0;
            }
            .m-album-singer {
              height: 24px;
              line-height: 24px;
              font-size: 12px;
              color: #9f9f9f;
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
