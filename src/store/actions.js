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
  }
  // initJIM({ commit, dispatch }) {
  //   console.log('黄帝内经')
  //   const JIM = new JMessage();
  //   //
  //   JIM.init({
  //     'appkey': 'd527f49432f2dfa0d52a3218',
  //     'random_str': 'suansuan',
  //     'signature': '9FF86066C3BB5D159D614B6FD22D638C',
  //     'timestamp': 1610420539690,
  //     'flag': 1
  //   }).onSuccess(function (data) {
  //     console.log('JMESSAGE init success')
  //   }).onFail(function (data) {
  //     console.log('error:' + JSON.stringify(data))
  //   })
  //   console.log('结束了')
  // }

}
