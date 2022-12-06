<template>
  <!-- 歌单 -->
  <div>
    <!-- 精品歌单 -->
    <HighqualityList v-if="isHigh"></HighqualityList>
    <RollingLoadList v-else :rollInfo=rollInfo @changeHigh="isHigh = true" />
  </div>
</template>

<script>
import RollingLoadList from '../../components/playList/RollingLoadList.vue'
import HighqualityList from '../../components/playList/HighqualityList.vue'
import musicLibrary from '@/api/musicLibrary'
const api = new musicLibrary()
export default {
  components: {
    RollingLoadList,
    HighqualityList
  },
  data () {
    return {
      userId: this.$route.query.userId || '',
      isHigh: false,
      rollInfo: {
        highImg: '',
        highTitle: '',
        hotList: [],
        catlist: {},
        playlists: [],
        total: ''
      }
    }
  },
  mounted () {
    if (!this.userId) {
      this.init()
    }
  },
  activated () {
    this.isHigh = false
  },
  methods: {
    async init () {
      const rollInfo = {}
      const params = { limit: 20 }
      const res = await api.getHighquality(params)
      if (res.data.code === 200) {
        rollInfo.highImg = res.data.playlists[0]?.coverImgUrl
        rollInfo.highTitle = res.data.playlists[0]?.name
      }
      const hotListRes = await api.getHotList()
      if (hotListRes.data.code === 200) {
        rollInfo.hotList = hotListRes.data.tags
      }
      const catlistRes = await api.getCatlist()
      if (catlistRes.data.code === 200) {
        rollInfo.catlist = catlistRes.data
      }
      const playlistRes = await api.getplaylist()
      if (playlistRes.data.code === 200) {
        rollInfo.playlists = playlistRes.data.playlists
        rollInfo.total = playlistRes.data.total
      }
      this.rollInfo = rollInfo
    }
  }
}
</script>

<style scoped lang='less'>
</style>
