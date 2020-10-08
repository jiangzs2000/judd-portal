/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const ordersRouter = {
  path: '/orders',
  component: Layout,
  redirect: '/orders/orderlist/fundinorderlist',
  alwaysShow: true, // will always show the root menu
  name: 'Orders',
  meta: {
    title: '交易管理',
    icon: 'el-icon-s-order'
  },
  children: [
    {
      path: 'orderlist',
      component: () => import('@/views/orders/orderlist/index'), // Parent router-view
      name: 'OrderList',
      meta: { title: '商户交易',
        roles: ['plat-manager', 'platmer-manager', 'plat-salesman', 'platmer-salesman'] // you can set roles in root nav
      },
      redirect: '/orders/orderlist/fundinorderlist',
      children: [
        {
          path: 'fundinorderlist',
          component: () => import('@/views/orders/orderlist/fundinorderlist'),
          name: 'FundInOrderList',
          meta: {
            title: '收款交易',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'paymenttracelist',
          component: () => import('@/views/orders/orderlist/paymenttracelist'),
          name: 'PaymentTraceList',
          meta: {
            title: '支付交易',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'refundorderlist',
          component: () => import('@/views/orders/orderlist/refundorderlist'),
          name: 'RefundOrderList',
          // redirect: '/nested/menu1/menu1-2/menu1-2-1',
          meta: {
            title: '退款交易',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'withdraworderlist',
          component: () => import('@/views/orders/orderlist/withdraworderlist'),
          name: 'WithdrawOrderList',
          props: true,
          meta: {
            title: '提现交易',
            refresh: true // 需要刷新
          }
        }
      ]
    },
    {
      path: 'details',
      component: () => import('@/views/orders/details/index'), // Parent router-view
      name: 'Details',
      meta: { title: '交易详情',
        roles: ['plat-manager', 'platmer-manager', 'plat-salesman', 'platmer-salesman'] // you can set roles in root nav
      },
      hidden: true,
      redirect: '/orders/orderlist/fundinorderlist',
      children: [
        {
          path: 'fundinorderdetail/:orderNo',
          component: () => import('@/views/orders/details/fundinorderdetail'),
          hidden: true,
          name: 'FundInOrderDetail',
          props: true,
          meta: { title: '收款详情' }
        },
        {
          path: 'refundorderdetail/:orderNo',
          component: () => import('@/views/orders/details/refundorderdetail'),
          hidden: true,
          name: 'RefundOrderDetail',
          props: true,
          meta: { title: '退款详情' }
        },
        {
          path: 'paymenttracedetail/:trace',
          component: () => import('@/views/orders/details/paymenttracedetail'),
          hidden: true,
          name: 'PaymentTraceDetail',
          props: true,
          meta: { title: '支付详情' }
        },
        {
          path: 'withdraworderdetail/:orderNo',
          component: () => import('@/views/orders/details/withdraworderdetail'),
          hidden: true,
          name: 'WithdrawOrderDetail',
          props: true,
          meta: { title: '提现详情' }
        }
      ]
    },
    {
      path: 'orderstat',
      component: () => import('@/views/orders/orderstat/index'),
      name: 'OrderStat',
      redirect: '/orders/orderstats/index',
      meta: {
        title: '交易报表',
        roles: ['plat-manager', 'platmer-manager', 'plat-salesman', 'platmer-salesman'] // you can set roles in root nav
      },
      children: [
        {
          path: 'fundinorderstat',
          component: () => import('@/views/orders/orderstat/fundinorderstat'),
          name: 'FundinOrderStat',
          meta: { title: '收款报表' }
        },
        {
          path: 'paymenttracestat',
          component: () => import('@/views/orders/orderstat/paymenttracestat'),
          name: 'PaymentTraceStat',
          meta: { title: '支付报表' }
        },
        {
          path: 'refundorderstat',
          component: () => import('@/views/orders/orderstat/refundorderstat'),
          name: 'RefundOrderStat',
          meta: { title: '退款报表' }
        },
        {
          path: 'withdraworderstat',
          component: () => import('@/views/orders/orderstat/withdraworderstat'),
          name: 'WithdrawOrderStat',
          meta: { title: '提现报表' }
        }
      ]
    }
  ]
}

export default ordersRouter
