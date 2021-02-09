<template>
  <section class="article layout-content container">
    <div class="article-lay row">
      <div class="col-xs-12 col-sm-8--4 col-md-8--4">
        <main class="main client-card">
          <h1 class="article-title">{{ medical.medicalInfo.title }}</h1>
          <h4 class="article-description">{{ medical.medicalInfo.description }}</h4>

          <div class="article-view"
               v-if="medical.medicalInfo.id">
            <div class="article-user-info">
              <div class="author">
                <router-link :to="{
                    name: 'user',
                    params: { uid: medical.medicalInfo.user.uid, routeType: 'article' }
                  }"
                             class="avatar">
                  <img v-lazy="medical.medicalInfo.user.avatar"
                       alt />
                </router-link>
                <div class="info">
                  <div class="name">
                    <router-link :to="{
                        name: 'user',
                        params: { uid: medical.medicalInfo.user.uid, routeType: 'article' }
                      }">{{ medical.medicalInfo.user.nickname }}</router-link>
                  </div>
                  <!-- 文章数据信息 -->
                  <div class="meta">
<!--                    <span class="publish-time">{{ article.updateDate }}</span>-->
                    <span class="publish-time">{{ medical.medicalInfo.updateDate ? moment(medical.medicalInfo.updateDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD') }}
</span>
                    <span class="views-count">阅读 {{ medical.medicalInfo.readCount  ? medical.medicalInfo.readCount : 0}}</span>
                    <span class="comments-count">评论 {{ medical.medicalInfo.commentCount  ? medical.medicalInfo.commentCount : 0}}</span>
                    <span class="likes-count">点赞 {{ medical.medicalInfo.thumbCount  ? medical.medicalInfo.thumbCount : 0}}</span>
<!--                    <em class="source">{{ sourceTypeList[article.source] }}</em>-->
<!--                    <em class="type"-->
<!--                        :class="`type${medical.medicalInfo.type}`">{{-->
<!--                      articleTypeText[article.type]-->
<!--                    }}</em>-->


                    <router-link class="article-edit"
                                 v-if="personalInfo.user.uid===medical.medicalInfo.user.uid"
                                 :to="{name:'medicalWrite',params:{type:medical.medicalInfo.id}}">文章编辑</router-link>
                  </div>
                </div>
              </div>
            </div>

            <div class="article-content"
                 v-html="medical.medicalInfo.content"></div>

            <div class="row mrg-bm20">
              <div v-if="medical.medicalInfo.fileList && medical.medicalInfo.fileList.length >0" class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <a-icon type="download"/>
                <a-list item-layout="horizontal" :data-source="medical.medicalInfo.fileList">
                  <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta>
                      <a slot="title" :href= "item.host + item.url" >{{ item.name }}</a>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </div>
            </div>


          </div>

          <p class="no-aricle"
             v-else>文章不存在</p>

        </main>
      </div>
      <div class="col-xs-12 col-sm-3--6 col-md-3--6 aside">
        <ArticleAside />
      </div>
    </div>

    <Dialog :visible.sync="isBuyDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="380px">
      <div class="buy-view"
           v-loading="isBuyLoading">
        <h3 class="title">购买信息确认</h3>
        <ul>
          <li class="p-name">商品名称：<em>文章附件</em></li>
          <li class="p-pay-type">
            支付方式：<em>{{ payTypeText[articleAnnex.pay_type] }}</em>
          </li>
          <li class="p-pay-price">
            价格：<em>￥{{ articleAnnex.price }}</em>
          </li>
        </ul>
        <div class="footer-view">
          <button class="btn btn-buy"
                  @click="enterBuy">确认购买</button>
          <button class="btn btn-cancel"
                  @click="isBuyDialog = false">
            取消
          </button>
        </div>
      </div>
    </Dialog>
  </section>
  <!--home-lay layout-content end-->
</template>

<script>
import ArticleComment from '@views/Comment/ArticleComment'
import ArticleAside from '@views/Article/component/ArticleAside'
import { share, baidu, google } from '@utils'
import { mapState } from 'vuex'
import googleMixin from '@mixins/google'
import { Dropdown, Dialog } from '@components'
// 在这里导入模块，而不是在 `store/index.js` 中
import shopModule from '../../store/module/shop'
import hljs from '@utils/highlight.pack'
import moment from 'moment'

import {
  statusList,
  articleType,
  statusListText,
  articleTypeText,
  modelName,
  payTypeText,
  isFree,
  isOpen
} from '@utils/constant'
export default {
  name: 'GraduateInfo',
  mixins: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: '仲景在线',
      titleTemplate: `%s - ${this.website.meta.website_name || ''}`,
      meta: [
        {
          // set meta
          name: 'description',
          content: `${this.medical.medicalInfo.excerpt || ''}`
        },
        {
          // og:site_name
          property: 'og:site_name',
          content: this.website.meta.website_name
        },
        {
          // og:site_name
          property: 'og:image',
          content: this.medical.medicalInfo.cover_img || this.website.meta.logo
        },
        {
          // og:type
          property: 'og:type',
          content: `article`
        },
        {
          // og:title
          property: 'og:title',
          content: this.medical.medicalInfo.title
        },
        {
          // og:description
          property: 'og:description',
          content: this.medical.medicalInfo.title
        },
        {
          // og:url
          property: 'og:url',
          content: `${this.website.meta.domain_name}/p/${this.medical.medicalInfo.id}`
        }
      ],
      htmlAttrs: {
        lang: 'zh'
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config,
          random: this.medical.medicalInfo.id
        }),
        ...google.statisticsCode({
          route: this.$route,
          googleCode: this.website.config.googleCode,
          random: this.$route.params.blogId
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  asyncData ({ store, route, accessToken = '' }) {
    // 触发 action 后，会返回 Promise
    console.log('用户路由参数',route.params.id)
    if('undefined' != route.params.id){
      return Promise.all([
        store.dispatch('medical/GET_MEDICAL_INFO', {
          id: route.params.id,
          accessToken
        })
      ])
    }

  },
  data () {
    return {
      sourceTypeList: ['', '原创', '转载'],
      articleTypeText,
      payTypeText,
      isFree,
      isOpen,
      modelName,
      isBuyDialog: false,
      isBuyLoading: false,
      articleAnnex: {}, // 文章附件信息
      thumbUserList: []
    }
  },
  mounted () {
    this.$store.registerModule('shop', shopModule)
  },
  methods: {
    moment,
    onBuy () {
      //
      if (!this.personalInfo.islogin) {
        this.$message.warning('请先登录，再继续操作')
        this.$router.push({ name: 'signIn' })
        return false
      }
      this.isBuyDialog = true
    },
    enterBuy () {
      if (!this.personalInfo.islogin) {
        this.$message.warning('请先登录，再继续操作')
        return false
      }
      this.isBuyLoading = true
      this.$store
        .dispatch('shop/BUY', {
          product_id: this.medical.medicalInfoAnnex.id,
          product_type: this.modelName.article_annex
        })
        .then(result => {
          this.isBuyLoading = false
          if (result.state === 'success') {
            this.isBuyDialog = false
            if (this.medical.medicalInfo.is_attachment == this.isOpen.yes) {
              this.getArticleAnnex()
            }
            this.$message.success(result.message)
          } else {
            this.$message.warning(result.message)
          }
        })
    },




  },
  computed: {
    // article () {
    //   return this.$store.state.article.article || {}
    // },
    ...mapState(['website','medical', 'personalInfo', 'user'])
  },
  components: {
    ArticleComment,
    Dropdown,
    Dialog,
    ArticleAside
  },
  destroyed () {
    this.$store.unregisterModule('shop')
  }
}
</script>

<style scoped lang="scss">
.article.layout-content {
  margin-bottom: 12px;
  .main {
    width: 100%;
    flex: 1;
    padding: 15px 25px;
    .article-title {
      text-align: left;
      max-width: 100%;
      margin-top: 15px;
      position: static;
      color: #48494d;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.3;
    }
    .article-description {
      text-align: left;
      max-width: 100%;
      margin-top: 15px;
      position: static;
      color: #48494d;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.3;
    }
    .article-view {
      .article-user-info {
        padding: 30px 0 15px;
        .author {
          .avatar {
            width: 48px;
            height: 48px;
            vertical-align: middle;
            display: inline-block;
            img {
              width: 100%;
              height: 100%;
              border: 1px solid #ddd;
              border-radius: 50%;
            }
          }
          .info {
            vertical-align: middle;
            display: inline-block;
            margin-left: 8px;
            .name {
              margin-right: 3px;
              font-size: 16px;
              vertical-align: middle;
            }
            .follow {
              padding: 0 7px 0 5px;
              font-size: 12px;
              border-color: #42c02e;
              border-radius: 40px;
              color: #fff;
              background-color: #42c02e;
              line-height: 1;
              &.active {
                background: #999999;
                border-color: #999999;
              }
            }
            .meta {
              font-size: 12px;
              color: #969696;
              span + span::before {
                display: inline;
                content: " \B7 ";
                color: #9b9b9b;
                padding-left: 2px;
                padding-right: 2px;
              }
              .source {
                background: #ea6f5a;
                padding: 1px 5px;
                border-radius: 3px;
                color: #fff;
                margin-left: 15px;
                margin-right: 5px;
              }
              .type {
                padding: 2px 5px;
                border-radius: 5px;
                @for $i from 1 through 5 {
                  &.type#{$i} {
                    @if $i==1 {
                      background-color: rgb(253, 239, 207);
                      color: rgb(255, 174, 14);
                    } @else if $i==2 {
                      background-color: rgb(245, 243, 231);
                      color: rgb(135, 125, 106);
                    } @else if $i==3 {
                      background-color: rgb(231, 243, 240);
                      color: rgb(145, 203, 186);
                    } @else if $i==4 {
                      background-color: rgb(135, 198, 179);
                      color: rgb(255, 255, 255);
                    } @else if $i==5 {
                      background-color: rgb(245, 243, 231);
                      color: rgb(135, 125, 106);
                    }
                  }
                }
              }

              .article-edit {
                padding: 1px 5px;
                cursor: pointer;
                font-size: 12px;
                border-radius: 5px;
                background-color: #fd763a;
                color: #f2f6fc;
                display: inline-block;
                margin-left: 10px;
              }
            }
          }
        }
      }
      .support-author {
        min-height: 144px;
        padding: 20px 0;
        text-align: center;
        clear: both;
        p {
          padding: 0 30px;
          margin-bottom: 20px;
          min-height: 24px;
          font-size: 17px;
          font-weight: 700;
          color: #969696;
        }
        .btn-pay {
          margin-bottom: 20px;
          padding: 8px 25px;
          font-size: 16px;
          color: #fff;
          background-color: #ea6f5a;
          border-radius: 20px;
        }
      }
      .attachment {
        background: #f2f2f2;
        padding: 10px;
        margin-bottom: 15px;
        .title {
          font-size: 15px;
        }
        .price-info {
          font-size: 15px;
          .buy,
          .login {
            cursor: pointer;
          }
          .buy {
            color: #ea6f5a;
          }
          .login {
            color: #42c02e;
          }
        }
      }
      .tag-body {
        display: -webkit-box;
        display: flex;
        margin-top: 30px;
        li {
          position: relative;
          list-style: none;
          margin: 0 15px 15px 0;
          font-size: 12px;
          > a {
            color: var(--layer-color);
            padding: 2px 5px;
            border: 1px solid transparent;
            position: relative;
            white-space: nowrap;
            word-wrap: normal;
            display: block;
            background-color: var(--light);
            border-radius: 3px 3px 3px 3px;
            line-height: 21px;
            .img {
              border-radius: 2px 2px 2px 2px;
              height: 16px;
              width: 16px;
              float: left;
              margin: 2px 3px 0 0;
              background-color: rgba(0, 0, 0, 0.02);
              background-size: cover;
              background-repeat: no-repeat;
              background-position: 50%;
            }
          }
        }
      }

      .meta-bottom {
        margin-top: 20px;
        .meta-bottom-item {
          display: inline-block;
          width: 38px;
          height: 38px;
          line-height: 38px;
          border: 1px solid #e0e0e0;
          text-align: center;
          margin-right: 20px;
          cursor: pointer;
          border-radius: 20px;
          i {
            font-size: 16px;
            color: #333;
          }
          &.active {
            border: 1px solid #e67e7e;
            i {
              color: #e67e7e;
            }
          }
        }
      }
      .share-group {
        float: right;
        margin-top: 6px;
        .share-circle {
          width: 50px;
          height: 50px;
          margin-left: 5px;
          text-align: center;
          border: 1px solid #dcdcdc;
          border-radius: 50%;
          vertical-align: middle;
          display: inline-block;
          position: relative;
        }
        .more-share {
          width: auto;
          padding: 4px 18px;
          font-size: 14px;
          color: #9b9b9b;
          line-height: 40px;
          border-radius: 50px;
        }
      }

      .thumb-user-list {
        margin-top: 30px;
        .avatar-img {
          display: inline-block;
          position: relative;
          background-position: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: #eee;
          width: 38px;
          height: 38px;
          margin-right: 10px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .avatar-num {
          width: 38px;
          height: 38px;
          line-height: 38px;
          display: inline-block;
          background: #f1f1f1;
          border-radius: 50%;
          color: #666;
          text-align: center;
          vertical-align: middle;
          font-size: 14px;
        }
      }
    }
  }
  .no-aricle {
    width: 100%;
    padding: 30px;
    border-radius: 5px;
    background: #ea6f5a;
    color: #fff;
    text-align: center;
    font-size: 25px;
    margin: 20px 0;
  }
}

@media (max-width: 575px) {
  .article.layout-content {
    .main {
      padding: 10px;
    }
  }
}
</style>
