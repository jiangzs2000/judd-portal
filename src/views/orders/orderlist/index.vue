<template>
  <div style="padding:20px;width=100%;">
    <!--keep-alive include="RefundOrderList, RefundOrderList, WithdrawOrderList">
      <router-view />
    </keep-alive-->
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'OrderList',
  created() {
    const route = this.$route.matched.find(item => item.name === 'OrderList')
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>
