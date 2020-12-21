import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  SET_ATTENTION ({ commit, dispatch, state }, parameter) {
    // 设置关注 // parameter: { params: parameter }
    console.log('楚庄王----', parameter)
    return fetch({
      url: '/common/attention',
      method: 'post',
      // parameter: { ...parameter }
      parameter: parameter
    })
  },
  SET_LIKE ({ commit, dispatch, state }, parameter) {
    // 设置喜欢
    return fetch({
      url: '/common/like',
      method: 'post',
      parameter: parameter
    })
  },
  SET_COLLECT ({ commit, dispatch, state }, parameter) {
    // 设置收藏
    return fetch({
      url: '/common/collect',
      method: 'post',
      parameter: parameter
    })
  },
  GET_COLLECT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取收藏列表
    return fetch({
      url: '/collect/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  SET_THUMB ({ commit, dispatch, state }, parameter) {
    // 设置点赞
    return fetch({
      url: '/common/thumb',
      method: 'post',
      parameter: parameter
    })
  },
  GET_EXPERIENCE_LIST ({ commit, dispatch, state }, parameter) {
    // 获取经验列表
    return fetch({
      url: '/experience/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GITHUB_OAUTN ({ commit, dispatch, state }, parameter) {
    // 获取经验列表
    return fetch({
      url: '/oauth/github-login-oauth',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  DELETE_OAUTN ({ commit, dispatch, state }, parameter) {
    // 解除绑定
    return fetch({
      url: '/oauth/delete-oauth',
      method: 'post',
      parameter
    })
  },
  UPLOAD_FILE: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/file/upload',
      method: 'post',
      parameter: data
    })
  },

  UPLOAD_AVATAR: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/avatar/upload',
      method: 'post',
      parameter: data
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
