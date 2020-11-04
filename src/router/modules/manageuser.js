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
        title: '创建帐户'
      }
    },
    {
      path: 'userdetail/:userName',
      component: () => import('@/views/usermanagement/userDetail'),
      name: 'UserDetail',
      props: true,
      hidden: true,
      meta: {
        title: '帐户信息'
      }
    },
    {
      path: 'subuserlist',
      component: () => import('@/views/usermanagement/userlist/subuserlist'),
      name: 'SubUserList',
      meta: {
        title: '下属列表',
        roles: ['plat-manager', 'platmer-manager'],
        refresh: true
      }
    }
  ]
}

export default manageUserRouter
