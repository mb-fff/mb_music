<template>
  <!-- 最新音乐 -->
  <div class="m-latest-music">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="新歌速递" name="music">
        <Music></Music>
      </el-tab-pane>
      <el-tab-pane label="新碟上架" name="album">
        <Album></Album>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Music from '@/components/latestMusic/Music.vue'
import Album from '@/components/latestMusic/Album.vue'
export default {
  data () {
    return {
      activeName: 'music'
    }
  },
  components: {
    Music,
    Album
  }
}
</script>

<style scoped lang='less'>
.m-latest-music {
}
</style>

<style lang="less">
.m-latest-music {
  .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid #ccc;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: 1px solid #ccc;
    border-bottom: none;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  .el-tabs__item {
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    &:hover {
      color: #333;
    }
    &.is-active {
      color: #333;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
