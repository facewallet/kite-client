import { fetch, file } from '@request'

const state = () => ({
  graduateList: {
    // blog 信息列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  graduateInfo: {
    // cover_img: ''
  }, // 小书的信息
  articlesMy: {},
  booksBookAll: [] // 小书的所有章节
})

const mutations = {
  SET_GRADUATE_LIST (state, data) {
    // 设置小书列表
    if (data) state.graduateList = data
  },
  SET_GRADUATE_INFO (state, data) {
    // 设置小书列表
    state.graduateInfo = data
  }
}

const actions = {
  GET_GRADUATE_LIST ({ commit, dispatch, state }, parameter) {
    // 获取小书
    return fetch({
      url: '/graduate/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_GRADUATE_LIST', result.data.list)
      return result
    })
  },
  CREATE_GRADUATE: ({ commit, dispatch, state }, parameter) => {
    // 创建小书
    return file({
      url: '/graduate/create',
      method: 'post',
      parameter: parameter
    })
  },
  CREATE_GRADUATE2: ({ commit, dispatch, state }, parameter, moreConfig) => {
    // 创建小书
    return fetch({
      url: '/graduate/create',
      method: 'post',
      parameter: parameter,
      moreConfig: moreConfig
    })
  },
  GET_GRADUATE_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取用户自己的小书
    return fetch({
      url: '/graduate/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_GRADUATE_INFO', result.data.info)
      return result
    })
  },
  UPDATE_GRADUATE: ({ commit, dispatch, state }, parameter) => {
    // 更新小书
    return fetch({
      url: '/graduate/update',
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
