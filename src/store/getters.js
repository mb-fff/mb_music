const getters = {
  curPlayingMusicInfo: state => state.play.curPlayingMusicInfo,
  playLoading: state => state.play.playLoading,
  isShowPlaylist: state => state.play.isShowPlaylist,
  playlist: state => state.play.playlist,
  mvInfo: state => state.play.mvInfo,
  videoInfo: state => state.play.videoInfo,
  isShowLyrics: state => state.play.isShowLyrics,
  curPlayTime: state => state.play.curPlayTime,
  isShowLogin: state => state.play.isShowLogin
}

export default getters