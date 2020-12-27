import { fetch } from '@request'

const state = () => ({
  searchArticle: {
    list: [],
    total: 0,
    pageNum: 1,
    article_list: [],
    count: 0,
    page: 1,
    pageSize: 25,
    search: '',
    tag_all: []
  }
})

const mutations = {
  SET_ARTICLE_SEARCH (state, data) {
    // 设置搜索的文章
    state.searchArticle = data.list
    state.searchArticle.search = data.search
  }
}

const actions = {
  GET_ARTICLE_SEARCH ({ commit, dispatch, state }, parameter) {
    // 获取搜索的文章
    return fetch({
      url: '/article/search',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      if (result.meta.success === true) {
        this.$message.success(result.meta.message)
        commit('SET_ARTICLE_SEARCH', result.data)
        return result
      } else {
        this.$message.warning(result.meta.message);
      }

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
