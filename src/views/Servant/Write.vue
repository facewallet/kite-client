<template>
  <client-only>
    <section class="books-write-lay layout-content">
      <div class="container client-card-shadow">
        <!-- this component will only be rendered on client-side -->

        <div class="row mrg-bm20 books-write-content ">
          <div class="col-xs-12 col-sm-4 col-md-3 box-form-group">
            <div class="cover-img">
              <div class="cover-img-view"
                   v-if="write.coverImg"
                   :style="`background-image: url(${write.coverImg})`"></div>
              <div class="cover-img-view cover-img-null"
                   v-else>
                <p>封面图片为空，如果未上传，将采用默认图片~</p>
              </div>
              <upload-image class="upload-cover-image"
                            @changeUpload="changeUploadCoverImg">上传封面</upload-image>
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-9 book-info">
            <div class="box-form-group books-name-view">
              <label class="box-label"
                     for="">标题</label>
              <input class="box-input title"
                     v-model="write.title"
                     type="text"
                     placeholder="请输入标题">
            </div>
            <div class="box-form-group">
              <label class="box-label"
                     for="">简介</label>
              <input class="box-input title"
                     v-model="write.description"
                     type="text"
                     placeholder="请输入简介"></input>
            </div>

            <div class="write mrg-bm20 box-form-group">
              <label class="box-label"
                     for="">详情</label>
              <mavon-editor v-model="write.content"
                            defaultOpen="edit"
                            :boxShadow="false"
                            :toolbars="toolbars"
                            ref="mavonEditor"
                            :imageFilter="imageFilter"
                            @imgAdd="$imgAdd" />

            </div>

            <div class="row mrg-bm20">
              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <label class="box-label"
                       for="">是否公开</label>
                <select class="box-select"
                        v-model="write.isPublic">
                  <option :value="key"
                          v-for="(item,key) in publicTypeList"
                          :key="key">{{item}}</option>
                </select>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <label class="box-label"
                       for="">省市</label>
                <select class="box-select"
                        v-model="write.region">
                  <option :value="item.code"
                          v-for="(item,key) in region.regionAll"
                          :key="key">{{item.name}}</option>
                </select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <label class="box-label"
                       for="">是否付费</label>
                <select class="box-select"
                        v-model="write.isFree">
                  <option :value="key"
                          v-for="(item,key) in isFree2Text"
                          :key="key">{{item}}</option>
                </select>
              </div>
            </div>

            <div class="row mrg-bm20"
                 v-if="Number(write.isFree||1)!==isFree2.free">
<!--              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">-->
<!--                <label class="box-label"-->
<!--                       for="">支付类型</label>-->
<!--                <select class="box-select"-->
<!--                        v-model="write.payType">-->
<!--                  <option :value="key"-->
<!--                          v-for="(item,key) in payTypeText"-->
<!--                          :key="key">{{item}}</option>-->
<!--                </select>-->
<!--              </div>-->
              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <label class="box-label"
                       for="">价格 ￥</label>
<!--                       for="">价格 ￥({{payTypeText[write.payType]}})</label>-->
                <input type="text"
                       class="box-input"
                       @keyup="isFloor"
                       v-model="write.price">
              </div>
            </div>

            <div class="row mrg-bm20">
              <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
                <a-upload :file-list="write.fileList" :remove="handleRemove" :before-upload="beforeUpload">
                  <a-button
                      type="primary"
                      style="margin-top: 16px"

                  > <a-icon type="upload" /> 上传附件 </a-button>
                </a-upload>
<!--                @click="handleUpload"-->
<!--                <label class="box-label"-->
<!--                       for="">添加附件</label>-->
<!--                <select class="box-select"-->
<!--                        v-model="write.isAttachment">-->
<!--                  <option :value="item"-->
<!--                          v-for="item in isOpen"-->
<!--                          :key="item">{{-->
<!--                    isOpenInfo[item]-->
<!--                  }}</option>-->
<!--                </select>-->
              </div>
            </div>

            <div class="write-footer clearfix">
              <button class="send-article"
                      @click="saveArticle">发布</button>
            </div>

          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
// Local Registration
import { UploadImage } from '@components'
import { mavonEditor } from '@components/MarkDown'
import { share, baidu, google } from '@utils'
import ClientOnly from 'vue-client-only'
import marked from "marked";
import { mapState } from 'vuex'
import googleMixin from '@mixins/google'
import Tinymce from "@components/Tinymce"
import {
  payTypeText,
  isFree2,
  isFree2Text
} from '@utils/constant'

export default {
  name: 'write',
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: "公务员编辑",
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("region/GET_ALL_REGION"),
      store.dispatch("PERSONAL_INFO", { accessToken }),
      // store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
      // store.dispatch("articleColumn/GET_ARTICLE_COLUMN_ALL")
    ]);
  },
  data () {
    return {
      uploading: false,

      content2: '默认值',
      write: {
        region: 'all',
        coverImg: '', // 教程封面图片
        title: '', // 教程的标题
        description: '', // 教程的简介
        content: '', // 教程的详情
        isPublic: 1, // 是否公开 1公开 0仅自己可见
        isFree: 1, // 免费还是付费
        payType: 1,// 支付类型
        price: 0, // 价格
        isRecommend:1,
        fileList: [],
      },
      payTypeText, // 支付类型
      isFree2, // 免费还是付费值
      isFree2Text, // 免费还是付费
      publicTypeList: ['仅自己可见', '公开'], // 教程类型列表
      searchArticleTag: "",
      currentArticleTagArr: [], // 用户选中的教程标签
      isSearchResultShow: false, // 搜索结果显示
      searchShowArticleTagAll: [], // 搜索栏内呈现的教程标题
      searchBoxWidth: "100%",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
      },
      editInfo: {} // 修改教程的信息
    }
  },
  created () {

    if (this.$route.params.type !== "create") {
      this.isEdit()
    }
    // 设置中文
    // Tinymce.init({
    //   language:'zh_CN'
    // })
  },
  watch: {
  },
  methods: {
    handleRemove(file) {
      if(this.write.fileList.length > 0){
        const index = this.write.fileList.indexOf(file);
        const newFileList = this.write.fileList.slice();
        newFileList.splice(index, 1);
        this.write.fileList = newFileList;
        //todo 这个地方后面调用，删除
      }

    },
    beforeUpload(file) {
      //todo 这个地方应该上传完后更新
      if(this.write.fileList.length > 0){
        this.write.fileList = [...this.write.fileList, file];
      }else {
        this.write.fileList = [file];
      }


      return false;
    },
    handleUpload() {
      const { fileList } = this.write;
      const formData = new FormData();
      fileList.forEach(file => {
        if(!file.id)  formData.append('files[]', file);
      });
      this.uploading = true;
      this.$store.dispatch('common/UPLOAD_FILE', formData)
          .then(result => {
            console.log("返回的上传：",result)
            if (result.meta.success === true) {
              // if (result.state === 'success') {
              // this.write.coverImg = result.data.url
              this.$message.success('上传成功')
            } else {
              this.$message.warning(result.meta.message)
            }
          })
    },
    isEdit () {
      const _this = this
      if (this.$route.params.type !== "create") {
        // 判断是不是创建，不是则是修改，同时赋值
        const id = this.$route.params.type
        this.$store
          .dispatch("servant/GET_SERVANT_INFO", {
            id: id
          })
          .then(result => {
            if (result.meta.success === true) {
              let list = result.data.info.fileList;
              result.data.info.fileList = [];
              this.write = result.data.info;
              this.write.isPublic = Number(result.data.info.isPublic)
              this.write.content = result.data.info.originContent;
              this.write.isFree= result.data.info.isFree;
              this.write.payType= result.data.info.payType;
              this.write.price= result.data.info.price;
              if(list && list.length > 0){
                for (let i = 0 ; i < list.length ; i++){
                  let file0 = {
                    id:list[i].id,
                    uid: list[i].id,
                    name: list[i].name,
                    url: list[i].host + list[i].url,
                  }
                  // console.log('四个军',file0)
                  _this.beforeUpload(file0)
                }
              }

              // this.editInfo = result.data.info
            }

          });
      }
    },
    isFloor () {
      var obj = event.target
      var t = obj.value.charAt(0)
      obj.value = obj.value
        .replace('.', '$#$') //把第一个字符'.'替换成'$#$'
        .replace(/\./g, '') //把其余的字符'.'替换为空
        .replace('$#$', '.') //把字符'$#$'替换回原来的'.'
        .replace(/[^\d.]/g, '') //只能输入数字和'.'
        .replace(/^\./g, '') //不能以'.'开头
        .replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1') //只保留2位小数
      if (t == '-') {
        obj.value = '-' + obj.value
      }
    },
    changeUploadCoverImg ({ formData, config }) { // 上传封面图片
      this.$store.dispatch('common/UPLOAD_FILE', formData)
        .then(result => {
          console.log("返回的上传：",result)
          if (result.meta.success === true) {
          // if (result.state === 'success') {
            this.write.coverImg = result.data.url
            this.$message.success('上传封面成功')
          } else {
            this.$message.warning(result.meta.message)
          }
        })
    },
    getObjectValues (object) {
      var values = [];
      for (var property in object) {
        values.push(object[property].columnId);
        // values.push(object[property].tag_id);
      }
      return values;
    },

    imageFilter (file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$message.success("上传教程图片应该小于1M");
        return false
      } else {
        return true
      }
    },
    $imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formData = new FormData();
      formData.append('file', $file);
      this.$store
        .dispatch("common/UPLOAD_FILE", formData)
        .then(res => {
          if (res.meta.success === true) {
            this.$message.success("上传教程图片成功");
            this.$refs.mavonEditor.$img2Url(pos, res.data.url);
          } else {
            this.$message.warning("上传教程图片失败");
            return false
          }
        });
    },
    saveArticle () {
      if (!this.write.title) {
        this.$message.warning('教程标题不能为空！');
        return false
      }
      if (!this.write.content) {
        this.$message.warning('教程内容不能为空！');
        return false
      }

      if (Number(this.write.isFree || 1) !== this.isFree2.free) {
        if (this.write.price < 1) {
          this.$message.warning('教程价格请大于1！');
          return false
        }
      }
      var params = {
        title: this.write.title, //教程的标题
        description: this.write.description, //教程的简介
        coverImg: this.write.coverImg,//教程的封面
        content: marked(this.write.content, { breaks: true }) /*主内容*/,
        originContent: this.write.content /*源内容*/,
        isPublic: this.write.isPublic,
        isFree: this.write.isFree, // 免费还是付费
        payType: this.write.payType,// 支付类型
        price: this.write.price // 价格
      };
      const { fileList } = this.write;
      const formData = new FormData();
      if(fileList && fileList.length > 0){
        fileList.forEach(file => {
          //这个地方太坑了，不能传数组
          // formData.append('files[]', file);
          if(!file.url) formData.append('files', file);
        });
      }

      formData.append('title',this.write.title);
      formData.append('description',this.write.description);
      formData.append('coverImg',this.write.coverImg);
      formData.append('content',marked(this.write.content, { breaks: true }));
      formData.append('originContent',this.write.content);
      formData.append('isPublic',this.write.isPublic);
      formData.append('isFree',this.write.isFree);
      formData.append('payType',this.write.payType);
      formData.append('price',this.write.price);
      formData.append('region',this.write.region);
      formData.append('isRecommend',this.write.isRecommend);
      // this.$route.params.type !== "create" &&
      //   (params.booksId = this.$route.query.books_id);
      if(this.$route.params.type !== "create"){
        formData.append('id',this.write.id);
      }
      let dispatch_url =
        this.$route.params.type === "create"
          ? "servant/CREATE_SERVANT"
          : "servant/UPDATE_SERVANT";
      // let moreConfig = {
      //   headers:{
      //     'Content-Type':'multipart/form-data',
      //     'processData':false,
      //   }
      //
      // }
      this.$store
        .dispatch(dispatch_url, formData)
        .then(res => {
          if (res.meta.success === true) {
            this.$message.success(res.meta.message);
            this.$router.push({
              name: "user",
              params: { uid: this.personalInfo.user.uid, routeType: "books" }
            });
          } else {
            this.$message.warning(res.meta.message);
          }
        })
        .catch(function (err) {
          this.$message.error("出现错误：" + err);
        });
    },
  },
  components: {
    'mavon-editor': mavonEditor,
    UploadImage,
    ClientOnly,
    Tinymce
  },
  computed: {
    articleTagAll () {
      return this.$store.state.articleColumn.homeColumn;
      // return this.$store.state.articleTag.article_tag_all;
    },
    ...mapState(['website', 'personalInfo','region','servant'])
  },
}
</script>

<style lang="scss" scoped>
  .Tinymce_box {
    display: flex;
  }
  .editor-content {
    margin-left: 30px;
    flex-grow: 1;
    border: 2px dashed #f1f1f1;
    padding:0 20px;
  }
  h3 {
    color: #808080;
  }

.books-write-lay {
  .client-card-shadow {
    padding: 20px;
    margin-bottom: 30px;
  }
  .books-write-content {
    .cover-img {
      .cover-img-view {
        position: relative;
        height: 180px;
        border: 1px solid #f1f1f1;
        border-radius: 4px;
        width: 160px;
        max-width: 100%;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: zoom-in;
        p {
          font-size: 14px;
          padding: 30px;
        }
      }
      .upload-cover-image {
        width: 160px;
        display: block;
        line-height: 30px;
        font-size: 12px;
        border: 1px solid #2daebf;
        color: #2daebf;
        text-align: center;
        font-weight: 500;
        letter-spacing: 2px;
        border-radius: 3px;
      }
    }
    .book-info {
      .box-label {
        display: block;
      }
      .box-input {
        font-size: 14px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        width: 100%;
      }
    }
  }
  .write {
    /deep/.markdown-panel {
      height: 500px;
      z-index: 249;
      &.fullscreen {
        z-index: 251;
      }
    }
  }

  .box-input,
  .box-select {
    border: 1px solid #e0e0e0;
    border-radius: 3px;
  }
  .box-select {
    height: 36px;
  }
  .box-input {
    height: 36px;
    padding: 0px 20px;
    width: 100%;
  }
  .tag-warp {
    margin-top: 5px;
    .common-title {
      span {
        margin-left: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #93999f;
        line-height: 22px;
      }
    }
    .search-box {
      width: 100%;
      height: 36px;
      padding-left: 12px;
      margin-right: 12px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      box-sizing: border-box;
      .search-input {
        width: 100%;
        height: 100%;
        float: left;
        font-size: 14px;
        border-radius: 6px;
        border: 0;
      }
    }
    .js-chosen-tags {
      float: left;
      height: 100%;
      .tag-item {
        margin-top: 5px;
      }
    }
    .tag-item {
      display: block;
      float: left;
      margin: 8px 8px 0 0;
      padding: 4px 12px;
      font-size: 12px;
      color: #545c63;
      line-height: 16px;
      background: rgba(84, 92, 99, 0.1);
      border-radius: 12px;
      cursor: pointer;
    }
    .search-result {
      margin: 24px 0 -16px;
      font-size: 12px;
      color: #9199a1;
      line-height: 18px;
      .js-search-text {
        color: #00bb29;
      }
      .js-search-num {
        color: #00bb29;
      }
    }
    .common-error-tip {
      margin-top: 2px;
      font-size: 12px;
      color: #f53d3d;
      line-height: 18px;
    }
    .tag-list-view {
      width: 100%;
      margin-top: 16px;
      height: auto !important;
      max-height: 300px;
      overflow-y: auto;
    }
  }

  .write-footer {
    margin: 20px 0;
    .send-article {
      padding: 5px 15px;
      background: #256ef8;
      border: none;
      color: #fff;
      border-radius: 5px;
      font-style: 16px;
    }
  }
}
</style>



