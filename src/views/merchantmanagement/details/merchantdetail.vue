<template>
  <div class="app-container">
    <div class="header">
      <p>商户详情</p>
    </div>
    <div>
      <p>商户信息</p>
      <div>
        <ul>
          <li><span class="field-name">商户名称： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.merchantName }}</span></li>
          <li v-if="!merchantNo.startsWith('P')"><span class="field-name">所在城市： </span><span class="field-value-half">{{ merchantDetail==null?'':merchantDetail.merchant.province }}</span>-<span class="field-value-half">{{ merchantDetail==null?'':merchantDetail.merchant.city }}</span></li>
          <li v-if="!merchantNo.startsWith('P')"><span class="field-name">营业执照号：</span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.businessLicenseNo }}</span></li>
          <li v-if="!merchantNo.startsWith('P')"><span class="field-name">营业期限： </span><span class="field-value-half">{{ merchantDetail==null?'':merchantDetail.merchant.startDate | FormatDate('yyyy-MM-dd HH:mm:ss') }}</span>-<span class="field-value-half">{{ merchantDetail==null?'':merchantDetail.merchant.endDate | FormatDate('yyyy-MM-dd HH:mm:ss') }}</span></li>
          <li v-if="!merchantNo.startsWith('P')"><span class="field-name-img">营业执照：</span><img :src="businessLicenseUrl"></li>
          <li v-if="merchantNo.startsWith('P')"><span class="field-name">法人身份证号： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.idNo }}</span></li>
        </ul>
      </div>
      <div v-if="!merchantNo.startsWith('P')">
        <p>法人信息</p>
        <div>
          <ul>
            <li><span class="field-name">法定代表人： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.idName }}</span></li>
            <li><span class="field-name">法人身份证号： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.idNo }}</span></li>
            <li><span class="field-name-img">法人身份证正面：</span><img :src="idFrontSideUrl"></li>
            <li><span class="field-name-img">法人身份证反面： </span><img :src="idBackSideUrl"></li>
          </ul>
        </div>
      </div>
      <div v-if="merchantNo.startsWith('C')">
        <p>预留银行账户信息</p>
        <div>
          <ul>
            <li><span class="field-name">姓名： </span><span class="field-value">{{ merchantDetail==null||merchantDetail.mb==null?'':merchantDetail.mb.accountName }}</span></li>
            <li><span class="field-name">卡号： </span><span class="field-value">{{ merchantDetail==null||merchantDetail.mb==null?'':merchantDetail.mb.cardNo }}</span></li>
            <li><span class="field-name">开户行：</span><span class="field-value">{{ merchantDetail==null||merchantDetail.mb==null?'':merchantDetail.mb.bankCode }}</span></li>
            <li><span class="field-name">支行名称： </span><span class="field-value">{{ merchantDetail==null||merchantDetail.mb==null?'':merchantDetail.mb.branchName }}</span></li>
            <li><span class="field-name-img">开户许可证： </span><img :src="licenceUrl"></li>
          </ul>
        </div>
      </div>
      <p>支付设置</p>
      <div>
        <ul>
          <li><span class="field-name">支付通道费(%)： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.psa.serviceChargePercent }}</span></li>
          <li><span class="field-name">通道费承担方： </span><span class="field-value">{{ merchantDetail==null?'':(merchantDetail.psa.assumePerson ==='payer'?'付款方':'收款方') }}</span></li>
        </ul>
      </div>
      <p>提现模式</p>
      <div>
        <ul>
          <li><span class="field-name">提现模式： </span><span class="field-value">{{ merchantDetail==null?'':(merchantDetail.merchant.withdrawDepositType==0?'手动提现':'自动提现') }}</span></li>
        </ul>
      </div>
      <p>联系人设置</p>
      <div>
        <ul>
          <li><span class="field-name">联系人姓名： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.contactName }}</span></li>
          <li><span class="field-name">联系人手机： </span><span class="field-value">{{ merchantDetail==null?'':merchantDetail.merchant.mobileNo }}</span></li>
        </ul>
      </div>
      <el-button type="primary" style="margin-left:35%" @click="close">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getMerDetailByMerchantNo } from '@/api/merchant'
import { getAliOSSConfigs } from '@/api/configs'
// import { Message } from 'element-ui'
import { ossClient } from '@/utils/aliOSSClient'
export default {
  name: 'MerchantDetail',
  props: {
    merchantNo: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      merchantDetail: null,
      aliOSSConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: ''
      },
      businessLicenseUrl: '',
      idFrontSideUrl: '',
      idBackSideUrl: '',
      licenceUrl: ''
    }
  },
  created() {
    console.log('created')
    getMerDetailByMerchantNo(this.merchantNo).then(res => {
      if (res.code === '0000') {
        this.merchantDetail = res.data
        getAliOSSConfigs().then(res => {
          if (res.code === '0000') {
            this.aliOSSConfig.region = res.data.region
            this.aliOSSConfig.accessKeyId = res.data.accessKeyId
            this.aliOSSConfig.accessKeySecret = res.data.accessKeySecret
            this.aliOSSConfig.bucket = res.data.registration_company
            const client = ossClient(this.aliOSSConfig)
            this.businessLicenseUrl = (this.merchantDetail == null || this.merchantDetail.merchant == null || this.merchantDetail.merchant.businessLicenseUrl == null) ? '' : client.signatureUrl(this.merchantDetail.merchant.businessLicenseUrl)
            this.idFrontSideUrl = (this.merchantDetail == null || this.merchantDetail.merchant == null || this.merchantDetail.merchant.idFrontSideUrl == null) ? '' : client.signatureUrl(this.merchantDetail.merchant.idFrontSideUrl)
            this.idBackSideUrl = (this.merchantDetail == null || this.merchantDetail.merchant == null || this.merchantDetail.merchant.idBackSideUrl == null) ? '' : client.signatureUrl(this.merchantDetail.merchant.idBackSideUrl)
            this.licenceUrl = (this.merchantDetail == null || this.merchantDetail.merchant == null || this.merchantDetail.merchant.licenceUrl == null) ? '' : client.signatureUrl(this.merchantDetail.merchant.licenceUrl)
            console.log('images:')
            console.log(this.businessLicenseUrl)
            console.log(this.idFrontSideUrl)
            console.log(this.idBackSideUrl)
            console.log(this.licenceUrl)
          } else {
            console.log(res)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
  },
  methods: {
    close() {
      // 调用全局挂载的方法
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  },
  beforeRouteLeave(to, from, next) {
    to.meta.refresh = false
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
  ::v-deep .header{
    width: 100%;
    text-align: center;
    font-size: x-large;
  }
  ::v-deep .field-name {
    display: inline-block;
    width: 16%;
    text-align: right;
    height: auto;
  }
  ::v-deep .field-value {
    display: inline-block;
    width: 50%;
    padding: 5px 10px 5px 5px;
    border: 1px solid rgb(216, 215, 215);
    border-radius: 5px;
  }
  ::v-deep .field-name-img {
    width: 16%;
    text-align: right;
    height: auto;
    float: left;
  }
  ::v-deep img{
    width: 50%;
    height: auto;
  }
  ::v-deep .field-value-half {
    width: 24.8%;
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
