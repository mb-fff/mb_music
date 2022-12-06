<template>
  <div class="m-section">
    <section>
      <ul class="m-navList">
        <li :class="item.isActive?'m-navItem m-active':'m-navItem'" @click="changeActive(item)" v-for="item in navList" :key="item.name">{{item.name}}</li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 导航数据
      navList: [
        {
          name: '音乐库',
          isActive: true,
          routerName: 'MusicLibrary'
        },
        {
          name: '视频库',
          isActive: false,
          routerName: 'VideoLibrary'
        },
        {
          name: '我的音乐',
          isActive: false,
          routerName: 'MyMusic'
        }
      ]
    }
  },
  created () {
    const activeName = sessionStorage.getItem('active-level-one')
    if (activeName) {
      this.navList.forEach(item => {
        item.isActive = activeName === item.routerName ? true : false
      })
    }
  },
  methods: {
    // 切换当前标签页
    changeActive (active) {
      this.navList.forEach(item => {
        item.isActive = active.name === item.name ? true : false
      })
      sessionStorage.setItem('active-level-one', active.routerName)
      this.$router.push({ name: active.routerName })
    }
  }
}
</script>

<style scoped lang='less'>
.m-section {
  width: 200px;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  section {
    width: 100%;
    height: 100%;
    .m-navList {
      padding: 10px;
      .m-navItem {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
        text-align: start;
        padding: 6px 20px;
        &:hover {
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          color: #000;
        }
      }
      .m-active {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        font-weight: bold;
        color: #000;
      }
    }
  }
}
</style>
