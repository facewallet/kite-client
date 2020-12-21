<template>
  <div class="user-attention"
       v-loading="isLoading">
    <div class="user-article-attention-any">
      <router-link :to="{
          name: 'user',
          query: { any: 'me' },
          params: { routeType: 'attention' }
        }"
                   :class="{ active: $route.query.any === 'me' || !$route.query.any }">关注</router-link>
      <router-link :to="{
          name: 'user',
          query: { any: 'other' },
          params: { routeType: 'attention' }
        }"
                   :class="{ active: $route.query.any === 'other' }">粉丝</router-link>
    </div>

    <ul class="user-article-attention-view">
      <li class="item"
          v-for="(item, key) in userAttentionList.list"
          :key="key">
        <div class="user">
          <div class="lazy avatar avatar loaded"
               title
               :style="{ 'background-image': 'url(' + item.user.avatar + ')' }"></div>
          <div class="info-box">
            <div class="username">
              <router-link :to="{
                  name: 'user',
                  params: { uid: item.user.uid, routeType: 'article' }
                }"
                           class="link">{{ item.user.nickname }}</router-link>
            </div>
            <div class="detail">{{ item.user.introduction }}</div>
          </div>
          <button class="follow-btn"
                  @click="onUserAttention(item)"
                  :class="{ active: isAttention(item) }">
            {{ isAttention(item) ? '已关注' : '关注' }}
          </button>
        </div>
      </li>
    </ul>

    <div class="pagination">
      <Page :total="Number(userAttentionList.count)"
            :pageSize="Number(userAttentionList.pageSize)"
            :page="Number(userAttentionList.page || 1)"
            @pageChange="pageChange"></Page>
    </div>
  </div>
</template>

<script>

import { Page } from '@components'
import { mapState } from 'vuex'
import { modelName } from '@utils/constant'

export default {
  name: 'UserAttention',
  data () {
    return {
      isLoading: false,
      modelName,
      userAttentionList: {
        count: 0,
        page: 1,
        pageSize: 10,
        list: []
      }
    }
  },
  watch: {
    $route (to, from) {
      this.getUserAttentionList()
    }
  },
  mounted () {
    this.getUserAttentionList()
  },
  methods: {
    getUserAttentionList () {
      this.$store
        .dispatch('user/GET_USER_ATTENTION_LIST', {
          uid: this.$route.params.uid,
          page: this.userAttentionList.page || 1,
          any: this.$route.query.any || 'me',
          pageSize: this.userAttentionList.pageSize || 10
        })
        .then(result => {
          if (result.meta.success === true) {
            this.userAttentionList = result.data
            this.isLoading = false
          }

        })
        .catch(() => {
          this.isLoading = false
        })
    },
    pageChange (val) {
      this.userAttentionList.page = val
      this.getUserAttentionList()
    },
    isAttention (item) {
      console.log('郭照----1',this.personalInfo.islogin)
      console.log('郭照----2',this.user.associateInfo)
      console.log('郭照----3',this.user.associateInfo.userAttentionId)
      console.log('郭照----4',this.userInfo)
      // if (this.personalInfo.islogin &&
      //         ~this.user.associateInfo.userAttentionId.indexOf(
      //                 String(this.userInfo.uid)
      //         )
      // ) {
      //   return true
      // } else {
      //   return false
      // }

      // if (~userAttentionIds.indexOf(Number(this.personalInfo.user.uid))) {
      //   return true
      // } else {
      //   return false
      // }
      console.log('良机--',item)
      // 是否收藏
      let userAttentionIds = []
      // if (item.userAttentionIds && item.userAttentionIds.length > 0) {
      //   item.userAttentionIds.map(item => {
      //     userAttentionIds.push(Number(item.uid))
      //   })
      if (this.userAttentionList.list && this.userAttentionList.list.length > 0) {
        this.userAttentionList.list.map(ite => {
          userAttentionIds.push(Number(ite.user.uid))
        })
        console.log('杨坚----1',userAttentionIds)
        console.log('杨坚----2',this.personalInfo.user)
        if (this.personalInfo && this.personalInfo.user && this.personalInfo.user.uid && ~userAttentionIds.indexOf(Number(this.personalInfo.user.uid))) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    onUserAttention (item) {
      if (!this.personalInfo.islogin) {
        this.$message.error('请先登录')
        return false
      }
      this.$store
        .dispatch('common/SET_ATTENTION', {
          associateId: item.user.uid,
          type: modelName.user
          // moreConfig: { direct: true }
        })
        .then(result => {
          this.getUserAttentionList()
          this.$message.warning(result.message)
        })
        .catch(function (err) {
          this.$message.warning(err)
        })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user'])
  },
  components: {
    Page
  }
}
</script>

<style scoped lang="scss">
.user-attention {
  margin-top: 20px;
  .user-article-attention-any {
    a {
      display: inline-block;
      font-size: 14px;
      margin-right: 15px;
      &.active {
        padding-bottom: 15px;
        color: #ffc107;
        border-bottom: 1px solid #ffc107;
      }
    }
  }
  .user-article-attention-view {
    .item {
      border-bottom: 1px solid hsla(240, 2%, 90%, 0.5);
      position: relative;
      box-sizing: border-box;
      .user {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 6px 28px;
        min-height: 85px;
        .avatar {
          display: inline-block;
          position: relative;
          background-position: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: #eee;
          -webkit-box-flex: 0;
          -ms-flex: 0 0 auto;
          flex: 0 0 auto;
          margin-right: 20px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
        .info-box {
          -webkit-box-flex: 1;
          -ms-flex: 1 1 auto;
          flex: 1 1 auto;
          min-width: 0;
          .username {
            font-size: 16px;
            font-weight: 600;
            color: #2e3135;
          }
          .detail {
            font-size: 12px;
            font-weight: 500;
            color: #b9c0c8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .follow-btn {
          -webkit-box-flex: 0;
          -ms-flex: 0 0 auto;
          flex: 0 0 auto;
          margin: 0 0 0 12px;
          padding: 0;
          width: 88px;
          height: 28px;
          font-size: 12px;
          color: #92c452;
          background-color: #fff;
          border: 1px solid #92c452;
          border-radius: 2px;
          &.active {
            color: #fff;
            background-color: #92c452;
          }
        }
      }
    }
  }
}
</style>
