<template>
  <ClientOnly>
    <section class="sign-lay layout-content">
      <div class="sign-view client-card">
        <div class="title">
          公务员
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
  name: 'servant',
  metaInfo () {
    return {
      title: `公务员`,
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  mounted () {

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
