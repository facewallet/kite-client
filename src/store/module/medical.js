import { fetch, file } from '@request'

const state = () => ({
  medicalList: {
    // blog 信息列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  medicalInfo: {
    // cover_img: ''
  }, // 小书的信息
  articlesMy: {},
  booksBookAll: [] // 小书的所有章节
})

const mutations = {
  SET_MEDICAL_LIST (state, data) {
    // 设置小书列表
    if (data) state.medicalList = data
  },
  SET_MEDICAL_INFO (state, data) {
    // 设置小书列表
    state.medicalInfo = data
  }
}

const actions = {
  GET_MEDICAL_LIST ({ commit, dispatch, state }, parameter) {
    // 获取小书
    return fetch({
      url: '/medical/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_MEDICAL_LIST', result.data.list)
      return result
    })
  },
  CREATE_MEDICAL: ({ commit, dispatch, state }, parameter) => {
    // 创建小书
    return file({
      url: '/medical/create',
      method: 'post',
      parameter: parameter
    })
  },
  CREATE_MEDICAL2: ({ commit, dispatch, state }, parameter, moreConfig) => {
    // 创建小书
    return fetch({
      url: '/medical/create',
      method: 'post',
      parameter: parameter,
      moreConfig: moreConfig
    })
  },
  GET_MEDICAL_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取用户自己的小书
    return fetch({
      url: '/medical/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_MEDICAL_INFO', result.data.info)
      return result
    })
  },
  UPDATE_MEDICAL: ({ commit, dispatch, state }, parameter) => {
    // 更新小书
    return fetch({
      url: '/medical/update',
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
