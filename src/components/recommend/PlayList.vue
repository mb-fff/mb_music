<template>
  <div>
    <!-- title -->
    <h2 class="m-title">推荐歌单
      <a-icon type="right" style="font-size:16px;color:#000" />
    </h2>
    <!-- 歌单列表 -->
    <div class="m-musiclist">
      <div class="m-musiclist-item" @click="getEveryDayRecommendMusic()">
        <div class="m-musiclist-item-box" style="background:rgba(0,0,0,.8)">
          <!-- 播放按钮 -->
          <div class="m-play-btn">
            <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
          </div>
        </div>
        <p class="m-musiclist-item-desc">每日歌曲推荐</p>
      </div>
      <!-- 推荐歌单 -->
      <div class="m-musiclist-item" v-for="item in playList" :key="item.id" @click="getPlayListDetailData(item.id)">
        <div class="m-musiclist-item-box">
          <!-- 图片 -->
          <img :src="item.picUrl">
          <!-- 播放量 -->
          <div class="m-playCount"><span></span>{{item.playCount | playCountFormat}}</div>
          <!-- 播放按钮 -->
          <div class="m-play-btn">
            <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
          </div>
        </div>
        <p class="m-musiclist-item-desc" :title="item.name">{{item.name}}</p>
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
      // 推荐歌单
      playList: []
    }
  },
  created () {
    this.getPlayListData()
  },
  methods: {
    // 获取推荐歌单
    async getPlayListData () {
      const param = {
        limit: 9
      }
      const res = await api.getPlayListData(param)
      if (res.status !== 200) return
      this.playList = res.data.result
    },
    // 获取歌单列表
    async getPlayListDetailData (id) {
      const param = {
        id
      }
      const res = await api.getPlayListDetailData(param)
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
    // 获取每日推荐音乐
    async getEveryDayRecommendMusic () {
      const param = {}
      const res = await api.getEveryDayRecommendMusic(param)
      const [songs, playlist] = [res.data.data.dailySongs, []]
      songs.forEach(item => {
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
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', playlist[0])
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
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
.m-musiclist {
  width: 100%;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .m-musiclist-item {
    width: calc(~'100% / 5');
    height: 250px;
    padding: 0 10px;
    .m-musiclist-item-box {
      width: 100%;
      height: 200px;
      position: relative;
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
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
    }
    .m-musiclist-item-desc {
      width: 100%;
      height: 50px;
      padding: 5px;
    }
    &:nth-child(1) {
      padding: 0 10px 0 0;
    }
    &:nth-child(5) {
      padding: 0 0 0 10px;
    }
    &:nth-child(6) {
      padding: 0 10px 0 0;
    }
    &:nth-child(10) {
      padding: 0 0 0 10px;
    }
    &:hover {
      cursor: pointer;
      .m-play-btn {
        display: flex;
      }
    }
  }
}
</style>
