<template>
  <div class="github">
    <div class="github-view">
      <p>查无此人,<a href="/">请返回首页</a></p>
    </div>
  </div>
</template>

<script>
import { cookie } from '../../utils/cookie.js'
export default {
  name: 'Main',
  mounted () {
    // this.githubAuth()
  },
  data () {
    return {
      isloading: false,
      authInfo: {
        data: {
          type: ''
        }
      }
    }
  },
  methods: {
    githubAuth () {
      this.isloading = true
      this.$store
        .dispatch('common/GITHUB_OAUTN', this.$route.query)
        .then(result => {
          this.isloading = false
          this.authInfo = result
          if (result.state === 'success') {
            if (result.data.type === 'login') {
              cookie.set('accessToken', result.data.token, 7)
              window.location.href = '/'
            } else if (result.data.type === 'create') {
              cookie.set('accessToken', result.data.token, 7)
            } else if (result.data.type === 'bind') {
              setTimeout(() => {
                this.$router.push({ name: 'ThirdParty' })
              }, 3000)
            }
          }
        })
    }
  }
}
</script>
<style scoped lang="scss">
.github {
  .github-view {
    width: 500px;
    margin: 50px auto;
    padding: 50px 30px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 #e4e4e4;
    .title {
      font-size: 25px;
      text-align: center;
    }
    .github-main {
      .error {
        font-size: 22px;
        text-align: center;
        padding: 30px;
      }
      a {
        display: block;
        font-size: 20px;
        margin-top: 10px;
        color: #ea6f5a;
      }
      .create {
        padding-top: 30px;
        a {
          text-align: center;
        }
      }
      .login {
        display: block;
        font-size: 18px;
        margin-top: 10px;
        color: #ea6f5a;
        text-align: center;
        padding-top: 30px;
      }
      .bind {
        display: block;
        font-size: 18px;
        margin-top: 10px;
        color: #ea6f5a;
        text-align: center;
        padding-top: 30px;
      }
    }
    .loading {
      text-align: center;
      padding: 30px;
      p {
        font-size: 18px;
      }
      a {
        display: block;
        font-size: 18px;
        margin-top: 10px;
        color: #ea6f5a;
      }
    }
  }
}
</style>
