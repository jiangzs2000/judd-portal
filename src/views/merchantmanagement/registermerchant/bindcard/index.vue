<template>
  <div class="app-container">
    <el-form ref="requestForm" :model="requestForm" :rules="requestRules" autocomplete="on" label-width="20%" size="mini" class="requestForm">
      <div>
        <div class="fields-block">
          <p>银行卡信息</p>
          <el-form-item prop="merchantBank.accountName" label="姓名：">
            <el-input ref="accountName" v-model="requestForm.merchantBank.accountName" name="accountName" placeholder="姓名" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
          <el-form-item prop="merchantBank.cardNo" label="卡号：">
            <el-input ref="cardNo" v-model="requestForm.merchantBank.cardNo" name="cardNo" class="onePerLine" />
          </el-form-item>
          <el-form-item prop="merchantBank.bankCode" label="开户行：">
            <el-select v-model="requestForm.merchantBank.bankCode" class="onePerLine">
              <el-option
                v-for="item in bankList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="merchantBank.mobile" label="预留手机：">
            <el-input ref="mobile" v-model="requestForm.merchantBank.mobile" name="mobile" placeholder="手机号" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
          <el-row>
            <el-form-item prop="captcha" label="图片验证码：">
              <el-col style="width:55%;">
                <el-input ref="captcha" v-model="requestForm.captcha" name="captcha" placeholder="图片验证码" type="text" autocomplete="on" />
              </el-col>
              <el-col style="width:5%;">
                <p />
              </el-col>
              <el-col style="width:18%;">
                <el-image
                  style="width: 100%; height=30px;"
                  :src="captchaUrl"
                  :fit="fit"
                  :lazy="true"
                  @click.native.prevent="newCaptcha"
                />
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="messageCode" label="短信验证码：">
              <el-col style="width: 55%;">
                <el-input ref="messageCode" v-model="requestForm.messageCode" name="messageCode" placeholder="手机验证码" type="text" autocomplete="on" />
              </el-col>
              <el-col style="width: 5%;">
                <p />
              </el-col>
              <el-col style="width: 18%;">
                <el-button type="button" @click.native.prevent="onClick">{{ button }}</el-button>
              </el-col>
            </el-form-item>
          </el-row>
        </div>
      </div>
      <div>
        <div align="center" class="fields-block">
          <el-row>
            <el-col style="width: 60%">
              <el-button>重 置</el-button>
            </el-col>
            <el-col style="width: 20%" />
            <el-col style="width: 20%">
              <el-button type="primary" @click.native.prevent="onSubmit">提 交</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { getBanksByMerchantType } from '@/api/bank'
import { bindMerchantCardOrder, bindMerchantCardSubmit } from '@/api/channel'

export default {
  name: 'BindCard',
  props: {
    merchantNo: {
      type: String,
      default: () => ''
    },
    channelCode: {
      type: String,
      default: () => ''
    },
    merchantType: {
      type: Number,
      default: () => 1
    },
    idName: {
      type: String,
      default: () => ''
    },
    mobileNo: {
      type: String,
      default: () => ''
    }
  },
  data() {
    const validateMobileNo = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
    return {
      bankList: [],
      button: '获取验证码',
      totalTime: 60,
      canClick: true,
      captchaUrl: '',
      fit: 'fill',
      requestForm: {
        merchantNo: '',
        channelCode: '',
        captcha: '',
        messageCode: '',
        tradeNo: '',
        token: '',
        merchantBank: {
          merchantNo: '',
          cardNo: '',
          bankName: '',
          bankCode: '',
          accountName: '',
          branchName: '',
          mobile: ''
        }
      },
      requestRules: {
        messageCode: [{ required: false, trigger: 'blur', message: '请输入短信验证码' }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入图片验证码' }],
        merchantBank: {
          cardNo: [{ required: true, trigger: 'blur', message: '请输入卡号' }],
          bankCode: [{ required: true, trigger: ['blur', 'change'], message: '请选择开户行' }],
          accountName: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
          mobile: [{ required: true, trigger: 'blur', validator: validateMobileNo, message: '请输入手机号' }]
        }
      }
    }
  },
  mounted() {
    this.requestForm.merchantNo = this.merchantNo
    this.requestForm.channelCode = this.channelCode
    this.requestForm.merchantBank.merchantNo = this.merchantNo
    this.requestForm.merchantBank.accountName = this.idName
    this.requestForm.merchantBank.mobile = this.mobileNo

    getBanksByMerchantType(this.merchantType).then(res => {
      if (res.code === '0000') {
        res.data.forEach(element => {
          this.bankList.push({
            value: element.bankCode,
            label: element.bankName
          })
        })
      }
    })
    this.newCaptcha()
  },
  methods: {
    onSubmit() {
      this.requestRules.messageCode.required = true
      this.$refs.requestForm.validate(valid => {
        bindMerchantCardSubmit(this.requestForm).then(res => {
          if (res.code === '0000') {
            this.$router.push({ name: 'BindCardConfirm' })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    onClick() {
      if (!this.canClick) return
      this.$refs.requestForm.validate(valid => {
        if (valid) {
          bindMerchantCardOrder(this.requestForm).then(res => {
            if (res.code === '0000') {
              // this.button = '短信已发送'
              this.$message({
                message: '短信已发送',
                type: 'info'
              })
              this.requestForm.tradeNo = res.data
              this.newCaptcha()
              this.canClick = false
              this.button = this.totalTime + 's后重新发送'
              const clock = window.setInterval(() => {
                this.totalTime--
                this.button = this.totalTime + 's后重新发送'
                if (this.totalTime < 0) {
                  window.clearInterval(clock)
                  this.button = '发送验证码'
                  this.totalTime = 60
                  this.canClick = true // 这里重新开启
                }
              }, 1000)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('数据不全')
        }
        // this.newCaptcha()
      })
    },
    newCaptcha() {
      this.requestForm.token = this.guid()
      this.captchaUrl = process.env.VUE_APP_BASE_API + '/captcha/captcha/get?token=' + this.requestForm.token
      console.log('captchaurl is ', this.captchaUrl)
    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .merchantForm {
    position: relative;
    margin-left: 15%;
    width: 70%;
  }
  ::v-deep .fields-block {
  margin-left: 10px;
  margin-top: 10px;
  width: 80%;
  margin-bottom: 0px;
  border-radius: 4px;
  }
  ::v-deep .onePerLine{
    width: 80%;
  }
  ::v-deep .twoPerLineContent{
    width: 38.7%;
  }
}
</style>

