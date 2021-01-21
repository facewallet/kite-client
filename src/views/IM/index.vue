<template>
<!--    <div >-->
        <el-col>

            <el-col :span="4">
                <Contacts/>
            </el-col>
            <el-col :span="12">
                <ChartWindow v-if="im.currentContact"/>
            </el-col>
        </el-col>
<!--    </div>-->
</template>

<script>
  import Contacts from "./Contacts";
  import ChartWindow from "./ChartWindow";
  import { mapState } from 'vuex'
  // import im from '../../store/module/im'

  export default {
    components: {
      Contacts,
      ChartWindow
    },
    created() {
      console.log("挂载IM")
      // this.$store.dispatch("home/GET_POPULAR_ARTICLE_TAG"); // 获取热门文章标签
      // this.$store.dispatch('im/initJIM2', res.data)

      if(!this.$store.state.im.JIM){
        this.$store.dispatch("im/GET_MESSAGE_INIT2");
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
