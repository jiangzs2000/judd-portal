<template>
  <div style="padding:20px;width=100%;">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'ManageMerchant',
  created() {
    const route = this.$route.matched.find(item => item.name === 'ManageMerchant')
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>
