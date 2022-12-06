<template>
  <div class="m-globallist-wrap">
    <!-- 全球榜 -->
    <h2 class="m-title">全球榜</h2>
    <div class="m-globallist-inner">
      <div class="globallist-item" @click="getMusicList(item.id,index)" v-for="(item,index) in globalList" :key="item.id">
        <img :src="item.imgSrc" alt="">
        <!-- 播放按钮 -->
        <div class="m-play-btn">
          <a-icon type="caret-right" style="color:#3bba7d;font-size:18px" theme="filled" />
        </div>
        <!-- 播放量 -->
        <span class="m-playCount">{{item.playCount | playCountFormat}}</span>
        <!-- 榜单名称 -->
        <p class="m-list-name">{{item.name}}</p>
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
      // 全球榜
      globallist: []
    }
  },
  props: {
    globalList: {
      type: Array,
      required: true
    }
  },
  watch: {
    globalList (newV) {
      this.globallist = newV
    }
  },
  methods: {
    // 根据榜单id查询歌曲
    async getMusicList (id, index) {
      const param = {
        id
      }
      const res = await api.getPlayListDetailData(param)
      const tracks = res.data.playlist.tracks
      tracks.forEach(item => {
        this.globallist[index].playlist.push({
          musicId: item.id,
          musicName: item.name,
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: ''
        })
      })
      this.playMusic(index)
    },
    // 播放音乐
    playMusic (index) {
      const playlist = this.globallist[index].playlist
      // 将搜索到的数据插入到播放列表
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
.m-globallist-wrap {
  .m-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .m-globallist-inner {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .globallist-item {
      width: 200px;
      height: 250px;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 200px;
      }
      .m-playCount {
        position: absolute;
        right: 10px;
        top: 5px;
        font-size: 12px;
        color: #ddd;
      }
      .m-list-name {
        height: 50px;
        line-height: 40px;
        font-size: 14px;
        color: #333;
        margin: 0;
      }
      &:hover {
        cursor: pointer;
        .m-play-btn {
          display: flex;
        }
      }
      .m-play-btn {
        width: 30px;
        height: 30px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        display: none;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
