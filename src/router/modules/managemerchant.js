/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const mgrMerchantRouter = {
  path: '/merchantmanagement',
  component: Layout,
  redirect: '/merchantmanagement/createmerchant/registerperson',
  alwaysShow: true, // will always show the root menu
  name: 'MerchantManagement',
  meta: {
    title: '商户管理',
    icon: 'el-icon-s-shop'
  },
  children: [
    {
      path: 'createmerchant',
      component: () => import('@/views/merchantmanagement/registermerchant/index'), // Parent router-view
      name: 'CreateMerchant',
      meta: { title: '进件商户',
        roles: ['plat-manager', 'platmer-manager', 'plat-salesman', 'platmer-salesman'] // you can set roles in root nav
      },
      redirect: '/merchantmanagement/createmerchant/registerperson',
      children: [
        {
          path: 'registerperson',
          component: () => import('@/views/merchantmanagement/registermerchant/registerperson'),
          name: 'RegisterPerson',
          props: true,
          meta: { title: '进件个人' }
        },
        {
          path: 'registerindividual',
          component: () => import('@/views/merchantmanagement/registermerchant/registerindividual'),
          name: 'RegisterIndividual',
          props: true,
          // redirect: '/nested/menu1/menu1-2/menu1-2-1',
          meta: { title: '进件个体' }
        },
        {
          path: 'registerindividualresult',
          component: () => import('@/views/merchantmanagement/registermerchant/registerindividual/result'),
          hidden: true,
          name: 'RegisterIndividualResult',
          props: true,
          meta: { title: '注册结果' }
        },
        {
          path: 'registercompany',
          component: () => import('@/views/merchantmanagement/registermerchant/registercompany'),
          name: 'RegisterCompany',
          props: true,
          meta: { title: '进件企业' }
        },
        {
          path: 'registercompanyresult',
          component: () => import('@/views/merchantmanagement/registermerchant/registercompany/result'),
          hidden: true,
          name: 'RegisterCompanyResult',
          props: true,
          meta: { title: '注册结果' }
        },
        {
          path: 'bindcard/:merchantNo/:channelCode/:merchantType/:idName/:mobileNo',
          component: () => import('@/views/merchantmanagement/registermerchant/bindcard'),
          hidden: true,
          name: 'BindCard',
          props: true,
          meta: { title: '商户绑卡' }
        },
        {
          path: 'bindcardconfirm',
          component: () => import('@/views/merchantmanagement/registermerchant/bindcardconfirm'),
          hidden: true,
          name: 'BindCardConfirm',
          props: { default: true, sidebar: true },
          meta: { title: '商户绑卡确认' }
        }
      ]
    },
    {
      path: 'managemerchant',
      component: () => import('@/views/merchantmanagement/managemerchant/index'),
      name: 'ManageMerchant',
      redirect: '/merchantmanagement/managemerchant/myCRAs',
      meta: {
        title: '管理商户',
        roles: ['plat-manager', 'platmer-manager', 'plat-salesman', 'platmer-salesman'] // you can set roles in root nav
      },
      children: [
        {
          path: 'myFRAs',
          component: () => import('@/views/merchantmanagement/managemerchant/myFRAs'),
          name: 'MyFRAs',
          meta: {
            title: '商户进件',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'mymerchants',
          component: () => import('@/views/merchantmanagement/managemerchant/mymerchants'),
          name: 'MyMerchants',
          meta: {
            title: '我的商户',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'mypaysalesagreement',
          component: () => import('@/views/merchantmanagement/managemerchant/mypaysalesagreement'),
          name: 'MyPaySalesAgreement',
          meta: {
            title: '商户协议',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'myCRAs',
          component: () => import('@/views/merchantmanagement/managemerchant/myCRAs'),
          name: 'MyCRAs',
          meta: {
            title: '渠道申请',
            refresh: true // 需要刷新
          }
        },
        {
          path: 'myFRAsreview',
          component: () => import('@/views/merchantmanagement/managemerchant/myFRAsreview'),
          name: 'MyFRAsReview',
          meta: {
            title: '进件审批',
            roles: ['plat-manager', 'platmer-manager'],
            refresh: true // 需要刷新
          }
        }
      ]
    },
    {
      path: 'details',
      component: () => import('@/views/merchantmanagement/details/index'),
      name: 'MerDetails',
      redirect: '/merchantmanagement/details/merchantdetail',
      hidden: true,
      meta: {
        title: '管理商户',
        roles: ['plat-manager', 'platmer-manager', 'plat-salesman', 'platmer-salesman'] // you can set roles in root nav
      },
      children: [
        {
          path: 'merchantdetail/:merchantNo',
          component: () => import('@/views/merchantmanagement/details/merchantdetail'),
          name: 'MerchantDetail',
          props: true,
          meta: { title: '商户详情' }
        }
      ]
    },
    {
      path: 'submeruserlist',
      component: () => import('@/views/usermanagement/userlist/submeruserlist'),
      name: 'SubMerUserList',
      hidden: true,
      props: true,
      meta: {
        title: '下级商户员工帐户',
        roles: ['plat-salesman', 'platmer-salesman'],
        refresh: true
      }
    },
    {
      path: 'createmeruser',
      component: () => import('@/views/usermanagement/createMerUser'),
      name: 'CreateMerUser',
      hidden: true,
      props: true,
      meta: {
        title: '创建帐户'
      }
    }
  ]
}

export default mgrMerchantRouter
