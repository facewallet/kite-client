// import Vue from 'vue'
// import Vuex from 'vuex'
import { fetch } from '@request'
import { types } from '../../utils/im/mutation-types'
import Cookies from 'js-cookie'
// import { router } from '../../router/index'
import { TimeUtil, MessageUtil } from '../../utils/im/util'
import { Constant } from '../../utils/im/constant'

// Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    JIM: null,
    myName: null,
    isLogin: false,
    hasOffline: false,
    currentContact: null,
    friends: [],
    charts: [],
    messageInit: {}
  },
  getters: {
    getLastMsg: (state) => (username) => {
      let _chart = state.charts.find(x => x.username === username)
      if (!_chart || _chart.msgs.length === 0) {
        return { last_msg_text: '', last_msg_time_text: '', last_msg_time: 0 }
      }
      let _last = _chart.msgs[_chart.msgs.length - 1]
      let _last_msg_text = ''
      switch (_last.content.msg_type) {
        case 'text':
          _last_msg_text = _last.content.msg_body.text
          break
        case 'image':
          _last_msg_text = '[图片]'
          break
      }
      return {
        last_msg_text: _last_msg_text.length > 8 ? _last_msg_text.substr(0, 8) + '...' : _last_msg_text,
        last_msg_time_text: TimeUtil.stamp2timeString(_last.ctime_ms),
        last_msg_time: _last.ctime_ms
      }
    },
    getActiveMsgs: (state) => {
      let _chart = state.charts.find(x => x.username === state.currentContact)
      return _chart ? _chart.msgs : []
    }
  },
  mutations: {
    [types.SET_JIM](state, JIM) {
      state.JIM = JIM
    },
    [types.SET_ISLOGIN](state, login) {
      state.isLogin = login
    },
    [types.SET_MYNAME](state, name) {
      state.myName = name
    },
    [types.SET_FRIENDS](state, arr) {
      state.friends = arr
    },
    [types.SET_CURRENT_CONTACT](state, current) {
      // current.unread_msg_count = 0;
      state.currentContact = current
      // todo  改变未读数
      // state.currentContact.unread_msg_count = null;
    },
    [types.SET_HASOFFLINE](state, hasoffline) {
      state.hasOffline = hasoffline
    },
    [types.SET_OFFLINE](state, offline) {
      let contact = state.friends.find(x => x.username === offline.from_username)
      state.friends.splice(state.friends.indexOf(contact), 1)
      Object.assign(contact, { unread_msg_count: offline.unread_msg_count })
      state.friends.push(contact)
      state.charts.push({ username: offline.from_username, msgs: MessageUtil.parseArray(offline.msgs) })

      // let contact = {};
      // Object.assign(contact, {username: offline.from_username});
      // Object.assign(contact, {unread_msg_count: offline.unread_msg_count});
      // state.friends.push(contact);
      // state.charts.push({username: offline.from_username, msgs: MessageUtil.parseArray(offline.msgs)});
    },
    [types.ADD_MESSAGE](state, message) {
      let _username = message.content.from_id === state.myName ? message.content.target_id : message.content.from_id
      let _chart = state.charts.find(x => x.username === _username)
      if (!_chart) {
        state.charts.push({ username: _username, msgs: [MessageUtil.parseSingle(null, message)] })
      } else if (_chart.msgs.length === 0) {
        _chart.msgs.push(MessageUtil.parseSingle(null, message))
      } else {
        _chart.msgs.push(MessageUtil.parseSingle(_chart.msgs[_chart.msgs.length - 1], message))
      }
    },
    SET_MESSAGE_INIT (state, data) {
      // 设置文章
      state.messageInit = data
    }
  },
  actions: {
    initJIM({ commit, dispatch }) {
      console.log('进入生产')
      // eslint-disable-next-line no-undef
      const JIM = new JMessage()
      commit(types.SET_JIM, JIM)

      JIM.init({
        'appkey': 'd527f49432f2dfa0d52a3218',
        'random_str': 'suansuan',
        'signature': '4FCB1A53F9F8647C1D3672E69DAA55AE',
        'timestamp': 1610702684862,
        'flag': 1
      }).onSuccess(function (data) {
        console.log('success:' + JSON.stringify(data))
        // console.log('location.pathname' + location.pathname)
        // if (location.pathname !== '/login') {
        dispatch('loginJIM')
        // }
      }).onFail(function (data) {
        console.log('error:' + JSON.stringify(data))
      })
      console.log('结束生产')
    },
    initJIM2({ commit, dispatch }, datas) {
      console.log('进入生产')
      // eslint-disable-next-line no-undef
      const JIM = new JMessage()
      commit(types.SET_JIM, JIM)

      JIM.init({
        'appkey': datas.init.appkey,
        'random_str': datas.init.random_str,
        'signature': datas.init.signature,
        'timestamp': datas.init.timestamp,
        'flag': 1
      }).onSuccess(function (data) {
        console.log('success:' + JSON.stringify(data))
        // console.log('location.pathname' + location.pathname)
        // if (location.pathname !== '/login') {
        dispatch('loginJIM2', datas.user)
        // }
      }).onFail(function (data) {
        console.log('error:' + JSON.stringify(data))
      })
      console.log('结束生产')
    },
    loginJIM({ state, commit, dispatch }) {
      // let user = JSON.parse(Cookies.get(Constant.accessTokenIM))
      let user = {
        username: 'tiantian',
        password: 'tiantian'
      }
      // _this.$store.state.JIM.login(_this.user).onSuccess(function (data) {

      console.log('user:' + user)
      // Object.assign(user, { is_md5: true })
      state.JIM.login(user).onSuccess(function () {
        commit(types.SET_MYNAME, user.username)
        commit(types.SET_ISLOGIN, true)
        dispatch('getFriends')
      }).onFail(function (data) {
        console.log('loginError' + JSON.stringify(data))
        // router.push({ name: 'login' })
      }).onTimeout(function () {
        // router.push({ name: 'login' })
      })
    },
    loginJIM2({ state, commit, dispatch }, users) {
      // let user = JSON.parse(Cookies.get(Constant.accessTokenIM))
      // let _this = this
      console.log('登录IM')
      let user = {
        username: users.imname,
        password: users.impassword
      }
      // _this.$store.state.JIM.login(_this.user).onSuccess(function (data) {

      console.log('user:' + user)
      // Object.assign(user, { is_md5: true })
      state.JIM.login(user).onSuccess(function () {
        Cookies.set(Constant.accessTokenIM, user);
        commit(types.SET_MYNAME, user.username)
        commit(types.SET_ISLOGIN, true)
        // dispatch('getFriends')
      }).onFail(function (data) {
        console.log('loginError' + JSON.stringify(data))
        // router.push({ name: 'login' })
      }).onTimeout(function () {
        // router.push({ name: 'login' })
      })
    },
    logOut({ state }) {
      state.JIM.loginOut()
      Cookies.remove(Constant.accessTokenIM)
      // Cookies.remove("accessToken");
      // router.push({ name: 'login' })
    },
    getFriends({ state, commit, dispatch }) {
      // Promise.all([
      //     dispatch("getAllMessage"),
      //     dispatch("listenMessageReceive"),
      //     dispatch("listenDisconnect"),
      //     dispatch("listenOnEventNotification")
      // ])
      console.log(this.JIM)
      state.JIM.getFriendList().onSuccess(function (data) {
        commit(types.SET_FRIENDS, data.friend_list)
        Promise.all([
          dispatch('getAllMessage'),
          dispatch('listenMessageReceive'),
          dispatch('listenDisconnect'),
          dispatch('listenOnEventNotification')
        ])
      })
    },
    getAllMessage({ state, commit }) {
      console.log('getAllMessage')
      // 离线消息同步监听
      if (state.hasOffline) {
        return
      }

      state.JIM.onSyncConversation((data) => {
        commit(types.SET_HASOFFLINE, true)
        console.log('getAllMessage2:' + data)
        data.forEach(x => commit(types.SET_OFFLINE, x))
      })
    },
    listenMessageReceive({ state, commit }) {
      state.JIM.onMsgReceive((data) => {
        console.log('listenMessageReceive:' + JSON.stringify(data))
        data.messages.forEach(x => commit(types.ADD_MESSAGE, x))
      })
    },
    listenDisconnect({ state, commit }) {
      state.JIM.onDisconnect(() => {
        commit(types.SET_ISLOGIN, false)
      })
    },
    listenOnEventNotification({ state, commit }) {
      state.JIM.onEventNotification((data) => {
        if (data.event_type === 1) {
          commit(types.SET_ISLOGIN, false)
        }
      })
    },
    GET_MESSAGE_INIT ({ commit, dispatch, state }, parameter) {
      // 获取文章
      return fetch({
        url: '/message/init',
        method: 'get',
        parameter: { params: parameter }
      }).then(result => {
        commit('SET_MESSAGE_INIT', result.data.init)
        return result
      })
    }
  }
}
