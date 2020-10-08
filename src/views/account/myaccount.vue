<template>
  <div class="app-container">
    <p>我的账户</p>
    <div class="content-block">
      <div class="balance-right">
        <div class="field">可提现金额：</div><div class="value">{{ avalBalance.toFixed(2) }}<span class="unit">（元）</span></div>
        <div><a href="" class="button" @click="onClick">提现</a></div>
      </div>
      <div class="balance-block">
        <div class="field">账户总金额：</div><div class="value">{{ totalBalance.toFixed(2) }}<span class="unit">（元）</span></div>
      </div>
      <div class="balance-block">
        <div class="field">不可提现金额：</div><div class="value">{{ freeznBalance.toFixed(2) }}<span class="unit">（元）</span></div>
      </div>
      <div class="balance-block">
        <div class="field">保证金：</div><div class="value">{{ warrentBalance.toFixed(2) }}<span class="unit">（元）</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyAccount',
  data() {
    return {
      avalBalance: 0,
      totalBalance: 0,
      freeznBalance: 0,
      warrentBalance: 0.00
    }
  },
  mounted() {
    this.avalBalance = Math.random() * 10000
    this.freeznBalance = Math.random() * 10000
    this.totalBalance = this.avalBalance + this.freeznBalance
    console.log('init')
  },
  methods: {
    onClick() {
      console.log('onClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  widows: 100%;
  text-align: center;
  ::v-deep ul li {
    list-style: none;
    margin: 15px;
  }
  ::v-deep .content-block {
      width: 80%;
      height: 200px;
      background: rgb(198, 239, 255);
      margin-left: 10%;
      padding-top: 20px;
      text-align: left;
  }
  ::v-deep .balance-right {
    width: 25%;
    height: 160px;
    padding: 20px 0px 0px 10px;
    float: left;
  }
  ::v-deep .balance-block {
    width: 25%;
    height: 160px;
    border-left: 1px solid black;
    padding: 20px 0px 0px 10px;
    float: left;
  }
  ::v-deep .field {
    font-family: Arial;
    padding: 10px 0px 10px 0px;
  }
  ::v-deep .value {
    font-family: Arial;
    font-size: large;
    padding: 10px 0px 10px 0px;
    float: left;
  }
  ::v-deep .unit {
    font-family: Arial;
    font-size: small;
  }
  ::v-deep .button {
    font-family: Arial;
    width: 50px;
    margin-left: 30px;
  }
  ::v-deep .button:LINK, .button:VISITED, .button:HOVER {
    color:white;
    padding:4px 10px 4px 10px;
    background-color:blue;
    text-decoration: none;
    border-radius: 5px;
  }
}
</style>
