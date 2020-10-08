<template>
  <div class="app-container">
    <div class="header">
      <p>支付流水</p>
    </div>
    <div>
      <div class="payment-info">
        <ul>
          <li><span class="field-name">平台流水号： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.trace }}</span></li>
          <li><span class="field-name">商户流水号：</span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.merTrace }}</span></li>
          <li><span class="field-name">支付渠道：</span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.routingChannel }}</span></li>
          <li><span class="field-name">金额（元）： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.amount | F2Y() }}</span></li>
          <li><span class="field-name">支付状态： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.state }}</span></li>
          <li><span class="field-name">结算金额（元）： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.settleAmt | F2Y() }}</span></li>
          <li><span class="field-name">支付方式： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.payWay }}</span></li>
          <li><span class="field-name">退款状态： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.refundState }}</span></li>
          <li><span class="field-name">已退金额： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.payment.refundedAmt }}</span></li>
        </ul>
      </div>
      <p>订单详情</p>
      <div>
        <ul>
          <li><span class="field-name">平台订单号： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.orderNo }}</span></li>
          <li><span class="field-name">商户订单号： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.merOrderNo }}</span></li>
          <li><span class="field-name">发起商户号：</span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.merNo }}</span></li>
          <li><span class="field-name">下单时间： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.createTime | FormatDate('yyyy-MM-dd HH:mm:ss') }}</span></li>
          <li><span class="field-name">金额（元）： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.amount | F2Y() }}</span></li>
          <li><span class="field-name">分账记录： </span>
            <div v-if="traceDetail!=null" class="dividing-block">
              <ul v-for="cmd in JSON.parse(traceDetail.order.merDividingCmd)" :key="cmd.dividing_order_no">
                <li><span class="dividing-name">分账商户：</span><span class="dividing-value">{{ cmd.in_merchant_no }}</span></li>
                <li><span class="dividing-name">分账订单：</span><span class="dividing-value">{{ cmd.dividing_order_no }}</span></li>
                <li><span class="dividing-name">是否付费：</span><span class="dividing-value">{{ cmd.is_fee_payer }}</span></li>
                <li><span class="dividing-name">分账类型：</span><span class="dividing-value">{{ cmd.dividing_category }}</span></li>
                <li><span class="dividing-name">分账日期：</span><span class="dividing-value">{{ cmd.dividing_mer_date }}</span></li>
                <li><span class="dividing-name">分账金额：</span><span class="dividing-value">{{ cmd.dividing_amount }}</span></li>
              </ul>
            </div>
          </li>
          <li><span class="field-name">订单状态： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.state }}</span></li>
          <li><span class="field-name">成功支付流水： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.paymentTrace }}</span></li>
          <li><span class="field-name">成功支付时间： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.payedTime | FormatDate('yyyy-MM-dd HH:mm:ss') }}</span></li>
          <li><span class="field-name">支付方式： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.payWay }}</span></li>
          <li><span class="field-name">结算金额（元）： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.settleAmt | F2Y() }}</span></li>
          <li><span class="field-name">对账日期： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.merCheckDate }}</span></li>
          <li><span class="field-name">订单确认日期： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.finishDate }}</span></li>
          <li><span class="field-name">退款状态： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.refundState }}</span></li>
          <li><span class="field-name">已退款金额（元）： </span><span class="field-value">{{ traceDetail==null?'':traceDetail.order.refundedAmt }}</span></li>
        </ul>
      </div>
      <el-button type="primary" style="margin-left:35%" @click="onClick">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getPaymentTraceDetail } from '@/api/orders'
export default {
  name: 'PaymentTraceDetail',
  props: {
    trace: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      traceDetail: null
    }
  },
  created() {
    getPaymentTraceDetail(this.trace).then(res => {
      if (res.code === '0000') {
        this.traceDetail = res.data
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
    if (to.name === 'PaymentTraceList') {
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
