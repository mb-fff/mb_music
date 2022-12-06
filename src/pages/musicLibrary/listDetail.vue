<template>
  <div>
    <div class="listHeader">
      <div class="Cover">
        <img :src="playlist.coverImgUrl">
      </div>
      <div class="info">
        <div class="listName">
          <div>
            <span class="Name-span">歌单</span>
            <span class="listTxt">{{playlist.name}}</span>
          </div>
          <div @click="goBack"><span class="back-span">返回</span></div>
        </div>
        <div class="infoCount">
          <div class="autor">
            <div class="autorDetail" @click="autorDetail(creator.userId)">
              <div class="Avatar">
                <img :src="creator.avatarUrl">
              </div>
              <div class="infoTag" v-if="creator.avatarDetail">
                <img :src="creator.avatarDetail.identityIconUrl">
              </div>
              <span class="autorName">{{creator.nickname}}</span>
            </div>
            <span>{{playlist.createTime | dateFormat}} 创建</span>
          </div>
          <div class="operate">
            <div class="op-dian">
              <div class="op-play" @click="allPlay"><i class="iconfont icon-you" style="font-size: 18px" />播放全部</div>
              <div class="op-add" @click="addList" title="添加全部到播放列表"><i class="iconfont icon-jiahao" /></div>
            </div>
            <el-button><i class="iconfont icon-collect" /><span>收藏（{{playlist.subscribedCount | playCountFormat}}）</span></el-button>
            <el-button><i class="iconfont icon-fenxiang" /><span>分享（{{playlist.shareCount | playCountFormat}}）</span></el-button>
            <el-button><i class="iconfont icon-xiazai" /><span>下载全部</span></el-button>
          </div>
          <div>
            <el-dialog title="替换播放列表" :visible.sync="playDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" center>
              <span>“播放全部”将会替换当前的播放列表是否继续？</span>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getPlayListDetailData">确 定</el-button>
                <el-button @click="playDialog = false">取 消</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
        <div class="infoContent">
          <div class="infoTxt">
            <div class="divTxt">标签：
              <span class="Txt tagTxt" v-for="(item, index) in tags" :key="index" @click="tagPlayList(item)">
                {{index>0?'/ ' + item:'' + item}}
              </span>
            </div>
            <div class="divTxt">歌曲：<span class="Txt">{{playlist.trackCount | playCountFormat}}</span>
              播放：<span class="Txt">{{playlist.playCount | playCountFormat}}</span>
            </div>
            <div class="divContent">
              <div :class="isZhankai && !isBottom ? '' : 'divDetail'" ref="divDetail">简介：<span class="TxtDetail" ref="TxtDetail">{{playlist.description}}</span></div>
              <div v-if="isZhankai" class="divBtn" @click="isBottom = !isBottom">
                <i v-if="isBottom" class="el-icon-caret-bottom" />
                <i v-else class="el-icon-caret-top" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="歌曲列表" name="first">
          <!-- 详细列表 -->
          <div class="m-list-wrap">
            <el-table :data="playListDetail" style="width: 100%;" size="mini">
              <el-table-column width="50" type="index">
              </el-table-column>
              <el-table-column prop="musicName" label="歌曲名称">
                <template slot-scope="scoped">
                  <span @click="playMusic(scoped.row)" class="m-musicName">{{scoped.row.musicName}}</span>
                  <span @click="playMusic(scoped.row)" class="m-alia">{{scoped.row.alia!==''?`(${scoped.row.alia})`:''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="singer" label="歌手">
              </el-table-column>
              <el-table-column prop="alName" label="专辑">
              </el-table-column>
              <el-table-column prop="musicDuration" width="60" label="时长">
                <template slot-scope="scoped">
                  {{scoped.row.musicDuration | formatMusicTime}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'评论 ('+playlist.commentCount+')'" name="second">
          <div class="comment">
            <div class="hotComment" v-if="ishotCom && hotTotal">
              <span class="title">
                精彩评论
              </span>
              <div class="hotContent" v-for="item in hotComments" :key="item.commentId">
                <div class="comImg" @click="autorDetail(item.user.userId)">
                  <img :src="item.user.avatarUrl">
                </div>
                <div class="comTxt">
                  <div class="userTxt">
                    <span class="userName" @click="autorDetail(item.user.userId)">{{item.user.nickname}}：</span>
                    <span class="userCom">{{item.content}}</span>
                  </div>
                  <div class="beReplied" v-if="item.beReplied.length">
                    <div v-for="ber in item.beReplied" :key="ber.beRepliedCommentId">
                      <span class="userName" @click="autorDetail(ber.user.userId)">@{{ber.user.nickname}}：</span>
                      <span class="userCom" @click="autorDetail(ber.user.userId)">{{ber.content}}</span>
                    </div>
                  </div>
                  <div class="comTime">
                    <span>{{dateFormat(item.time)}}</span>
                    <span>
                      <span class="jb">举报</span>
                      <span class="icon"><i class="iconfont icon-zan" />({{item.likedCount}})</span>
                      <i class="icon iconfont icon-fenxiang" />
                      <i class="icon iconfont icon-xiaoxi" />
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="hotTotal > 10" class="moreHot">
                <el-button>更多精彩评论
                  <a-icon type="right" />
                </el-button>
              </div>
            </div>
            <div class="newComment">
              <span class="title">
                最新评论({{total}})
              </span>
              <div class="newContent" v-for="item in comments" :key="item.commentId">
                <div class="comImg" @click="autorDetail(item.user.userId)">
                  <img :src="item.user.avatarUrl">
                </div>
                <div class="comTxt">
                  <div class="userTxt">
                    <span class="userName" @click="autorDetail(item.user.userId)">{{item.user.nickname}}：</span>
                    <span class="userCom">{{item.content}}</span>
                  </div>
                  <div class="beReplied" v-if="item.beReplied.length">
                    <div v-for="ber in item.beReplied" :key="ber.beRepliedCommentId">
                      <span class="userName" @click="autorDetail(ber.user.userId)">@{{ber.user.nickname}}：</span>
                      <span class="userCom" @click="autorDetail(ber.user.userId)">{{ber.content}}</span>
                    </div>
                  </div>
                  <div class="comTime">
                    <span>{{dateFormat(item.time)}}</span>
                    <span>
                      <span class="jb">举报</span>
                      <span class="icon">
                        <i class="iconfont icon-zan" />{{item.likedCount?'('+item.likedCount+')':''}}
                      </span>
                      <i class="icon iconfont icon-fenxiang" />
                      <i class="icon iconfont icon-xiaoxi" />
                    </span>
                  </div>
                </div>
              </div>
              <div class="page">
                <el-pagination background layout="prev, pager,next" :page-size="20" :total="total" @current-change="currentChange">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="third">
          <div class="sub">
            <div class="subItem" v-for="item in subs" :key="item.userId">
              <div class="subImg" @click="autorDetail(item.userId)">
                <img :src="item.avatarUrl">
              </div>
              <div class="subTxt">
                <div class="subName">
                  <span class="nameItem" @click="autorDetail(item.userId)">{{item.nickname}}</span>
                  <span v-if="item.gender">
                    <i class="iconfont" :class="item.gender === 1 ? 'icon-sex-nan' : 'icon-sex-nv'" />
                  </span>
                </div>
                <div class="subInfo" v-if="item.signature">{{item.signature}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import musicLibrary from '@/api/musicLibrary'
const api = new musicLibrary()
export default {
  data () {
    return {
      id: this.$route.query.id,
      playlist: {},
      creator: {},
      tags: [],
      playListDetail: [],
      subs: {},
      comments: [],
      total: 0,
      hotComments: [],
      hotTotal: 0,
      page: 1,
      ishotCom: true,
      isZhankai: false,
      isBottom: true,
      playDialog: false,
      activeName: 'first',
      trackIds: []
    }
  },
  mounted () {
    this.init(this.id)
  },
  methods: {
    async init (id) {
      if (id) {
        const res = await api.getListDetail({ id })
        if (res.data.code === 200) {
          this.playlist = res.data.playlist
          this.creator = res.data.playlist.creator
          this.trackIds = res.data.playlist.trackIds
          this.tags = res.data.playlist.tags || []
          this.playListDetail = this.playListData()
          this.$nextTick(() => {
            if (this.$refs?.divDetail?.offsetHeight < this.$refs?.TxtDetail?.offsetHeight) {
              this.isZhankai = true
            }
          })
        }
        const subsRes = await api.getSubscribers({ id })
        if (subsRes.data.code === 200) {
          this.subs = subsRes.data.subscribers
        }
        await this.getComment()
        const hotRes = await api.gethotComment({ id, type: 2, limit: 10 })
        if (hotRes.data.code === 200) {
          this.hotComments = hotRes.data.hotComments
          this.hotTotal = hotRes.data.total
        }
      }
    },
    // 全部播放
    allPlay () {
      if (this.$store.getters.playlist?.length) {
        this.playDialog = true
      } else {
        this.getPlayListDetailData()
      }
    },
    addList () {
      const oldPlaylist = this.$store.getters.playlist
      this.getPlayListDetailData(oldPlaylist)
      this.$message.success('已添加至播放列表')
    },
    // 获取歌单列表
    getPlayListDetailData (oldPlaylist, val) {
      const playlist = this.playListData()
      this.playDialog = false
      if (oldPlaylist?.length) {
        oldPlaylist.forEach(item => {
          const index = playlist.findIndex(it => it.musicId === item.musicId)
          index > -1 ? playlist.splice(index, 1) : ''
        })
        const newPlaylist = [...playlist, ...oldPlaylist]
        if (playlist.length) {
          this.$store.commit('play/SET_PALY_LIST', newPlaylist)
        }
      } else {
        this.$store.commit('play/SET_PALY_LIST', playlist)
        // 默认播放第一首
        if (!val) {
          this.$store.commit('play/SET_MUSIC_INFO', playlist[0])
          this.$store.dispatch('play/play')
          this.$store.dispatch('play/getlyric')
        }
      }
      if (val) {
        this.$store.commit('play/SET_MUSIC_INFO', val)
        this.$store.dispatch('play/play')
        this.$store.dispatch('play/getlyric')
      }
    },
    // 作者详情
    autorDetail (userId) {
      if (userId) {
        this.$router.push({ path: '/musicLibrary/playList', query: { userId } })
      }
    },
    // 获取评论
    async getComment (param) {
      const id = this.id
      if (id) {
        const params = { id, ...param }
        api.getComment(params).then(res => {
          if (res.data.code === 200) {
            this.comments = res.data.comments
            this.total = res.data.total
          }
        })
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    // 播放音乐
    playMusic (val) {
      const oldPlaylist = this.$store.getters.playlist
      this.getPlayListDetailData(oldPlaylist, val)
    },
    // 格式化列表
    playListData () {
      const [tracks, playlist] = [this.playlist.tracks, []]
      tracks.forEach(item => {
        playlist.push({
          musicId: item.id,
          musicName: item.name,
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: '',
          alia: item.alia.length !== 0 ? item.alia[0] : '',
          alName: item.al.name
        })
      })
      return playlist
    },
    // 跳转至歌单页
    tagPlayList (type) {
      this.$router.push({ path: '/musicLibrary/playList', query: { type } })
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    currentChange (evt) {
      // const before = this.page*20>=this.total ? '' : this.comments.length ? this.comments[this.comments.length-1].time : ''
      this.page = evt
      this.ishotCom = evt === 1 ? true : false
      const params = {
        offset: (evt - 1) * 20
      }
      this.getComment(params)
    },
    // 格式化日期
    dateFormat (date, format = 'yyyy年MM月dd日 hh:mm') {
      // 获取时间
      if (!date) {
        return ''
      }
      const value = new Date(date)
      const yearD = value.getFullYear()
      const monthD = (value.getMonth() + 1) < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1
      const dayD = (value.getDate() < 10) ? '0' + value.getDate() : value.getDate()
      const hourD = (value.getHours() < 10) ? '0' + value.getHours() : value.getHours()
      const minuteD = (value.getMinutes() < 10) ? '0' + value.getMinutes() : value.getMinutes()
      const secondD = (value.getSeconds() < 10) ? '0' + value.getSeconds() : value.getSeconds()

      // 替换格式
      if (format.indexOf('yyyy') !== -1) format = format.replace('yyyy', yearD)
      if (format.indexOf('MM') !== -1) format = format.replace('MM', monthD)
      if (format.indexOf('dd') !== -1) format = format.replace('dd', dayD)
      if (format.indexOf('hh') !== -1) format = format.replace('hh', hourD)
      if (format.indexOf('mm') !== -1) format = format.replace('mm', minuteD)
      if (format.indexOf('ss') !== -1) format = format.replace('ss', secondD)
      return format
    }
  }
}
</script>

<style lang="less" scoped>
.listHeader {
  min-height: 200px;
  display: flex;
  .Cover {
    height: 200px;
    border-radius: 5px;
    overflow: hidden;
    margin: 0 20px;
    img {
      height: 100%;
    }
  }
  .info {
    width: calc(100% - 240px);
    .listName {
      display: flex;
      justify-content: space-between;
      .listTxt {
        font-size: 22px;
        font-weight: bold;
        color: #2a2727;
      }
      div {
        display: flex;
        align-items: center;
        .back-span {
          padding: 0 7px;
          border: solid 1px #585858;
          border-radius: 14px;
        }
        .back-span:focus,
        .back-span:hover {
          background-color: #cfcbcc;
          cursor: pointer;
        }
        .Name-span {
          border: solid 1px #f92626;
          border-radius: 3px;
          overflow: hidden;
          padding: 0 7px;
          color: #f92626;
          margin-right: 10px;
        }
      }
    }
    .infoCount {
      margin-top: 10px;
      .autor {
        display: flex;
        align-items: center;
        font-size: 14px;
        .autorDetail {
          display: flex;
          align-items: center;
          color: #5870a7;
          cursor: pointer;
          .Avatar {
            height: 35px;
            border-radius: 50%;
            overflow: hidden;
            img {
              height: 100%;
            }
          }
          span:focus,
          span:hover {
            color: #3e5485;
          }
        }
        span {
          margin: 0 5px;
        }
        .infoTag {
          border-radius: 15px;
          margin: 15px 0 0 -10px;
          img {
            height: 20px;
          }
          span {
            font-size: 13px;
            margin: 0 8px 0 3px;
            color: #f92626;
          }
        }
      }
      .operate {
        display: flex;
        margin-top: 10px;
        button {
          padding: 6px 15px;
          border-radius: 50px;
          background: rgba(0, 0, 0, 0);
          color: #3c3939;
          border: 1px solid #80889d;
          font-size: 15px;
          .iconfont {
            font-size: 18px;
            margin-right: 5px;
            vertical-align: middle;
          }
        }
        button:focus,
        button:hover {
          background-color: #cfcbcc;
          cursor: pointer;
        }
        .op-dian {
          display: flex;
          padding: 0;
          line-height: 18px;
          margin-right: 10px;
          color: #fff;
          border: none;
          font-size: 15px;
          .iconfont {
            font-size: 18px;
            margin-right: 5px;
          }
          .op-add {
            display: inline-block;
            border-left: solid 1px #f35b5b;
            padding: 6px 10px 6px 5px;
            border-radius: 0 50px 50px 0;
            overflow: hidden;
            background-color: #e72d2d;
            .iconfont {
              margin: 0 0 0 5px;
            }
          }
          .op-play {
            display: inline-block;
            padding: 6px 5px 6px 15px;
            border-radius: 50px 0 0 50px;
            overflow: hidden;
            background-color: #e72d2d;
          }
          .op-add:focus,
          .op-add:hover,
          .op-play:focus,
          .op-play:hover {
            background-color: #c73c27;
            cursor: pointer;
          }
        }
      }
    }
    .infoContent {
      padding-top: 15px;
      .infoTxt {
        .divTxt,
        .divContent {
          margin-top: 10px;
          color: #2e2b2b;
          .Txt {
            color: #6e6767;
            margin-right: 10px;
          }
          .Txt.tagTxt {
            color: #5870a7;
            margin-right: 0;
            cursor: pointer;
          }
          .TxtDetail {
            color: #6e6767;
            white-space: pre;
            line-height: 25px;
          }
        }
        .divContent {
          display: flex;
          justify-content: space-between;
          .divDetail {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .divBtn {
            color: #5a5353;
            cursor: pointer;
          }
        }
      }
    }
  }
}
/deep/.el-dialog__wrapper .el-dialog--center {
  .el-dialog__body {
    text-align: center;
    padding: 25px 25px 30px;
    font-size: 15px;
  }
  .el-button--primary {
    color: #fff;
    background-color: #fb3e3e;
    border-color: #fb3e3e;
  }
  .el-button:focus,
  .el-button:hover {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #f3f3f5;
  }
  .el-button--primary:focus,
  .el-button--primary:hover {
    color: #fff;
    background: #e51818;
    border-color: #e51818;
  }
  .el-button {
    padding: 8px 20px;
    border-radius: 22px;
  }
}
.list {
  margin-top: 20px;
  /deep/.el-tabs {
    .el-tabs__item.is-active {
      color: #121112;
      font-size: 18px;
      font-weight: bold;
    }
    .el-tabs__item:hover {
      color: #121112;
      cursor: pointer;
    }
    .el-tabs__active-bar {
      background-color: #f7324e;
    }
  }
  /deep/.el-table {
    background: transparent;
    .el-table__expanded-cell {
      background: transparent;
    }
    tr,
    th {
      background: transparent;
    }
    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &::before {
      height: 0;
    }
    .m-musicName {
      color: #333;
      &:hover {
        cursor: pointer;
      }
    }
    .m-alia {
      color: #aaa;
      &:hover {
        cursor: pointer;
      }
    }
    .el-table__row {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        .el-table__cell:nth-child(1) {
          color: #3bba7d;
        }
      }
    }
  }
  .sub {
    display: flex;
    flex-wrap: wrap;
    .subItem {
      width: 50%;
      display: flex;
      margin-top: 20px;
      align-items: center;
      .subImg {
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 100%;
        }
      }
      .subImg:focus,
      .subImg:hover {
        cursor: pointer;
      }
      .subTxt {
        margin-left: 10px;
        .subName {
          font-size: 18px;
          .nameItem:focus,
          .nameItem:hover {
            cursor: pointer;
            color: #0e0e0e;
          }
          .icon-sex-nan,
          .icon-sex-nv {
            color: #80c7fb;
            vertical-align: middle;
            font-size: 18px;
            margin-left: 5px;
          }
          .icon-sex-nv {
            color: #fac;
          }
        }
        .subInfo {
          margin-top: 10px;
        }
      }
    }
  }
  .comment {
    .moreHot {
      text-align: center;
      button {
        padding: 6px 12px;
        border-radius: 50px;
        background: rgba(0, 0, 0, 0);
        color: #3c3939;
        border: 1px solid #80889d;
        .anticon {
          color: #3c3939;
          font-size: 14px;
        }
      }
    }
    .newComment,
    .hotComment {
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .hotContent:nth-child(2),
      .newContent:nth-child(2) {
        border: none;
      }
      .hotContent,
      .newContent {
        padding: 15px 0;
        border-top: solid 1px #c5c8d1;
        .comImg {
          width: 80px;
          border-radius: 50%;
          overflow: hidden;
          float: left;
          img {
            width: 100%;
          }
        }
        .comImg:focus,
        .comImg:hover {
          cursor: pointer;
        }
        .comTxt {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 95px;
          min-height: 80px;
          font-size: 15px;
          .userName {
            color: #5199d7;
          }
          .userName:focus,
          .userName:hover {
            cursor: pointer;
            color: #0a5b8b;
          }
          .beReplied {
            margin: 5px 0;
            padding: 5px 10px;
            border-radius: 5px;
            background-color: #e5e0e0;
          }
          .comTime {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            color: #6a5d5d;
            font-size: 14px;
            .jb,
            .icon {
              padding: 0 10px;
              border-right: solid 1px #9b9da5;
            }
            .jb {
              display: none;
            }
            .icon:nth-last-child(1) {
              padding-right: 0;
              border-right: none;
            }
            .jb:focus,
            .jb:hover,
            .icon:focus,
            .icon:hover {
              cursor: pointer;
              color: #1a1818;
            }
          }
        }
      }
      .hotContent:focus,
      .hotContent:hover,
      .newContent:focus,
      .newContent:hover {
        .jb {
          display: inline !important;
        }
      }
      .page {
        text-align: center;
        .el-pager li {
          font-weight: normal;
        }
        /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #ef5858;
          color: #fff;
        }
      }
    }
  }
}
</style>
