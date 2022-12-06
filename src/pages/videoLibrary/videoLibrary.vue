<template>
  <div class="m-main">
    <main>
      <a-tabs v-model="activeKey" :animated="false" @change="changeTab">
        <a-tab-pane v-for="(item,index) in tabList" :key="index" :tab="item.tabName">
          <div class="m-curPage-wrap">
            <!-- 渲染路由 -->
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </div>
        </a-tab-pane>
      </a-tabs>
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 默认标签页索引
      activeKey: 0,
      // 标签页数据
      tabList: [
        {
          tabName: '视频'
        },
        {
          tabName: 'MV'
        }
      ]
    }
  },
  created () {
    const activeKey = JSON.parse(sessionStorage.getItem('active-video-level-two'))
    this.activeKey = activeKey ? activeKey : 0
    this.changeTab(this.activeKey)
    this.$router.beforeEach((to, from, next) => {
      if (to.name === 'VideoLibrary') {
        const key = JSON.parse(sessionStorage.getItem('active-video-level-two'))
        this.changeTab(key)
      }
      next()
    })
  },
  methods: {
    changeTab (key) {
      switch (key) {
        case 0:
          this.$router.push({ name: 'Video' })
          break;
        case 1:
          this.$router.push({ name: 'Mv' })
          break;
        default:
          break;
      }
      sessionStorage.setItem('active-video-level-two', key)
    }
  }
}
</script>

<style scoped lang='less'>
.m-main {
  width: calc(~'100% - 201px');
  height: 100%;
  position: relative;
  main {
    width: 100%;
    height: 100%;
    .m-curPage-wrap {
      padding: 10px 20px !important;
    }
  }
}
</style>

<style lang="less">
.m-main {
  // 重置标签页样式--start
  .ant-tabs {
    height: 100%;
    .ant-tabs-top-content {
      height: calc(~'100% - 70px');
      // 标签页内容区溢出显示滚动条
      overflow: auto;
      overflow-x: hidden;
      // 滚动条样式
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: #bbb;
      }
    }
  }
  .ant-tabs-nav {
    .ant-tabs-tab {
      padding: 12px 0;
      &:hover {
        color: #000;
      }
    }
  }
  .ant-tabs-bar {
    border-bottom: none;
    margin-bottom: 5px;
    padding: 10px 20px;
  }
  .ant-tabs-tab-active {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .ant-tabs-ink-bar {
    background-color: rgba(74, 188, 118, 0.5);
  }
  // 重置标签页样式--end
}
</style>
