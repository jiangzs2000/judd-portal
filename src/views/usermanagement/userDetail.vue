<template>
  <div class="app-container">
    <ul>
      <li><span class="field-name">用户名：</span><span class="field-value">{{ userName }}</span></li>
      <li><span class="field-name">角色：</span><span class="field-value">{{ roles | trans2RoleNames }}</span></li>
      <li><span class="field-name">所属商户：</span><span class="field-value">{{ merchantName }}</span></li>
      <li><span class="field-name">电子邮箱：</span><span class="field-value">{{ email }}</span></li>
    </ul>
  </div>
</template>

<script>
import { getUserByUserName } from '@/api/user'
import { getMerchantByMerchantNo } from '@/api/merchant'

export default {
  props: {
    userName: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      roles: '',
      merchantName: '',
      email: ''
    }
  },
  mounted() {
    getUserByUserName(this.userName).then(res => {
      if (res.code === '0000') {
        this.roles = res.data.roles
        this.email = res.data.email
        getMerchantByMerchantNo(res.data.merchantNo).then(res => {
          this.merchantName = res.data.merchantName
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(err)
    })
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
