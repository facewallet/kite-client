<template>
    <client-only>
        <section class="user-lay layout-content"
                 id="user-center-article-im">
            <div class="container  box-container">
                <div class="row">
                    <div class="col-xs-12 col-sm-3 col-md-3 box-aside">
                        <Contacts/>
                    </div>
                    <div class="col-xs-12 col-sm-9 col-md-9 main">
                        <ChartWindow v-if="im.currentContact"/>
                    </div>

                </div>
            </div>
        </section>
    </client-only>
</template>

<script>
  import ClientOnly from 'vue-client-only'
  import Contacts from "./Contacts";
  import ChartWindow from "./ChartWindow";
  import { mapState } from 'vuex'
  import { types } from '../../utils/im/mutation-types'
  import UserAside from '../User/view/UserAside'
  import ArticleView from '../User/view/Article'
  import BlogView from '../User/view/Blog'
  import BooksView from '../User/view/Books'
  import DynamicView from '../User/view/Dynamic'
  import UserAttentionView from '../User/view/UserAttention'
  import UserMessageView from '../User/view/UserMessage'
  // import im from '../../store/module/im'

  export default {
    components: {
      Contacts,
      ChartWindow,
      ClientOnly
    },
    mounted() {
      console.log("挂载IM")
      //todo 先判断是否登录，如果未登录跳转到登录
      // this.$store.dispatch("home/GET_POPULAR_ARTICLE_TAG"); // 获取热门文章标签
      // this.$store.dispatch('im/initJIM2', res.data)
      let nickname = this.$route.query.nickname;
      if(nickname) {
        this.$store.commit('im/'+types.SET_QUERY, nickname)
      } else {
        this.$store.commit('im/'+types.SET_QUERY, null)
      }
      let isExist = false
      if(!this.$store.state.im.JIM){
        this.$store.dispatch("im/GET_MESSAGE_INIT2");
        //如果有会话，看看会话中是否有该用户
      }else if (this.$store.state.im.friends.length > 0) {
        this.$store.state.im.friends.forEach(f => {
          let _this = this
          if(f.username === nickname) {
            isExist = true
            _this.$store.commit('im/'+types.SET_CURRENT_CONTACT, nickname)
          }
        })
      }
      if(nickname && !isExist){
        let contact = {}
        Object.assign(contact, { username: nickname })
        Object.assign(contact, { unread_msg_count: 0 })
        this.$store.state.im.friends.push(contact)
        this.$store.state.im.charts.push({ username: nickname, msgs: [] })
        this.$store.commit('im/'+types.SET_CURRENT_CONTACT, nickname)
      }

      // this.$store.dispatch("im/initJIM");
      // this.$store.dispatch("initJIM");
    },
    methods: {
      reLogin() {
        this.$store.dispatch("initJIM");
      },
      logOut() {
        this.$store.dispatch("logOut");
      }
    },computed: {
      ...mapState(["home", "im", "website"]) // home:主页  article_column:文章的专栏
    },
  }
</script>

<style scoped lang="scss">
    .user-lay.layout-content {
        .client-card {
            margin-bottom: 10px;
            padding: 20px;
        }


    }
</style>
