import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  PERSONAL_UPLOAD_AVATAR ({ commit, dispatch, state }, parameter) {
    // 上传用户头像
    return fetch({
      url: '/personal/upload-avatar',
      method: 'post',
      parameter: parameter
    })
  },
  PERSONAL_UPLOAD_INFO ({ commit, dispatch, state }, parameter) {
    // 更新用户信息
    console.log('二虎睛石------', parameter)
    return fetch({
      url: '/personal/update',
      method: 'put',
      parameter: parameter
    })
  },
  PERSONAL_UPLOAD_PASSWORD ({ commit, dispatch, state }, parameter) {
    // 更新用户密码
    return fetch({
      url: '/upc/update/password',
      method: 'put',
      parameter: parameter
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
