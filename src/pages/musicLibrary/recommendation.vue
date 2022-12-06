<template>
  <!-- 个性推荐 -->
  <div>
    <!-- 轮播图 -->
    <Carousel></Carousel>
    <!-- 推荐歌单 -->
    <PlayList></PlayList>
    <!-- 独家放送 -->
    <PrivateContent></PrivateContent>
    <!-- 最新音乐 -->
    <NewSong></NewSong>
    <!-- 推荐MV -->
    <MV></MV>
  </div>
</template>

<script>
import Carousel from '../../components/recommend/Carousel.vue'
import PlayList from '../../components/recommend/PlayList.vue'
import PrivateContent from '../../components/recommend/PrivateContent.vue'
import NewSong from '../../components/recommend/NewSong.vue'
import MV from '../../components/recommend/MV.vue'
export default {
  data () {
    return {}
  },
  components: {
    Carousel,
    PlayList,
    PrivateContent,
    NewSong,
    MV
  }
}
</script>

<style scoped lang='less'>
</style>
