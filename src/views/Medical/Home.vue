<template>
  <div class="books">
    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-12 col-md-12">

<!--          <div class="books-menu client-card">-->

<!--            <nav class="column-menu">-->
<!--              <ul class="nav-item-view">-->
<!--                <li class="nav-item"-->
<!--                    v-for="column_item in region.regionAll"-->
<!--                    :key="column_item.code">-->
<!--                  <router-link :to="{name:'medicalHome',params:{column:column_item.code}}">-->
<!--                    {{column_item.name}}-->
<!--                  </router-link>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </nav>-->
<!--          </div>-->

          <div class="books-list">
            <div class="row">

              <div class="col-xs-4 col-sm-4 col-md-4"
                   v-for="(medicalItem,key) in medical.medicalList.list"
                   :key="key">
                <div class="library-item clearfix">
                  <div class="library-item__thumb">
                    <router-link :to="{name:'medicalPage',params:{id:medicalItem.id}}">
                      <div class="image"
                           :style="`background-image: url(${medicalItem.coverImg})`"
                           v-lazy="medicalItem.coverImg"></div>
                    </router-link>
                  </div>
                  <div class="library-item__body">

                    <router-link class="library-item__title"
                                 :to="{name:'medicalPage',params:{id:medicalItem.id}}">
                      {{medicalItem.title}}
                      <span class="free"
                            :class="Number(medicalItem.isFree?medicalItem.isFree:1)===isFree2.free?'yes':'no'">{{isFree2Text[medicalItem.isFree?medicalItem.isFree:1]}}</span>
                    </router-link>

                    <div class="library-item__info">
                      <span><i class="el-icon-view"></i> {{medicalItem.readCount||0}}
                      </span><span style="margin-left: 8px;">
                        <i class="el-icon-notebook-2"></i> {{medicalItem.bookCount||0}}
                      </span>
<!--                      <span class="attention"-->
<!--                            v-if="~[statusList.reviewSuccess,statusList.freeReview].indexOf(medicalItem.status)&&personalInfo.islogin"-->
<!--                            @click="collectBooks(medicalItem.booksId)"-->
<!--                            :class="{'active':isCollect(medicalItem).status}">{{isCollect(medicalItem).text}}</span>-->
                    </div>
                    <div class="library-item-tag">
                      <template v-if="medicalItem.tag">
                        <router-link v-for="(itemArticleTag,key) in medicalItem.tag"
                                     class="tag-class frontend"
                                     :key="key"
                                     :to="{name:'article_tag',params:{en_name:itemArticleTag.en_name}}">{{itemArticleTag.name}}</router-link>
                      </template>
                      <template v-else>
                        <span class="hint">
                          易学习，让学习变得很容易
                        </span>
                      </template>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Page :total="Number(medical.medicalList.total)"
                  :pageSize="Number(medical.medicalList.pageSize)"
                  :page="Number($route.query.page)||1"
                  @pageChange="pageChange"></Page>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { share, baidu, google } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
import websiteNotice from '../Parts/websiteNotice'
import googleMixin from '@mixins/google'
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText,
  payTypeText,
  isFree2,
  isFree2Text,
  modelName
} from '@utils/constant'


export default {
  name: "books",
  mixins: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: `仲景在线-${this.website.meta.website_name}`,
      meta: [
        {
          // set meta
          name: "description",
          content: `仲景在线-${this.website.meta.website_name}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  asyncData ({ store, route }) {
    console.log('仲景在线页面---服务器端渲染')

    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("region/GET_ALL_REGION"),
      store.dispatch('medical/GET_MEDICAL_LIST', {
        page: route.query.page || 1,
        column: route.params.column || '',
        tagId: route.query.tagId || '',
        sort: route.query.sort || '',
      })
    ]);
  },
  data () {
    return {
      childNavItem: '',
      isFree2,
      isFree2Text,
      modelName,
      statusList,
      statusListText,
    };
  },
  created () {
    this.initColumn()
  },
  watch: {
    $route (to, from) {
      this.initColumn()
    }
  },
  methods: {
    initColumn () {
      if (this.$route.params.column && this.$route.params.column !== 'all') {
        this.switchColumn(this.$route.params.column)
      } else {
        this.childNavItem = {}
      }
    },

    createBook () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
      } else {
        this.$router.push({ name: 'booksWrite', params: { type: 'create' } })
      }
    },
    switchColumn (val) {
      this.region.regionAll.map(item => {
        if (item.code === val) {
          this.childNavItem = item || {}
        }
      })
    },
    sortMenu (sort) {
      let query = {
      }
      if (sort) {
        query.sort = sort
      }
      if (this.$route.query.tagId) {
        query.tagId = this.$route.query.tagId
      }
      return query
    },

    pageChange (val) {
      let query = {
        page: val
      }
      this.$router.push({
        name: 'medicalHome',
        params: { column: this.$route.params.column },
        query
      })
    }
  },
  computed: {
    ...mapState(['website','medical', 'region', 'personalInfo'])
  },
  components: {
    websiteNotice,
    Page
  }
};
</script>

<style scoped lang="scss">
.books {
  .books-menu {
    padding: 20px;
    margin-bottom: 10px;
    .column-menu {
      .nav-item-view {
        .nav-item {
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 8px;
          a {
            display: block;
            border: 1px solid #fff;
            padding: 2px 10px;
            font-size: 14px;
            &.current-active {
              color: #fd763a;
              font-weight: bold;
              border-bottom: 1px solid #fd763a;
            }
          }
        }
      }
    }

    .menu-main {
      border-top: 1px solid rgba(178, 186, 194, 0.15);
      padding: 15px 0 0;
      border-radius: 3px;
      margin-top: 15px;
      .column-tag-menu {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
        .nav-item-view {
          .nav-item {
            display: inline-block;
            margin-right: 10px;
            margin-bottom: 8px;
            a {
              display: block;
              border: 1px solid #e0e0e0;
              padding: 2px 10px;
              font-size: 14px;
              border-radius: 20px;
            }
            &.active {
              a {
                background: #fd763a;
                color: #fff;
                border: 1px solid #fd763a;
              }
            }
          }
        }
      }

      .sort-list-menu {
        display: block;
        padding-bottom: 15px;
        .nav-item {
          align-items: center;
          line-height: 1;
          position: relative;
          display: inline-block;
          font-size: 13px;
          margin-right: 15px;
          &.exact-active {
            color: #ea6f5a;
          }
        }
        .add-book {
          float: right;
          color: rgba(255, 255, 255, 0.88);
          background: #ea6f5a;
          border: 1px solid #ea6f5a;
          cursor: pointer;
          padding: 5px 12px;
          border-radius: 3px;
        }
      }
    }
  }

  .library-item {
    margin-bottom: 10px;
    padding: 16px;
    background: #fff;
    transition: all 0.3s ease;
    border-radius: 2px;
    box-sizing: border-box;
    .library-item__thumb {
      float: left;
      width: 88px;
      margin-right: 8px;
      .image {
        position: relative;
        height: 120px;
        border: 1px solid #f1f1f1;
        border-radius: 4px;
        width: 120px;
        max-width: 100%;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: zoom-in;
      }
    }
    .library-item__body {
      .library-item__title {
        height: 48px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 22px;
        font-weight: 700;
        word-break: break-all;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        .free {
          font-size: 12px;
          background: #fd763a;
          border-radius: 3px;
          line-height: 18px;
          color: #fff;
          padding: 1px 3px;
          display: inline-block;
          &.yes {
            background: #41b883;
          }
        }
      }
      .library-item-tag {
        height: 50px;
        .title {
          display: inline-block;
          font-size: 12px;
        }
        a {
          display: inline-block;
          border: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666;
          border-radius: 3px;
          line-height: 15px;
          padding: 2px 5px;
          margin-right: 5px;
        }
        .hint {
          font-size: 12px;
          color: #999;
        }
      }
      .library-item__info {
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.56);
      }
      .attention {
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        margin-left: 3px;
        color: #333;
        border-radius: 3px;
        border: 1px solid #e0e0e0;
        line-height: 12px;
        padding: 2px 3px;
        &.active {
          color: #fff;
          background: #41b883;
          border: 1px solid #41b883;
        }
      }
    }
  }
}
</style>
