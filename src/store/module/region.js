import { fetch } from '@request'

const state = () => ({
  regionAll: [],
  column_list: {
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  column: {},
  currColumnEnName: '' // 当前 文章专栏
})

const mutations = {

  SET_ALL_REGION (state, data) {
    state.regionAll = data.list
  }
}

const actions = {

  GET_ALL_REGION ({ commit, dispatch, state }, parameter) {
    // 获取文章专栏
    return fetch({
      url: '/region/all',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      if (result && result.meta.success === true) {
        commit('SET_ALL_REGION', result.data)
      }
      return result
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
