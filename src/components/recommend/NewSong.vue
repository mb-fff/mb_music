<template>
  <div>
    <!-- title -->
    <h2 class="m-title">最新音乐
      <a-icon type="right" style="font-size:16px;color:#000" />
    </h2>
    <!-- 列表 -->
    <div class="m-newsong-list">
      <div class="m-newsong-item" v-for="item in newSongList" :key="item.id">
        <div class="m-item-img">
          <img :src="item.picUrl">
          <!-- 播放按钮 -->
          <div class="m-play-btn" @click="handlePlay(item)">
            <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
          </div>
        </div>
        <div class="m-item-content">
          <!-- 歌曲名称 -->
          <div class="m-songname">
            <span style="color:#000">{{item.name}}</span>
            <span>{{item.song.alias[0]?`(${item.song.alias[0]})`:""}}</span>
          </div>
          <!-- 歌手名称 -->
          <div class="m-singer">
            <span></span>
            <span>{{item.song.artists[0].name}}</span>
          </div>
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
      // 最新音乐
      newSongList: []
    }
  },
  created () {
    this.getNewSongData()
  },
  methods: {
    //  获取最新音乐
    async getNewSongData () {
      const param = {
        limit: 12
      }
      const res = await api.getNewSongData(param)
      if (res.status !== 200) return
      this.newSongList = res.data.result
    },
    // 获取歌单列表
    handlePlay (item) {
      // 播放当前音乐
      const musicinfo = {
        musicId: item.id,
        musicName: item.name,
        singer: item.song.artists[0].name,
        musicIcon: item.picUrl,
        musicSong: '',
        musicDuration: Math.floor(item.song.duration / 1000),
        musicURL: ''
      }
      this.$store.commit('play/SET_MUSIC_INFO', musicinfo)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
      // 存入歌单列表
      const playlist = []
      this.newSongList.forEach(item => {
        playlist.push({
          musicId: item.id,
          musicName: item.name,
          singer: item.song.artists[0].name,
          musicIcon: item.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.song.duration / 1000),
          musicURL: ''
        })
      })
      this.$store.commit('play/SET_PALY_LIST', playlist)
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
.m-newsong-list {
  width: 100%;
  height: 280px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .m-newsong-item {
    width: calc(~'100% / 3');
    height: 50px;
    padding: 0 10px;
    margin-bottom: 20px;
    display: flex;
    &:nth-child(3n + 1) {
      padding: 0 10px 0 0;
    }
    &:nth-child(3n) {
      padding: 0 0 0 10px;
    }
    .m-item-img {
      width: 50px;
      height: 100%;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        background-size: cover;
      }
      .m-play-btn {
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .m-item-content {
      width: calc(~'100% - 50px');
      padding: 5px;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      .m-songname {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .m-singer {
        font-size: 12px;
      }
    }
  }
}
</style>
