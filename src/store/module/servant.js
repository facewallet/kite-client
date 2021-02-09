import { fetch, file } from '@request'

const state = () => ({
  servantList: {
    // blog 信息列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  servantInfo: {
    // cover_img: ''
  }, // 小书的信息
  articlesMy: {},
  booksBookAll: [] // 小书的所有章节
})

const mutations = {
  SET_SERVANT_LIST (state, data) {
    // 设置小书列表
    if (data) state.servantList = data
  },
  SET_SERVANT_INFO (state, data) {
    // 设置小书列表
    state.servantInfo = data
  }
}

const actions = {
  GET_SERVANT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取小书
    return fetch({
      url: '/servant/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_SERVANT_LIST', result.data.list)
      return result
    })
  },
  CREATE_SERVANT: ({ commit, dispatch, state }, parameter) => {
    // 创建小书
    return file({
      url: '/servant/create',
      method: 'post',
      parameter: parameter
    })
  },
  CREATE_SERVANT2: ({ commit, dispatch, state }, parameter, moreConfig) => {
    // 创建小书
    return fetch({
      url: '/servant/create',
      method: 'post',
      parameter: parameter,
      moreConfig: moreConfig
    })
  },
  GET_SERVANT_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取用户自己的小书
    return fetch({
      url: '/servant/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_SERVANT_INFO', result.data.info)
      return result
    })
  },
  UPDATE_SERVANT: ({ commit, dispatch, state }, parameter) => {
    // 更新小书
    return fetch({
      url: '/servant/update',
      method: 'post',
      parameter: parameter
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
