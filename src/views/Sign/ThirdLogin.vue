<template>
  <ClientOnly>
    <section class="sign-lay layout-content">
      <div class="sign-view client-card">
        <div class="title">
          第三方登录
        </div>
      </div>
    </section>
    <!--home-lay layout-content end-->
  </ClientOnly>
</template>

<script>
import { cookie } from '../../utils/cookie.js'
import { encrypt } from '../../utils/AESUtil.js'
import ClientOnly from 'vue-client-only'
import { mapState } from 'vuex'
import signModule from '../../store/module/sign'
export default {
  name: 'SignIn',
  metaInfo () {
    return {
      title: `第三方登录`,
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  mounted () {
    console.log('第三方登录回调回来了')
    const _this = this
    this.$store.registerModule('sign', signModule)
    console.log(this.$route.params.type)
    console.log(this.$route.query)
    console.log(this.$route.path)
    console.log(window.location.search)
    this.$store.dispatch('sign/OAUTHCALLBACK',{type:this.$route.params.type , query:window.location.search}).then(res => {
      console.log('第三方登录回调回来了2222')
      if (res.meta.success === true) {
        _this.$message.success(res.meta.message)
        _this.$store.dispatch('im/initJIM2', res.data)
        // this.$store.dispatch('im/initJIM2', res.data.init, res.data.user)
        _this.$refs.login.reset()
        cookie.set('accessToken', res.data.user.token, 7)
        _this.$router.push({
          // name: '/' ,
          name: 'home' ,
          params:{
            accessToken2:res.data.user.token
          }
        })
      } else {
        _this.$message.warning(res.meta.message)
      }
    })
  },
  data () {
    return {
    }
  },
  methods: {

  },
  computed: {
    ...mapState(["im"])
  },
  components: {
    ClientOnly
  },
  destroyed () {
  }
}
</script>

<style scoped lang="scss">

</style>
