<template>
  <!-- 排行榜 -->
  <div class="m-rankinglist">
    <!-- 官方榜 -->
    <OffList v-show="!isShowDetailList" :officList="officList" @queryAll="handleQueryAll"></OffList>
    <!-- 全球榜 -->
    <GlobalList v-show="!isShowDetailList" :globalList="globalList"></GlobalList>
    <!-- 详细列表 -->
    <DetailList v-show="isShowDetailList" :detailList="detailList" @goBack="handleGoBack"></DetailList>
  </div>
</template>

<script>
import OffList from '@/components/rankingList/Offlist.vue'
import GlobalList from '@/components/rankingList/GlobalList.vue'
import DetailList from '@/components/rankingList/DetailList.vue'
import musicLibrary from '@/api/musicLibrary.js'
const api = new musicLibrary()
export default {
  data () {
    return {
      // 官方榜
      officList: [],
      // 全球榜
      globalList: [],
      // 详细列表
      detailList: {},
      // 详细列表展示
      isShowDetailList: false
    }
  },
  components: {
    OffList,
    GlobalList,
    DetailList
  },
  created () {
    this.getToplist()
  },
  methods: {
    //  获取所有榜单
    async getToplist () {
      const param = {}
      const res = await api.getToplist(param)
      const [list, officList, globalList] = [res.data.list, [], []]
      list.slice(0, 4).forEach(item => {
        officList.push({
          id: item.id,
          name: item.name,
          imgSrc: item.coverImgUrl,
          desc: item.description,
          playCount: item.playCount,
          updateTime: item.updateTime,
          playlist: []
        })
      })
      list.slice(4).forEach(item => {
        globalList.push({
          id: item.id,
          name: item.name,
          imgSrc: item.coverImgUrl,
          desc: item.description,
          playCount: item.playCount,
          updateTime: item.updateTime,
          playlist: []
        })
      })
      officList.forEach((item, index) => {
        this.getMusicList(item.id, index)
      })
      this.officList = officList
      this.globalList = globalList
    },
    // 根据榜单id查询歌曲
    async getMusicList (id, index) {
      const param = {
        id
      }
      const res = await api.getPlayListDetailData(param)
      const tracks = res.data.playlist.tracks
      tracks.forEach(item => {
        this.officList[index].playlist.push({
          musicId: item.id,
          musicName: item.name,
          alia: item.alia.length !== 0 ? item.alia[0] : '',
          alName: item.al.name,
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: ''
        })
      })
    },
    // 查看全部
    handleQueryAll (val) {
      this.isShowDetailList = true
      this.detailList = val
    },
    handleGoBack () {
      this.isShowDetailList = false
    }
  }
}
</script>

<style scoped lang='less'>
.m-rankinglist {
  position: relative;
}
</style>
