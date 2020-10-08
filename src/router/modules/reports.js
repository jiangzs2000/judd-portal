/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const reportsRouter = {
  path: '/reports',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '报表中心',
    icon: 'el-icon-s-marketing',
    roles: ['plat-manager', 'platmer-manager']
  },
  children: [
    {
      path: 'fundinorderstat',
      component: () => import('@/views/reports/fundinorderstat'),
      meta: { title: '收款报表' }
    },
    {
      path: 'paymenttracestat',
      component: () => import('@/views/reports/paymenttracestat'),
      meta: { title: '支付报表' }
    },
    {
      path: 'refundorderstat',
      component: () => import('@/views/reports/refundorderstat'),
      meta: { title: '退款报表' }
    },
    {
      path: 'withdraworderstat',
      component: () => import('@/views/reports/withdraworderstat'),
      meta: { title: '提现报表' }
    }
  ]
}

export default reportsRouter
