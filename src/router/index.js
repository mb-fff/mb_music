import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/musicLibrary/recommendation',
    component: () => import(/* webpackChunkName:'home' */ '../pages/Home.vue'),
    children: [
      // 音乐库
      {
        path: '/musicLibrary',
        name: 'MusicLibrary',
        component: () => import(/* webpackChunkName:'musicLibrary' */ '../pages/musicLibrary/musicLibrary.vue'),
        children: [
          // 音乐库-个性推荐
          {
            path: '/musicLibrary/recommendation',
            name: 'Recommendation',
            component: () => import(/* webpackChunkName:'musicLibrary' */ '../pages/musicLibrary/recommendation.vue')
          },
          // 音乐库-歌单
          {
            path: '/musicLibrary/playList',
            name: 'PlayList',
            component: () => import(/* webpackChunkName:'musicLibrary' */ '../pages/musicLibrary/playList.vue')
          },
          // 歌单详情
          {
            path: '/musicLibrary/listDetail',
            name: 'ListDetail',
            component: () => import('../pages/musicLibrary/listDetail.vue'),
            meta: { isNotKeepAlive: true }
          },
          // 音乐库 -排行榜
          {
            path: '/musicLibrary/rankingList',
            name: 'Rankinglist',
            component: () => import(/* webpackChunkName:'musicLibrary' */ '../pages/musicLibrary/rankingList.vue')
          },
          // 音乐库 -歌手
          {
            path: '/musicLibrary/singer',
            name: 'Singer',
            component: () => import(/* webpackChunkName:'musicLibrary' */ '../pages/musicLibrary/singer.vue')
          },
          // 音乐库-最新歌单
          {
            path: '/musicLibrary/latestMusic',
            name: 'LatestMusic',
            component: () => import(/* webpackChunkName:'musicLibrary' */ '../pages/musicLibrary/latestMusic.vue')
          },
        ]
      },
      // 视频库
      {
        path: '/videoLibrary',
        name: 'VideoLibrary',
        component: () => import(/* webpackChunkName:'videoLibrary' */ '../pages/videoLibrary/videoLibrary.vue'),
        children: [
          // 视频库-个性推荐
          {
            path: '/videoLibrary/video',
            name: 'Video',
            component: () => import(/* webpackChunkName:'videoLibrary' */ '../pages/videoLibrary/video.vue')
          },
          // 视频库-歌单
          {
            path: '/videoLibrary/mv',
            name: 'Mv',
            component: () => import(/* webpackChunkName:'videoLibrary' */ '../pages/videoLibrary/mv.vue')
          },
        ]
      },
      // 我的音乐
      {
        path: '/myMusic',
        name: 'MyMusic',
        component: () => import(/* webpackChunkName:'myMusic' */ '../pages/myMusic/myMusic.vue')
      }
    ]
  },
  {
    path: '/mvPage',
    name: 'mvPage',
    component: () => import(/* webpackChunkName:'playPage' */ '../pages/MvPage.vue')
  },
  {
    path: '/videoPage',
    name: 'videoPage',
    component: () => import(/* webpackChunkName:'playPage' */ '../pages/VideoPage.vue')
  }
]

// 路由跳转报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
