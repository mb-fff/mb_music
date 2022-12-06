import musicLibrary from '@/api/musicLibrary'
import videoLibrary from '@/api/videoLibrary'
const musicApi = new musicLibrary()
const videoApi = new videoLibrary()

const state = {
  // 当前播放音乐的信息
  curPlayingMusicInfo: {
    // id
    musicId: '',
    // 名称
    musicName: '',
    // 歌手
    singer: '',
    // icon
    musicIcon: '',
    // 歌词
    musicSong: {},
    // 时长
    musicDuration: 0,
    // 链接
    musicURL: ''
  },
  // 音乐加载状态
  playLoading: false,
  // 播放列表显示状态
  isShowPlaylist: false,
  // 播放列表
  playlist: [],
  // mv信息
  mvInfo: {
    mvId: '',
    // mv地址
    mvUrl: ''
  },
  // 视频信息
  videoInfo: {
    videoId: '',
    videoUrl: ''
  },
  // 歌词展示状态
  isShowLyrics: false,
  // 当前播放时间
  curPlayTime: 0,
  // 登录框展示状态
  isShowLogin: false
}

const mutations = {
  SET_MUSIC_ID (state, musicId) {
    state.curPlayingMusicInfo.musicId = musicId
  },
  SET_MUSIC_NAME (state, musicName) {
    state.curPlayingMusicInfo.musicName = musicName
  },
  SET_SINGER (state, singer) {
    state.curPlayingMusicInfo.singer = singer
  },
  SET_MUSIC_ICON (state, musicIcon) {
    state.curPlayingMusicInfo.musicIcon = musicIcon
  },
  SET_MUSIC_SONG (state, musicSong) {
    state.curPlayingMusicInfo.musicSong = musicSong
  },
  SET_MUSIC_DURATION (state, musicDuration) {
    state.curPlayingMusicInfo.musicDuration = musicDuration
  },
  SET_MUSIC_URL (state, musicURL) {
    state.curPlayingMusicInfo.musicURL = musicURL
  },
  SET_PLAY_LOADING (state, type) {
    state.playLoading = type
  },
  SET_ISSHOW_PLAYLIST (state, type) {
    if (type === 1) {
      state.isShowPlaylist = false
    } else {
      state.isShowPlaylist = !state.isShowPlaylist
    }
  },
  SET_MUSIC_INFO (state, musicinfo) {
    state.curPlayingMusicInfo = musicinfo
  },
  SET_PALY_LIST (state, playlist) {
    state.playlist = playlist
  },
  SET_MV_ID (state, id) {
    state.mvInfo.mvId = id
  },
  SET_MV_URL (state, url) {
    state.mvInfo.mvUrl = url
  },
  SET_VIDEO_ID (state, id) {
    state.videoInfo.videoId = id
  },
  SET_VIDEO_URL (state, url) {
    state.videoInfo.videoUrl = url
  },
  SET_ISSHOW_LYRICS (state) {
    state.isShowLyrics = !state.isShowLyrics
  },
  SET_CUR_PLAY_TIME (state, curPlayTime) {
    state.curPlayTime = curPlayTime
  },
  SET_ISSHOW_LOGIN (state, curState) {
    state.isShowLogin = curState
  }
}

const actions = {
  // 根据音乐id获取音乐资源
  async play ({ commit, state }) {
    commit('SET_CUR_PLAY_TIME', 0)
    commit('SET_PLAY_LOADING', true)
    const res = await musicApi.getMusicResById({ id: state.curPlayingMusicInfo.musicId })
    const url = res.data.data[0].url
    commit('SET_MUSIC_URL', url)
    commit('SET_PLAY_LOADING', false)
  },
  // 获取歌词
  async getlyric ({ commit, state }) {
    const res = await musicApi.getlyricById({ id: state.curPlayingMusicInfo.musicId })
    const songs = res.data.lrc
    commit('SET_MUSIC_SONG', songs)
  },
  // 根据mvid获取mv地址
  async getMvUrl ({ commit, state }) {
    const res = await videoApi.getMvUrl({ id: state.mvInfo.mvId })
    const url = res.data.data.url
    commit('SET_MV_URL', url)
  },
  // 根据videoId获取视频地址
  async getVideoUrl ({ commit, state }) {
    const res = await videoApi.getVideoUrl({ id: state.videoInfo.videoId })
    const url = res.data.urls[0].url
    commit('SET_VIDEO_URL', url)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}