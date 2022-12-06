<template>
  <div>
    <header :style="`background:${color}`">
      <!-- logo区域 -->
      <div class="m-logo-wrap">
        <span></span>
      </div>
      <!-- 搜索区域 -->
      <div class="m-search-wrap">
        <span class="m-arrow">
          <a-icon type="left" />
        </span>
        <span class="m-arrow">
          <a-icon type="right" />
        </span>
        <div class="m-search">
          <a-input placeholder="请输入关键词" v-model="searchKey" @change="searchMusic" @focus="isShowSearched=true">
            <a-icon slot="prefix" type="search" style="margin-right:4px" />
          </a-input>
          <!-- 搜索到的内容 -->
          <div class="m-searched-box" v-show="isShowSearched">
            <div class="m-keyword-isEmpty" v-show="isShowEmpty">
              <h2 class="m-hot-title">热搜榜</h2>
              <ul class="m-hot-list">
                <li class="m-hot-item" v-for="(item,index) in hotlist" :key="index">
                  <div class="m-item-left">{{index+1}}</div>
                  <div class="m-item-right">
                    <div class="m-item-top">
                      <span class="m-name" @click="chooseHotMusic(item.searchWord)" style="color:#000">{{item.searchWord}}</span>
                      <span style="color:rgba(0, 0, 0, 0.3)">{{item.score}}</span>
                    </div>
                    <div class="m-item-bottom">{{item.content}}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="m-keyword-isNotEmpty" v-show="!isShowEmpty">
              <p class="m-top-desc">搜"<span style="color:#6a90ba">{{searchKey}}</span>"相关的结果
                <a-icon style="font-size:10px" type="right" />
              </p>
              <div class="m-searched-list">
                <h2 class="m-list-title">
                  <img src="../../assets/img/单曲.svg" alt="">单曲
                </h2>
                <ul class="m-list">
                  <li @click="playMusic(item)" v-for="item in musiclist" :key="item.musicId" class="m-item">
                    <span style="color:#6a90ba">{{item.musicName}}</span> - <span>{{item.singer}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <span class="music-logo">
          <a-icon type="audio" />
        </span>
      </div>
      <!-- 登陆区域 -->
      <div class="m-login-wrap">
        <!-- 头像 -->
        <a-avatar icon="user" :src="userinfo.avatarUrl" />
        <!-- 登陆人信息 -->
        <div class="m-userInfo">
          <!-- 未登录 -->
          <span v-show="!isLogin" style="font-size:12px" @click="login()">未登录</span>
          <!-- 已登录 -->
          <span class="m-self-wrap" @click="isShowSelf=!isShowSelf" v-show="isLogin">
            {{userinfo.userName}}
            <div v-show="isShowSelf" class="m-self">
              <p @click="logout()" class="m-logout">
                <a-icon type="logout" />退出登陆
              </p>
            </div>
          </span>
          <a-icon @click="isShowSelf=!isShowSelf" class="m-caret-down" type="caret-down" />
        </div>
        <!-- 换肤 -->
        <el-color-picker v-model="color" show-alpha :predefine="predefineColors">
        </el-color-picker>
        <!-- 登陆弹出框 -->
        <a-modal v-model="isShowLogin" footer='' @cancel="handleCancel">
          <div v-show="isShowLoad" class="m-loading">
            <a-spin tip="Loading..."></a-spin>
          </div>
          <!-- 二维码登陆 -->
          <div v-show="isShowLoginByQr" class="m-qr-login">
            <h1 class="m-qr-title">扫码登陆</h1>
            <div class="m-qr-wrap">
              <div class="m-left-wrap" ref="leftRef">
                <img src="../../assets/img/m-qr.png" alt="">
              </div>
              <div class="m-right-wrap" ref="rightRef">
                <img ref="qrimgRef" :src="qrimg" alt="">
                <!-- 二维码失效 -->
                <div class="m-status-800" v-show="isShowQrStatus">
                  <h2 class="m-title">二维码已失效</h2>
                  <a-button @click="refreshQr()" type="primary" size="small">
                    点击刷新
                  </a-button>
                </div>
                <h2 class="m-desc">使用<span style="color:#0c73c2">网易云音乐APP</span>扫码登陆</h2>
              </div>
            </div>
            <p @click="changeLoginWay('toOther')" class="m-other-mode">选择其他登陆模式
              <a-icon type="right" />
            </p>
          </div>
          <!-- 其他方式登陆 -->
          <div v-show="isShowLoginByOther" class="m-other-login">
            <a-tooltip placement="right">
              <template slot="title">
                <span>扫码登陆更安全</span>
              </template>
              <div class="m-toqr" @click="changeLoginWay('toqr')">
                <a-icon type="qrcode" />
              </div>
            </a-tooltip>
            <div class="m-other-top">
              <img src="../../assets/img/m-login1.png" alt="">
            </div>
            <div class="m-login-form">
              <a-form :form="form" :wrapper-col="{ span: 24 }" @submit.prevent="handleSubmit">
                <a-form-item>
                  <a-input ref="userNameInput" v-model="form.cellphone" placeholder="请输入手机号">
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input ref="passwordInput" type="password" v-model="form.password" placeholder="请输入密码">
                    <a-icon slot="prefix" type="lock" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-checkbox :checked="form.isRemember" @change="onChange">
                    Remember me
                  </a-checkbox>
                </a-form-item>
                <a-form-item>
                  <a-button style="width:100%" type="danger" html-type="submit">
                    登陆
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </a-modal>
      </div>
    </header>
  </div>
</template>

<script>
import httpBaseAPI from '@/api/httpBaseAPI.js'
import loginAPI from '@/api/loginAPI.js'
const [api, loginApi] = [new httpBaseAPI(), new loginAPI()]
import { encryp, decrypt, randomString } from '@/utils/crypto.js'
export default {
  data () {
    return {
      // 搜索关键词
      searchKey: '',
      // 用户名
      userName: '',
      // 搜索内容盒子
      isShowSearched: false,
      // 搜索到的单曲
      musiclist: [],
      // 搜索内容是否为空
      isShowEmpty: true,
      // 热榜列表
      hotlist: [],
      // 二维码
      qrimg: '',
      // 二维码登陆模块是否显示
      isShowLoginByQr: false,
      // loading是否显示
      isShowLoad: true,
      // 轮询检查二维码扫码状态
      timer: null,
      // 二维码状态
      isShowQrStatus: false,
      // 用户信息
      userinfo: {
        userId: '',
        userName: '',
        avatarUrl: ''
      },
      // 其他方式登陆
      isShowLoginByOther: false,
      formLayout: 'horizontal',
      form: {
        cellphone: '',
        password: '',
        isRemember: false
      },
      isLogin: false,
      // 当前皮肤颜色
      color: 'rgba(74, 188, 118, 0.5)',
      // 预设值
      predefineColors: [
        'rgba(74, 188, 118, 0.5)',
        'rgba(255, 92, 138, 0.8)',
        'rgba(255, 122, 158,1)',
        'rgba(113, 127, 249, 0.8)',
        'rgba(71, 145, 235, 0.8)',
        'rgba(57, 175, 234, 0.8)',
        'rgba(106, 204, 25, 0.8)',
        'rgba(226, 171, 18, 0.8)',
        'rgba(255, 143, 87, 0.8)',
        'rgba(253, 114, 109, 0.8)',
        'rgba(253, 84, 78, 0.8)',
        'rgba(236, 65, 65,1)'
      ],
      isShowSelf: false,
      key: randomString(),
      iv: 'mb_fff'
    }
  },
  watch: {
    searchKey (newV) {
      this.isShowEmpty = newV === '' ? true : false
    },
    isShowLogin (newV) {
      if (newV) this.loginByQrKey()
    }
  },
  computed: {
    isShowLogin: {
      get () {
        return this.$store.getters.isShowLogin
      },
      set () { }
    }
  },
  created () {
    const [isLogin, userinfo] = [localStorage.getItem('isLogin'), JSON.parse(localStorage.getItem('userinfo'))]
    if (isLogin) {
      this.isLogin = true
      this.userinfo = userinfo
    }
    this.searchHotMusic()
    // 获取缓存中登录信息
    const encrypStr = localStorage.getItem('loginInfo')
    if (encrypStr) {
      const decryptInfo = decrypt(this.key, this.iv, encrypStr)
      this.form = decryptInfo
    }
  },
  mounted () {
    // 点击搜索区外，隐藏搜索区
    document.addEventListener('click', e => {
      const classNames = []
      e.path.forEach(el => {
        el.className ? classNames.push(el.className) : classNames.push(false)
      })
      if (classNames.indexOf('m-search') !== -1) return
      this.isShowSearched = false
    }, false)
  },
  methods: {
    //  搜索音乐
    async searchMusic () {
      const param = {
        keywords: this.searchKey,
        type: 1
      }
      const res = await api.searchMusic(param)
      if (res.data.code === 400 || !res.data.result.songs) return
      const [songs, musiclist] = [res.data.result.songs, []]
      songs.forEach(item => {
        musiclist.push({
          musicId: item.id,
          musicName: item.name,
          singer: item.ar[0].name,
          musicIcon: item.al.picUrl,
          musicSong: '',
          musicDuration: Math.floor(item.dt / 1000),
          musicURL: ''
        })
      })
      this.musiclist = musiclist
    },
    // 播放音乐
    playMusic (val) {
      // 将搜索到的数据插入到播放列表
      this.$store.commit('play/SET_PALY_LIST', this.musiclist)
      // 播放当前音乐
      this.$store.commit('play/SET_MUSIC_INFO', val)
      this.$store.dispatch('play/play')
      this.$store.dispatch('play/getlyric')
      this.isShowSearched = false
    },
    // 搜索热搜榜音乐
    async searchHotMusic () {
      const param = {}
      const res = await api.searchHotMusic(param)
      this.hotlist = res.data.data
    },
    // 选择热搜榜音乐
    chooseHotMusic (name) {
      this.searchKey = name
      this.searchMusic()
    },
    // 登陆
    login () {
      this.$store.commit('play/SET_ISSHOW_LOGIN', true)
    },
    // 二维码key生成
    async loginByQrKey () {
      const param = {}
      const res = await loginApi.loginByQrKey(param)
      const unikey = res.data.data.unikey
      this.loginByQrCreate(unikey)
    },
    // 二维码生成
    async loginByQrCreate (unikey) {
      const param = {
        key: unikey,
        qrimg: 'qrimg'
      }
      const res = await loginApi.loginByQrCreate(param)
      this.qrimg = res.data.data.qrimg
      this.isShowLoad = false
      this.isShowLoginByQr = true
      // 轮询检查二维码扫码状态
      this.timer = setInterval(() => {
        this.loginByQrCheck(unikey)
      }, 3000)
    },
    // 二维码检测扫码状态
    async loginByQrCheck (unikey) {
      const param = {
        key: unikey
      }
      const res = await loginApi.loginByQrCheck(param)
      const data = res.data
      switch (data.code) {
        case 800:
          // 二维码失效
          clearInterval(this.timer)
          this.isShowQrStatus = true
          this.$refs.leftRef.style.display = 'none'
          this.$refs.rightRef.style.width = '100%'
          this.$refs.qrimgRef.style.width = '180px'
          this.$refs.qrimgRef.style.height = '180px'
          break;
        case 803:
          clearInterval(this.timer)
          this.getLoginStatus()
          break;
        default:
          break;
      }
    },
    // 刷新二维码
    refreshQr () {
      this.loginByQrKey()
      this.isShowLoad = true
      this.isShowLoginByQr = false
      this.isShowQrStatus = false
      this.$refs.leftRef.style.display = ''
      this.$refs.rightRef.style.width = ''
      this.$refs.qrimgRef.style.width = ''
      this.$refs.qrimgRef.style.height = ''
    },
    // 改变登陆方式
    changeLoginWay (type) {
      switch (type) {
        case 'toOther':
          this.isShowLoginByQr = false
          this.isShowLoginByOther = true
          clearInterval(this.timer)
          break;
        case 'toqr':
          this.isShowLoginByQr = true
          this.isShowLoginByOther = false
          this.loginByQrKey()
          break;
        default:
          break;
      }

    },
    // 手机号登陆
    async handleSubmit () {
      const param = {
        phone: this.form.cellphone,
        password: this.form.password
      }
      const res = await loginApi.loginByCellphone(param)
      const data = res.data
      // 是否记录登录信息
      if (this.form.isRemember) {
        const encrypStr = encryp(this.key, this.iv, this.form)
        localStorage.setItem('loginInfo', encrypStr)
      } else {
        const encrypStr = localStorage.getItem('loginInfo')
        if (encrypStr) localStorage.removeItem('loginInfo')
      }
      this.isLogin = true
      this.$store.commit('play/SET_ISSHOW_LOGIN', false)
      this.userinfo.userId = data.profile.userId
      this.userinfo.userName = data.profile.nickname
      this.userinfo.avatarUrl = data.profile.avatarUrl
      localStorage.setItem('token', data.token)
      localStorage.setItem('isLogin', true)
      localStorage.setItem('userinfo', JSON.stringify(this.userinfo))
      this.$router.go(0)
    },
    // 记录登录信息
    onChange (e) {
      this.form.isRemember = e.target.checked
    },
    // 获取登陆状态
    async getLoginStatus () {
      const param = {}
      const res = await loginApi.loginStatus(param)
      const data = res.data.data
      this.userinfo.userId = data.profile.userId
      this.userinfo.userName = data.profile.nickname
      this.userinfo.avatarUrl = data.profile.avatarUrl
      localStorage.setItem('isLogin', true)
      localStorage.setItem('userinfo', JSON.stringify(this.userinfo))
      this.$store.commit('play/SET_ISSHOW_LOGIN', false)
      this.isLogin = true
      this.$router.go(0)
    },
    // 退出登录
    async logout () {
      const param = {}
      await loginApi.logout(param)
      this.removeStorage()
      this.isLogin = false
      this.userinfo = {
        userId: '',
        userName: '',
        avatarUrl: ''
      }
      this.$router.go(0)
    },
    handleCancel () {
      this.$store.commit('play/SET_ISSHOW_LOGIN', false)
    },
    // 清除缓存信息
    removeStorage () {
      localStorage.removeItem('userinfo')
      localStorage.removeItem('isLogin')
      localStorage.removeItem('token')
    }
  }
}
</script>

<style scoped lang='less'>
header {
  width: 100%;
  height: 70px;
  padding: 10px;
  background: rgba(74, 188, 118, 0.5);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  // logo区域
  .m-logo-wrap {
    width: 190px;
    height: 100%;
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
    span {
      display: inline-block;
      height: 100%;
      width: 120px;
      background: url('../../assets/img/logo.png') no-repeat center center;
      background-size: cover;
    }
  }
  // 搜索区域
  .m-search-wrap {
    width: 350px;
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 10px;
    .m-arrow {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 2px;
      &:hover {
        cursor: pointer;
      }
    }
    .m-search {
      margin: 0 5px;
      position: relative;
      .ant-input-affix-wrapper {
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.1);
        border: none;
        .ant-input {
          background: rgba(0, 0, 0, 0.1);
        }
      }
      .m-searched-box {
        width: 350px;
        height: 420px;
        background: #eee;
        position: absolute;
        z-index: 999;
        left: -30px;
        border-radius: 6px;
        padding-top: 10px;
        font-size: 12px;
        .m-keyword-isEmpty {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
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
          padding: 0 10px;
          .m-hot-title {
            font-size: 14px;
          }
          .m-hot-list {
            width: 100%;
            .m-hot-item {
              width: 100%;
              height: 50px;
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              &:nth-child(1),
              &:nth-child(2),
              &:nth-child(3) {
                .m-item-left {
                  color: red;
                }
              }
              .m-item-left {
                width: 40px;
                font-size: 16px;
                padding-left: 6px;
                color: rgba(0, 0, 0, 0.3);
              }
              .m-item-right {
                width: calc(~'100% - 40px');
                display: flex;
                flex-direction: column;
                .m-item-top {
                  width: 100%;
                  margin-bottom: 5px;
                  height: 50%;
                  display: flex;
                  align-items: center;
                  .m-name {
                    &:hover {
                      cursor: pointer;
                    }
                  }
                  span {
                    margin-right: 10px;
                  }
                }
                .m-item-bottom {
                  height: 50%;
                  width: 100%;
                  color: rgba(0, 0, 0, 0.3);
                }
              }
            }
          }
        }
        .m-keyword-isNotEmpty {
          height: 100%;
          .m-top-desc {
            height: 20px;
            line-height: 20px;
            padding: 0 10px;
            margin-bottom: 10px;
          }
          .m-searched-list {
            height: calc(~'100% - 20px');
            .m-list-title {
              height: 30px;
              line-height: 30px;
              background: #ddd;
              margin: 0;
              padding: 0 10px;
              img {
                width: 14px;
                height: 14px;
                margin: 0 5px;
              }
            }
            .m-list {
              width: 100%;
              height: calc(~'100% - 40px');
              overflow-x: hidden;
              overflow-y: auto;
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
              .m-item {
                width: 100%;
                padding: 5px 35px;
                &:hover {
                  cursor: pointer;
                  background: #ddd;
                }
              }
            }
          }
        }
      }
    }
    .music-logo {
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  // 登陆区域
  .m-login-wrap {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: calc(~'100% - 770px');
    .m-userInfo {
      color: #aaa;
      font-size: 14px;
      margin-right: 10px;
      &:hover {
        cursor: pointer;
      }
      .m-self-wrap {
        font-size: 12px;
        position: relative;
        .m-self {
          width: 120px;
          height: 40px;
          position: absolute;
          background-color: rgba(255, 255, 255, 0.5);
          right: -46px;
          top: 42px;
          z-index: 999;
          padding: 5px 10px;
          border-radius: 0 0 3px 3px;
          .m-logout {
            color: #2f3030;
            height: 30px;
            display: flex;
            align-items: center;
            font-size: 13px;
            .anticon {
              color: #2f3030;
              font-size: 14px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.anticon {
  color: #aaa;
  font-size: 16px;
  &:hover {
    cursor: pointer;
  }
}
.m-search-wrap {
  .ant-input {
    background: none;
    color: #aaa;
    border: none;
    height: 30px;
  }
}
.m-login-wrap {
  .ant-avatar {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .el-color-picker {
    width: 16px !important;
    height: 16px !important;
    .el-color-picker__trigger {
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;
      .el-color-picker__color {
        border: none;
      }
    }
  }
}
.ant-modal {
  width: 350px !important;
  .ant-modal-content {
    height: 500px;
    position: relative;
    .m-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .m-qr-login {
      width: 100%;
      height: 100%;
      padding: 60px 0;
      .m-qr-title {
        width: 100%;
        font-size: 28px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .m-qr-wrap {
        display: flex;
        height: 248px;
        .m-left-wrap {
          display: none;
          width: 50%;
          img {
            width: 145px;
            height: 245px;
          }
        }
        .m-right-wrap {
          width: 100%;
          text-align: center;
          position: relative;
          img {
            width: 180px;
            height: 180px;
          }
          .m-status-800 {
            width: 150px;
            height: 150px;
            position: absolute;
            top: 15px;
            left: 76px;
            background: rgba(0, 0, 0, 0.7);
            .m-title {
              font-size: 16px;
              color: #fff;
              height: 30px;
              line-height: 30px;
              margin-top: 50px;
            }
          }
          .m-desc {
            text-align: center;
          }
        }
        &:hover {
          .m-left-wrap {
            display: block;
          }
          .m-right-wrap {
            width: 50%;
            img {
              width: 145px;
              height: 145px;
            }
          }
        }
      }
      .m-other-mode {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #333;
        text-align: center;
        margin-top: 50px;
        .anticon {
          font-size: 10px;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
    .m-other-login {
      padding: 30px;
      position: relative;
      .m-toqr {
        position: absolute;
        left: -20px;
        top: -20px;
        &:hover {
          cursor: pointer;
        }
        .anticon {
          color: #333;
          font-size: 50px;
        }
        &::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border: 25px solid #fff;
          border-left-color: transparent;
          border-top-color: transparent;
          left: 0;
          top: 0;
        }
      }
      .m-other-top {
        img {
          width: 100%;
          height: 140px;
        }
      }
      .m-login-form {
        width: 100%;
        height: 200px;
        .ant-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
