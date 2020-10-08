/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const accountRouter = {
  path: '/account',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  name: 'Account',
  meta: {
    title: '账户管理',
    icon: 'el-icon-s-finance',
    roles: ['plat-manager', 'platmer-manager', 'plat-admin', 'platmer-admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'myaccount',
      component: () => import('@/views/account/myaccount'),
      name: 'MyAccount',
      meta: {
        title: '账户查询',
        roles: ['plat-manager', 'platmer-manager']
      }
    },
    {
      path: 'withdraworderlist',
      component: () => import('@/views/account/withdraworderlist'),
      meta: {
        title: '提现查询',
        roles: ['plat-manager', 'platmer-manager']
      }
    },
    {
      path: 'paywithdrawsettings',
      component: () => import('@/views/account/paywithdrawsettings'),
      name: 'PayWithdrawSettings',
      meta: {
        title: '提现设置',
        roles: ['plat-manager', 'platmer-manager']
      }
    },
    {
      path: 'publickey',
      component: () => import('@/views/account/publickey'),
      name: 'PublicKey',
      meta: {
        title: '公钥证书'
      }
    }
  ]
}

export default accountRouter
