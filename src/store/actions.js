import { fetch } from '@request'

export default {
  PERSONAL_INFO({ commit, dispatch, state }, parameter = {}) {
    // 登录用户的个人信息
    console.log('参数是:', parameter)
    return fetch({
      url: '/personal/info',
      method: 'post',
      parameter: parameter
    }).then(result => {
      if (result.data && result.data.user) {
        commit('SET_PERSONAL_INFO', result.data)
        return result
      }
    })

    // if (parameter.accessToken !== '') {
    //   return fetch({
    //     url: '/personal/info',
    //     method: 'post',
    //     parameter: parameter
    //   }).then(result => {
    //     if (result.data && result.data.user) {
    //       commit('SET_PERSONAL_INFO', result.data)
    //       return result
    //     }
    //   })
    // } else {
    //   console.log('进到这里六')
    // }
  }
}
