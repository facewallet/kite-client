<template>
    <div class="chart-window">
        <div class="chart-head">
            <span class="chart-username">{{im.currentContact}}</span>
<!--            $store.state.-->
        </div>
        <div class="chart-body">
            <div class="chat-panel-wrap" v-for="item in  this.$store.getters['im/getActiveMsgs']">
                <p class="chat-panel-time" v-if="item.time_show">{{item.time_show}}</p>
                <div class="chat-panel-me-msg chat-panel-msg" v-if="item.from_id === myName">
                    <el-avatar shape="square" size="large">{{item.from_id}}</el-avatar>
<!--                    <el-avatar class="float-right" shape="square" icon="ios-person" size="large"/>-->
                    <div class="chat-panel-message-img-wrap float-right" v-if="item.content.msg_type === 'image'">
                        <img :src="item.content.media_url" title="点击查看大图"/>
                    </div>
                    <div class="chat-panel-message-file-wrap float-right" v-if="item.content.msg_type === 'file'">
                        <div class="chat-panel-file-icon">
                            <div></div>
                            <p>{{ shortName(item.content.msg_body.fname) }}</p>
                        </div>
                        <div class="chat-panel-range">
                            <div>
                                <span class="float-left">{{ parseSize(item.content.msg_body.fsize) }}</span>
                                <span class="float-right chat-panel-download-file"
                                      @click="downLoadFile(item.content.media_url)">下载文件</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-panel-msgText-me float-right" v-if="item.content.msg_type === 'text'">
                        <p>{{ item.content.msg_body.text }}</p>
                    </div>
                    <div style="clear:right;"></div>
                </div>
                <div class="chat-panel-other-msg chat-panel-msg" v-if="item.from_id !== myName">
<!--                    <el-avatar class="float-left" shape="square" icon="ios-person" size="large"/>-->
                    <el-avatar shape="square" size="large">{{im.currentContact}}</el-avatar>

                    <div class="chat-panel-message-img-wrap float-left" v-if="item.content.msg_type === 'image'">
                        <img :src="item.content.media_url" title="点击查看大图"/>
                    </div>
                    <div class="chat-panel-message-file-wrap float-left" v-if="item.content.msg_type === 'file'">
                        <div class="chat-panel-file-icon">
                            <div></div>
                            <p>{{ shortName(item.content.msg_body.fname) }}</p>
                        </div>
                        <div class="chat-panel-range">
                            <div>
                                <span class="float-left">{{ parseSize(item.content.msg_body.fsize) }}</span>
                                <span class="float-right chat-panel-download-file"
                                      @click="downLoadFile(item.content.media_url)">下载文件</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-panel-msgText-other" v-if="item.content.msg_type === 'text'">
                        <p>{{ item.content.msg_body.text }}</p>
                    </div>
                    <div style="clear:left;"></div>
                </div>
            </div>
        </div>
        <div class="chart-message">
<!--            <el-row class="chart-send-file">-->
<!--                <el-col :span="2">-->
<!--                    <el-upload action="/" :before-upload="sendImage" accept="image/*" title="发送图片">-->
<!--                        <el-button icon="ios-cloud-upload-outline"></el-button>-->
<!--                    </el-upload>-->
<!--                </el-col>-->
<!--                <el-col :span="2">-->
<!--                    <el-upload action="/" :before-upload="sendDoc" title="发送文件">-->
<!--                        <el-button icon="ios-cloud-upload"></el-button>-->
<!--                    </el-upload>-->
<!--                </el-col>-->
<!--            </el-row>-->
            <el-row class="chart-send-text">
                <el-input type="textarea" v-model="textMsg"/>
                <el-button type="success" @click="sendTextMsg">发送</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {apiService} from "../../utils/im/chart-service";
    import {types} from "../../utils/im/mutation-types";
    // import * as download from 'downloadjs';
    import {FileUtil} from "../../utils/im/util";
    import { mapState } from 'vuex'
    // import store from '../../store/module/im'

    export default {
        data() {
            return {
                myName: this.$store.state.im.myName,
                textMsg: ""
            }
        },
        mounted() {
            this.$nextTick(function () {
                let div = document.getElementsByClassName('chart-body')[0];
                div.scrollTop = div.scrollHeight;
            })
        },
        updated() {
            this.$nextTick(function () {
                let div = document.getElementsByClassName('chart-body')[0];
                div.scrollTop = div.scrollHeight;
            })
        },
        methods: {
            async sendTextMsg() {
                let _msg = {
                    target_username: this.$store.state.im.currentContact,
                    content: this.textMsg,
                    need_receipt: true
                };

              // let res = await im.JIM.sendSingleMsg(_msg);
              // let res = await this.$store.state.im.JIM.sendSingleMsg(_msg);

              // let res = await apiService.sendSingleMsg(_msg);
              let res = await apiService.sendSingleMsg2(this.$store.state.im.JIM, _msg);
              // let res = {}
                this.$store.commit('im/'+types.ADD_MESSAGE, res);
                this.textMsg = "";
            },
            async sendImage(file) {
                let fd = new FormData();
                fd.append(file.name, file);
                let _msg = {
                    target_username: this.$store.state.currentContact,
                    image: fd,
                    need_receipt: true
                };
                let res = await apiService.sendSinglePic(_msg);
                console.log(res)
                this.$store.commit('im/'+types.ADD_MESSAGE, res);
                return false;
            },
            async sendDoc(file) {
                console.log(file)
                let fd = new FormData();
                fd.append(file.name, file);
                let _msg = {
                    target_username: this.$store.state.currentContact,
                    file: fd,
                    need_receipt: true
                };
                let res = await apiService.sendSingleFile(_msg);
                console.log(res)
                this.$store.commit('im/'+types.ADD_MESSAGE, res);
                return false;
            },
            shortName(name) {
                return FileUtil.shortName(name);
            },
            parseSize(size) {
                return FileUtil.parseSize(size);
            },
            downLoadFile(url) {
                // download(url);
            }
        },
        computed: {
        ...mapState(["home", "im", "website"]) // home:主页  article_column:文章的专栏
        }
    }
</script>

<style scoped lang="scss">
    .chart-window {
        height: 100%;

        .chart-head {
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background: #ffffff;
            position: fixed;
            width: 100%;

            .chart-username {
                font-size: 18px;
                line-height: 40px;
                cursor: pointer;
                min-width: 5px;
                height: 100%;
            }
        }

        .chart-body {
            padding: 0 20px;
            position: fixed;
            top: 104px;
            bottom: 165px;
            overflow: auto;
            /*width: 100% ;*/
            width: calc(100% - 500px);

            .float-left {
                float: left;
            }

            .float-right {
                float: right;
            }

            .chat-panel-wrap {
                display: block;

                .chat-panel-time {
                    text-align: center;
                    margin: 30px 0 20px 0;
                    height: 20px;
                    line-height: 20px;
                }

                .chat-panel-msg {
                    margin: 19px 0;

                    p {
                        line-height: 20px;
                        min-height: 18px;
                        word-wrap: break-word;
                        word-break: break-all;
                        max-width: 350px;
                    }

                    img {
                        max-width: 219px;
                        max-height: 300px;
                        /*cursor: -webkit-zoom-in;*/
                        cursor: zoom-in;
                        border-radius: 5px;
                        display: block;
                    }
                }

                .chat-panel-me-msg {
                    text-align: right;
                    line-height: 40px;

                    .ivu-avatar {
                        margin-left: 12px;
                    }

                    .chat-panel-msgText-me {
                        background: #71E1DB;
                        border: 1px solid #67D6D0;
                        border-radius: 5px 0 5px 5px;
                        font-size: 14px;
                        color: #0B1816;
                        padding: 9px 11px;
                        text-align: left;
                    }
                }

                .chat-panel-other-msg {
                    text-align: left;
                    line-height: 40px;

                    .ivu-avatar {
                        margin-right: 12px;
                    }

                    .chat-panel-msgText-other {
                        padding: 9px 11px;
                        background: #F2F6FB;
                        border: 1px solid #E2E9F0;
                        border-radius: 0 5px 5px 5px;
                        font-size: 14px;
                        color: #0B1816;
                        text-align: left;
                        display: inline-block;
                    }
                }

                .chat-panel-message-file-wrap {
                    width: 236px;
                    height: 110px;
                    background: #F2F6FB;
                    border: 1px solid #E2E9F0;
                    border-radius: 0 5px 5px 5px;

                    .chat-panel-file-icon {
                        padding: 18px 18px 14px 18px;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        display: flex;

                        div {
                            width: 50px;
                            height: 50px;
                            margin-right: 18px;
                            background: url(https://o8ci6tgz8.qnssl.com/web-jchat/1.1.5/assets/images/file-other.8ec63947.svg) center center no-repeat;
                            background-size: 50px;
                            display: block;
                        }

                        p {
                            line-height: 25px;
                            text-align: left;
                            font-size: 18px;
                            color: #5A5A5A;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            word-break: break-all;
                            word-break: break-word;
                        }
                    }

                    .chat-panel-range {
                        width: 100%;
                        height: 28px;
                        position: relative;
                        border-radius: 0 0 5px 5px;
                        overflow: hidden;
                        border-top: 1px solid #DCDCDC;

                        div {
                            width: 100%;
                            height: 27px;
                            margin-top: 1px;
                            line-height: 27px;
                            font-size: 12px;
                            color: #989898;
                            padding: 0 7px;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;

                            .chat-panel-download-file {
                                cursor: pointer;
                                color: #2DD0CF;
                            }
                        }
                    }
                }
            }
        }

        .chart-message {
            position: fixed;
            bottom: 0;
            width: calc(100% - 500px);
            display: block;
            height: 165px;

            .chart-send-file {
                height: 45px;
                padding: 6px;
            }

            .chart-send-text {
                textarea {
                    height: 90px;
                }

                button {
                    float: right;
                    right: 20px;
                }
            }
        }

    }
</style>
