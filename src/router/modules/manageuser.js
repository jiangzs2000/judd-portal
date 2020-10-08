/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageUserRouter = {
  // 用户管理
  path: '/usermanagment',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  name: 'UserManagment',
  meta: {
    title: '员工管理',
    icon: 'peoples',
    roles: ['plat-admin', 'plat-manager', 'platmer-admin', 'platmer-manager'] // you can set roles in root nav
  },
  children: [
    {
      path: 'createuser',
      component: () => import('@/views/usermanagement/createUser'),
      name: 'CreateUser',
      meta: {
        title: '创建账户'
      }
    },
    {
      path: 'userdetail/:userName',
      component: () => import('@/views/usermanagement/userDetail'),
      name: 'UserDetail',
      props: true,
      hidden: true,
      meta: {
        title: '账户信息'
      }
    },
    {
      path: 'subuserlist',
      component: () => import('@/views/usermanagement/subuserlist'),
      name: 'SubUserList',
      meta: {
        title: '下属列表',
        roles: ['plat-manager', 'platmer-manager']
      }
    }
  ]
}

export default manageUserRouter
