export default [
  {
    path: '/',
    component: require('@views/Main').default, // main
    children: [
      {
        path: '',
        name: 'home',
        component: require('@views/Home/Home').default // 主页
      },
      {
        path: '/column/:en_name',
        name: 'column',
        component: require('@views/Home/Column').default // 主页
      },
      {
        path: 'p/:aid',
        name: 'article',
        component: require('@views/Article/Article').default // 文章内容页
      },
      {
        path: 'user-attention',
        name: 'AttentionMessage',
        component: () => import('@views/AttentionMessage') // 关注
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@views/Search/view/Search') // 搜索页
      },
      {
        path: 'im',
        name: 'im',
        component: () => import('@views/IM/IM') // 搜索页
      },
      {
        path: 'user/:uid/:routeType',
        name: 'user',
        component: () => import('@views/User/User') // 用户内页
      },
      {
        path: 'personal/shell-detail',
        name: 'shellDetail',
        component: () => import('@views/User/view/ShellDetail') // 消费明细
      },
      {
        path: 'personal/experience-detail',
        name: 'experienceDetail',
        component: () => import('@views/User/view/Experience') // 经验明细
      },
      {
        path: 'personal/my-order',
        name: 'myOrder',
        component: () => import('@views/User/view/Order') // 我的订单
      },
      {
        path: 'personal/collect',
        name: 'collect',
        component: () => import('@views/User/view/Collect') // 收藏
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@views/Setting/Setting'), // 文章内容页
        children: [
          {
            path: 'profile',
            name: 'settingProfile',
            component: () => import('@views/Setting/view/Profile') // 修改资料
          },
          {
            path: 'reset-password',
            name: 'settingResetPassword',
            component: () => import('@views/Setting/view/ResetPassword') // 重置密码
          },
          {
            path: 'third-party',
            name: 'ThirdParty',
            component: () => import('@views/Setting/view/ThirdParty') // 重置密码
          }
        ],
        redirect: { name: 'settingProfile' }
      },
      {
        path: 'column-all',
        name: 'columnAll',
        component: () => import('@views/ArticleColumn/ArticleColumn') // 文章专栏
      },
      {
        path: 'subscribe/:type',
        name: 'subscribe_tag',
        component: () => import('@views/ArticleTag/SubscribeTag') // 文章标签订阅页
      },
      {
        path: 'tag/:en_name',
        name: 'article_tag',
        component: require('@views/ArticleTag/ArticleTag').default // 文章标签内容页
      },
      {
        path: 'comment-rule',
        name: 'commentRule',
        component: () => import('@views/Rule/CommentRule') // 评论规则
      },
      {
        path: 'write/:type',
        name: 'Write',
        component: () => import('@views/Write/Write') // 文章编写
      },
      {
        //动态 2019.8.1 12:11开发
        path: 'dynamics/:dynamicTopicId',
        name: 'dynamics',
        component: () => import('@views/Dynamic/index') // 动态首页
      },
      {
        path: 'dynamic/:dynamicId',
        name: 'dynamicView',
        component: () => import('@views/Dynamic/dynamicView') // 动态内容页
      },
      {
        path: 'dynamic-topics',
        name: 'dynamicTopic',
        component: () => import('@views/Dynamic/dynamicTopic') // 动态专题
      },
      {
        path: 'topic/:dynamicTopicId',
        name: 'dynamicTopicView',
        component: () => import('@views/Dynamic/dynamicTopicView') // 动态专题内容页
      },
      {
        path: 'blog/:blogId',
        name: 'articleBlog',
        component: () => import('@views/ArticleBlog/BlogView') // 个人专栏内容
      },
      {
        path: 'books-write/:type',
        name: 'booksWrite',
        component: () => import('@views/Books/WriteBooks') // 小书创建修改
      },
      {
        path: 'books/:columnEnName',
        name: 'books',
        component: () => import('@views/Books/Books') // 小书首页
      },
      {
        path: 'graduate/:column',
        name: 'graduateHome',
        component: () => import('@views/Graduate/Home') // 考研首页
      },
      {
        path: 'grad/:type',
        name: 'graduateWrite',
        component: () => import('@views/Graduate/Write') // 考研创建，修改
      },
      {
        path: 'g/:id',
        name: 'graduatePage',
        component: require('@views/Graduate/Page').default // 考研详情页
      },
      {
        path: 'servant/:column',
        name: 'servantHome',
        component: () => import('@views/Servant/Home') // 考研首页
      },
      {
        path: 'vant/:type',
        name: 'servantWrite',
        component: () => import('@views/Servant/Write') // 考研创建，修改
      },
      {
        path: 's/:id',
        name: 'servantPage',
        component: require('@views/Servant/Page').default // 考研详情页
      },
      {
        path: 'medical/:column',
        name: 'medicalHome',
        component: () => import('@views/Medical/Home') // 考研首页
      },
      {
        path: 'medi/:type',
        name: 'medicalWrite',
        component: () => import('@views/Medical/Write') // 考研创建，修改
      },
      {
        path: 'm/:id',
        name: 'medicalPage',
        component: require('@views/Medical/Page').default // 考研详情页
      },

      {
        path: 'book/:books_id',
        name: 'book',
        component: require('@views/Book/Book').default // 小书内容
      },
      {
        path: 'private-chat',
        name: 'privateChat',
        component: require('@views/User/Chat/PrivateChat').default // 私聊
      },
      {
        path: 'private-chat-list',
        name: 'privateChatList',
        component: require('@views/User/Chat/PrivateChatList').default // 私聊列表
        // component: require('@views/User/Chat/PrivateChatList').default // 私聊列表
      },
      {
        path: 'oauth2/:type/callback',
        name: 'thirdLogin',
        component: () => import('@views/Sign/ThirdLogin') // 登录
      },
      {
        path: '*',
        name: '404',
        component: require('@views/404/404').default // 私聊列表
      }
    ]
  },
  {
    path: '/book/:books_id/section/:book_id',
    name: 'BookView',
    component: () => import('@views/BookView/BookView') // 查看小书内容
  },
  {
    path: '/book/:books_id/write/:book_id',
    name: 'WriteBookView',
    component: () => import('@views/BookView/WriteBookView') // 编辑小书内容
  },
  {
    path: '/sign/in',
    name: 'signIn',
    component: () => import('@views/Sign/SignIn') // 登录
  },
  {
    path: '/sign/up',
    name: 'signUp',
    component: () => import('@views/Sign/SignUp') // 注册
  },
  {
    path: '/sign/reset-password',
    name: 'resetPassword',
    component: () => import('@views/Sign/ResetPassword') // 找回密码
  },
  {
    path: '/oauth/github',
    name: 'oauthGithb',
    component: () => import('@views/Oauth/github') // github
  }
]
