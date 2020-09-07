<template>
  <div class="app-view">
    <box-header />
    <router-view />
    <global-view />
  </div>
</template>

<script>
import header from '@views/Parts/Header'
import GlobalView from '@views/Parts/GlobalView'
import { mapState } from 'vuex'
export default {
  name: 'Main',
  asyncData({ store, route, accessToken = '' }) {
    console.log('Main页面---服务器端渲染')

    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch('PERSONAL_INFO', { accessToken }),
      console.log('suansuan001'),
      store.dispatch('website/GET_WEBSITE_INFO'),
      // store.dispatch('articleTag/GET_ARTICLE_TAG_ALL')
    ])
    // if(accessToken){
    //   return Promise.all([
    //     store.dispatch('PERSONAL_INFO', { accessToken }),
    //     store.dispatch('website/GET_WEBSITE_INFO'),
    //     // store.dispatch('articleTag/GET_ARTICLE_TAG_ALL')
    //   ])
    // }else {
    //   return Promise.all([
    //     // store.dispatch('PERSONAL_INFO', { accessToken }),
    //     store.dispatch('website/GET_WEBSITE_INFO'),
    //     // store.dispatch('articleTag/GET_ARTICLE_TAG_ALL')
    //   ])
    // }

  },
  mounted() {
    // console.log('this.$route.params.accessToken2', this.$route.params.accessToken2)
    // if(this.$route.params && this.$route.params.accessToken2)
    //   // store.dispatch('PERSONAL_INFO', { accessToken:this.$route.params.accessToken2 })
    // {
    //   console.log('suansuan002')
    //   this.$store.dispatch('PERSONAL_INFO', { accessToken:this.$route.params.accessToken2 })
    // }



    if (this.personalInfo.islogin) {
      this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
      this.$store.dispatch('user/GET_ASSOCIATE_INFO')
      // 用户登录的情况下，当前用户加入socket
      // this.$socket.emit('loginXiaoSuiBi', { uid: this.personalInfo.user.uid })
    }else {
      this.$store.dispatch('PERSONAL_INFO')
    }
  },
  computed: {
    ...mapState(['personalInfo']) // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    'box-header': header,
    GlobalView
  }
}
</script>
