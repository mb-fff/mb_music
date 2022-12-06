<template>
  <div>
    <div v-show="!isShowSingerDetail" @click="isOpul = false; isOpmenu = false">
      <div class="autorHeader">
        <div class="Avatar">
          <img :src="profile.avatarUrl">
        </div>
        <div class="info">
          <div class="autorName">
            <span class="autorTxt">{{profile.nickname}}</span>
            <div @click="goBack"><span class="back">返回</span></div>
          </div>
          <div class="infoCount">
            <div class="icon">
              <div class="infoTag" v-if="identify">
                <img :src="identify.imageUrl">
                <span>{{identify.imageDesc}}</span>
              </div>
              <div class="infoVip">
                <span v-for="item in allAuthTypes" :key="item.desc">
                  {{item.desc}}
                </span>
                <span v-if="info.level" style="color: #000; background-color: #b6babf">{{'Lv'+info.level}}</span>
                <i v-if="profile.gender" class="iconfont" :class="profile.gender === 1 ? 'icon-sex-nan' : 'icon-sex-nv'" />
              </div>
            </div>
            <div class="operate">
              <el-button v-if="isSinger" @click="querySingerInfo"><i class="iconfont icon-huatong" /><span>歌手页</span></el-button>
              <el-button><i class="iconfont icon-email" /><span>发私信</span></el-button>
              <el-button><i class="iconfont icon-jiahao" style="color: #e91019;" /><span>关注</span></el-button>
              <div class="op-dian" @click.stop="isOpmenu = true">...</div>
              <div class="op-menu" v-show="isOpmenu">
                <div class="op-item" @mouseenter="onLeaveTd">
                  <span>
                    <i class="iconfont icon-jinzhi" />加黑名单
                  </span>
                </div>
                <div class="op-item" @mouseenter="onEnterTd">
                  <span><i class="iconfont icon-weixian" />举报</span>
                  <i class="el-icon-caret-right"></i>
                </div>
              </div>
              <ul v-show="isOpul">
                <li>广告或营销信息</li>
                <li>恶意人身攻击</li>
                <li>涩情、低俗或有害内容</li>
                <li>政治敏感言论</li>
                <li style="border-top: 1px solid #c3c1c1;">其他原因 ></li>
              </ul>
            </div>
          </div>
          <div class="infoContent">
            <div class="infoNumber">
              <div><span class="nub">{{profile.eventCount}}</span>动态</div>
              <div class="nubBorder"><span class="nub">{{profile.follows}}</span>关注</div>
              <div><span class="nub">{{profile.followeds}}</span>粉丝</div>
            </div>
            <div class="infoTxt">
              <div v-if="profile.province">所在地区：<span class="Txt">{{profile.province}} {{profile.city?profile.city:''}}</span></div>
              <div>社交网络：<span class="Txt">暂无介绍（找不到接口）</span></div>
              <div>个人介绍：<span class="Txt">{{profile.signature}}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="创建的歌单" name="first">暂无接口</el-tab-pane>
          <el-tab-pane label="收藏的歌单" name="second">暂无接口</el-tab-pane>
          <el-tab-pane label="创建的音乐专栏" name="third">暂无接口</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 歌手页 -->
    <SingerDetail v-show="isShowSingerDetail" @goBackSinger="handleGoBack" :singerInfo="singerInfo"></SingerDetail>
  </div>
</template>

<script>
import SingerDetail from '../singer/singerDetail'
import musicLibrary from '@/api/musicLibrary'
const api = new musicLibrary()
export default {
  components: {
    SingerDetail
  },
  props: {
    autorId: {
      tyep: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      userId: this.$route.query.userId || '',
      info: {},
      identify: {},
      profile: {},
      isOpul: false, // 控制二级菜单
      isOpmenu: false,
      singerInfo: {},
      isShowSingerDetail: false,
      activeName: 'first',
      isSinger: false
    }
  },
  computed: {
    allAuthTypes () {
      const arr = this.profile?.allAuthTypes?.slice(1) || []
      return arr.length > 0 ? arr : []
    }
  },
  watch: {
    autorId (val) {
      if (val) {
        this.init(val)
      }
    }
  },
  mounted () {
    // 其他路由页跳转过来
    if (this.userId) {
      this.init(this.userId)
    }
  },

  activated () {
    this.isOpul = false
    this.isOpmenu = false
  },
  methods: {
    init (id) {
      if (id) {
        api.getUser(id).then(res => {
          this.info = res.data
          this.identify = res.data.identify
          this.profile = res.data.profile
          this.isSinger = res.data.profile?.mainAuthType?.desc === '网易音乐人' ? true : false
        })
      }
    },
    onEnterTd () {
      this.isOpul = true
    },
    onLeaveTd () {
      this.isOpul = false
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    // 查看歌手详情
    querySingerInfo () {
      this.isShowSingerDetail = true
      const { avatarUrl, artistId, nickname, followeds } = this.profile
      this.singerInfo = {
        picUrl: avatarUrl,
        name: nickname,
        id: artistId,
        fansCount: followeds
      }
    },
    handleGoBack () {
      this.isShowSingerDetail = false
    },
    goBack () {
      if (!this.userId) {
        this.$emit('goBackAutor')
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.autorHeader {
  min-height: 200px;
  display: flex;
  .Avatar {
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 20px;
    img {
      height: 100%;
    }
  }
  .info {
    width: calc(100% - 240px);
    .autorName {
      display: flex;
      justify-content: space-between;
      .autorTxt {
        font-size: 22px;
        font-weight: bold;
        color: #2a2727;
      }
      div {
        display: flex;
        align-items: center;
        .back {
          padding: 0 7px;
          border: solid 1px #585858;
          border-radius: 14px;
        }
      }
      div:focus,
      div:hover {
        .back {
          background-color: #cfcbcc;
        }
        cursor: pointer;
      }
    }
    .infoCount {
      display: flex;
      justify-content: space-between;
      margin: 5px 0 10px;
      .icon {
        font-size: 13px;
        line-height: 20px;
        .infoTag {
          background-color: #f9c9c9;
          border-radius: 15px;
          width: max-content;
          img {
            height: 20px;
          }
          span {
            font-size: 13px;
            margin: 0 8px 0 3px;
            color: #f92626;
          }
        }
        .infoVip {
          line-height: 15px;
          font-size: 13px;
          margin-top: 5px;
          span {
            background-color: #efe5a1;
            border-radius: 16px;
            padding: 2px 8px;
            color: #fda230;
            margin-right: 5px;
          }
          .icon-sex-nan,
          .icon-sex-nv {
            color: #80c7fb;
            vertical-align: middle;
            font-size: 18px;
          }
          .icon-sex-nv {
            color: #fac;
          }
        }
      }
      .operate {
        margin-left: 20px;
        position: relative;
        button {
          padding: 6px 12px;
          border-radius: 50px;
          background: rgba(0, 0, 0, 0);
          color: #3c3939;
          border: 1px solid #80889d;
          font-size: 15px;
          .iconfont {
            font-size: 18px;
            margin-right: 5px;
          }
        }
        button:focus,
        button:hover,
        .op-dian:focus,
        .op-dian:hover {
          background-color: #cfcbcc;
          cursor: pointer;
        }
        .op-dian {
          display: inline-block;
          border: 1px solid #80889d;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          text-align: center;
          vertical-align: top;
          font-weight: bold;
          margin-left: 10px;
        }
        ul,
        .op-menu {
          position: absolute;
          right: 12px;
          top: 90%;
          padding: 10px 0;
          width: 160px;
          border-radius: 5px;
          box-shadow: 0 1px 3px #9b959f;
          background-color: #d0d0d5;
          li,
          .op-item {
            padding: 0 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .iconfont {
              margin-right: 5px;
            }
          }
          .op-item:focus,
          .op-item:hover,
          li:focus,
          li:hover {
            background-color: #e7e2e2;
            cursor: pointer;
          }
          li {
            line-height: 24px;
            padding: 3px 10px;
          }
        }
        ul {
          right: 180px;
          top: 180%;
          background-color: #d8d8dc;
          z-index: 2;
        }
      }
    }
    .infoContent {
      padding-top: 15px;
      border-top: solid 1px #c1baba;
      .infoNumber {
        display: flex;
        div {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          align-items: center;
          font-size: 14px;
          color: #5c5858;
          .nub {
            font-size: 18px;
            color: #1e1d1d;
          }
        }
        .nubBorder {
          border-left: solid 1px #c1baba;
          border-right: solid 1px #c1baba;
        }
      }
      .infoTxt {
        div {
          margin-top: 10px;
          color: #2e2b2b;
          .Txt {
            color: #6e6767;
          }
        }
      }
    }
  }
}
.list {
  margin-top: 20px;
  /deep/.el-tabs {
    .el-tabs__item.is-active {
      color: #121112;
      font-size: 18px;
    }
    .el-tabs__item:hover {
      color: #121112;
      cursor: pointer;
    }
    .el-tabs__active-bar {
      background-color: #f7324e;
    }
  }
}
</style>
