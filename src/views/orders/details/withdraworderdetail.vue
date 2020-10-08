<template>
  <div class="app-container">
    <div class="header">
      <p>订单详情</p>
    </div>
    <div>
      <div>
        <ul>
          <li><span class="field-name">平台订单号： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.orderNo }}</span></li>
          <li><span class="field-name">商户订单号： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.merOrderNo }}</span></li>
          <li><span class="field-name">发起商户号：</span><span class="field-value">{{ orderDetail==null?'':orderDetail.merNo }}</span></li>
          <li><span class="field-name">退款日期： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.merOrderNo }}</span></li>
          <li><span class="field-name">下单时间： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.createTime | FormatDate('yyyy-MM-dd HH:mm:ss') }}</span></li>
          <li><span class="field-name">提现金额（元）： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.amount | F2Y() }}</span></li>
          <li><span class="field-name">订单状态： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.state }}</span></li>
          <li><span class="field-name">平台费用（元）： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.platFeeAmt | F2Y() }}</span></li>
          <li><span class="field-name">渠道费用（元）： </span><span class="field-value">{{ orderDetail==null?'':orderDetail.channelFeeAmt | F2Y() }}</span></li>
        </ul>
      </div>
      <el-button type="primary" style="margin-left:35%" @click="onClick">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getWithidrawOrderDetail } from '@/api/orders'
export default {
  name: 'RefundOrderDetail',
  props: {
    orderNo: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      orderDetail: null
    }
  },
  created() {
    getWithidrawOrderDetail(this.orderNo).then(res => {
      if (res.code === '0000') {
        this.orderDetail = res.data
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    onClick() {
      // 调用全局挂载的方法
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'FundInOrderList') {
      to.meta.refresh = false
    }
    this.$destroy()
    next()
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  widows: 100%;
  ::v-deep ul li {
    list-style: none;
    margin: 15px;
  }
  ::v-deep .field-name {
    display: inline-block;
    width: 16%;
    text-align: right;
  }
  ::v-deep .field-value {
    width: 50%;
    display: inline-block;
    padding: 5px 10px 5px 5px;
    border: 1px solid rgb(216, 215, 215);
    border-radius: 5px;
  }
  ::v-deep .dividing-block {
    margin-top: -35px;
    margin-left: 10%;
  }
  ::v-deep .dividing-name {
    display: inline-block;
    width: 12%;
    text-align: right;
  }
  ::v-deep .dividing-value {
    width: 48.8%;
    display: inline-block;
    padding: 5px 10px 5px 5px;
    border: 1px solid rgb(216, 215, 215);
    border-radius: 5px;
  }
  ::v-deep .close {
    font-family: Arial;
    margin: 5px;
  }
  ::v-deep .close:LINK, .close:VISITED, .close:HOVER {
    color:white;
    padding:4px 10px 4px 10px;
    background-color:blue;
    text-decoration: none;
    border-radius: 5px;
    margin-left: 35%;
  }
}
</style>
