import { fetch } from '@request'

const state = () => ({
  article: {}
})

const mutations = {
  SET_ARTICLE (state, data) {
    // 设置文章
    state.article = data
  }
}

const actions = {
  GET_ARTICLE ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/article',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE', result.data.article)
      return result
    })
  },
  GET_ARTICLE_USER_INFO ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/article/user',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GET_ARTICLE_ANNEX ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/article-annex',
      method: 'get',
      parameter: { params: parameter }
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
