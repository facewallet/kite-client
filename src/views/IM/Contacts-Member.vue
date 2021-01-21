<template>
    <li class="display-flex" :class="{'active':user.username === im.currentContact}"
        @click="changeContact(user.username)">
        <el-row>
            <el-col :span="5">
                <el-badge :count="user.unread_msg_count">
                    <el-avatar shape="square" size="large">{{user.username}}</el-avatar>
<!--                    <div class="avatar-img">-->
<!--                        <img v-lazy="personalInfo.user.avatar"-->
<!--                             class="box-image"-->
<!--                             alt="" />-->
<!--                    </div>-->
                </el-badge>
            </el-col>
            <el-col :span="14" class="user-mes">
                <el-row>
                    <p class="conversation-nickname">{{user.username}}</p>
                </el-row>
                <el-row>
                    <p class="conversation-recentMsg">{{lastMsg.last_msg_text}}</p>
                </el-row>
            </el-col>
            <el-col :span="5" class="conversation-time">
                <p>{{lastMsg.last_msg_time_text}}</p>
            </el-col>
        </el-row>
    </li>
</template>

<script>
    import {types} from "../../utils/im/mutation-types";
    import { mapState } from 'vuex'

    export default {
        name: "Contacts-Member",
        props: {
            user: {
                type: Object,
                default: {
                    username: "error",
                    unread_msg_count: 0
                }
            }
        },
        computed: {
          ...mapState(['personalInfo',"home", "im", "website"]),
            lastMsg() {
              return this.$store.getters['im/getLastMsg'](this.user.username);
                // return this.$store.getters.im.getLastMsg(this.user.username);
                // return im.getters.getLastMsg(this.user.username);
            }
        },

        methods: {
            changeContact(user) {
                this.user.unread_msg_count = 0;
                // console.log('unread_msg_count3:',this.$store.state.currentContact)
                this.$store.commit('im/'+types.SET_CURRENT_CONTACT, user)
            }
          //   ,
          // lastMsg() {
          //   return this.$store.im.getters.getLastMsg(this.user.username);
          //   // return im.getters.getLastMsg(this.user.username);
          // }
        }
    }
</script>

<style scoped lang="scss">

    .conversation-list {
    .display-flex {
        padding: 15px 0 10px 20px;
        cursor: pointer;

    .user-mes {
    .conversation-nickname {
        line-height: 22px;
        margin-bottom: 2px;
        font-size: 14px;
        color: #2c2c2c;
        white-space: nowrap;
    }

    .conversation-recentMsg {
        font-size: 12px;
        color: #999;
        line-height: 18px;
    }
    }

    .conversation-time {
        font-size: 12px;
        color: #C8C8C8;
        padding: 5px 0 0 5px;
    }
    }

    .active {
        /*background: #ec7259;*/
        /*color: #c2c2c2;*/
        /*color: rgba(0,0,0,0.88);*/
        background: #E7EDF1;
    }
    }
    /*.avatar-img {*/
    /*    display: inline-block;*/
    /*    position: relative;*/
    /*    width: 36px;*/
    /*    height: 36px;*/
    /*    border-radius: 72px;*/
    /*.box-image {*/
    /*    width: 36px;*/
    /*    height: 36px;*/
    /*    border-radius: 4px;*/
    /*    overflow: hidden;*/
    /*img {*/
    /*    width: 100%;*/
    /*    height: 100%;*/
    /*    border-radius: 80px;*/
    /*}*/
    /*}*/
    /*}*/
</style>
