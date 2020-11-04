<template>
  <div class="app-container">
    <el-form ref="requestForm" :model="requestForm" :rules="requestRules" autocomplete="on" label-width="20%" size="mini" class="requestForm">
      <div>
        <div class="fields-block">
          <p>个人信息</p>
          <el-form-item prop="merchant.merchantName" label="姓名：">
            <el-input ref="merchantName" v-model="requestForm.merchant.merchantName" name="merchantName" placeholder="姓名" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
          <el-form-item prop="merchant.mobileNo" label="手机：">
            <el-input ref="mobileNo" v-model="requestForm.merchant.mobileNo" name="mobileNo" placeholder="手机号" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
          <el-form-item prop="merchant.idNo" label="身份证号：">
            <el-input ref="idNo" v-model="requestForm.merchant.idNo" name="idNo" class="onePerLine" />
          </el-form-item>
        </div>
      </div>
      <div>
        <p>支付设置</p>
        <div class="fields-block">
          <el-form-item label="支付通道费：">
            <el-input v-model="requestForm.paySalesAgreement.serviceChargePercent" class="onePerLine" />
          </el-form-item>
          <el-form-item label="通道费承担方：" prop="paySalesAgreement.assumePerson">
            <el-select v-model="requestForm.paySalesAgreement.assumePerson" placeholder="请选择" class="onePerLine">
              <el-option
                v-for="(label, key, index) in assumePersons"
                :key="index"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div>
        <p>提现模式</p>
        <div class="fields-block">
          <el-form-item label="提现模式：" prop="merchant.withdrawDepositType">
            <el-select v-model="requestForm.merchant.withdrawDepositType" placeholder="请选择" class="onePerLine">
              <el-option
                v-for="(label, key, index) in withdrawTypes"
                :key="index"
                :label="label"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div>
        <p>联系人设置</p>
        <div class="fields-block">
          <el-form-item prop="merchant.contactName" label="联系人姓名：">
            <el-input ref="contactName" v-model="requestForm.merchant.contactName" name="contactName" placeholder="联系人姓名" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
          <el-form-item prop="merchant.mobileNo" label="联系人手机：">
            <el-input ref="mobileNo" v-model="requestForm.merchant.mobileNo" name="mobileNo" placeholder="手机号" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
        </div>
      </div>
      <div>
        <div align="center" class="fields-block">
          <el-row>
            <el-col style="width: 60%">
              <el-button type="primary" @click.native.prevent="save">保 存</el-button>
            </el-col>
            <el-col style="width: 20%" />
            <el-col style="width: 20%">
              <el-button type="primary" @click.native.prevent="submit2Review">提 交</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { registerPerson, loadFRARequest } from '@/api/merchant'
// import store from '@/store'

export default {
  name: 'RegisterPerson',
  props: {
    orderNo: {
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
      withdrawTypes: {
        '0': '手动提现',
        '1': '自动提现'
      },
      assumePersons: {
        'payer': '付款方',
        'remittee': '收款方',
        'plat': '平台方'
      },
      requestForm: {
        orderNo: '',
        merchant: {
          merchantType: 1,
          merchantName: '',
          idName: '',
          idNo: '',
          contactName: '',
          mobileNo: '',
          withdrawDepositType: ''
        },
        paySalesAgreement: {
          assumePerson: '',
          serviceChargePercent: '0.5'
        },
        action: ''
      },
      requestRules: {
        merchant: {
          merchantName: [{ required: true, trigger: 'blur', message: '请填写商户姓名' }],
          idNo: [{ required: true, trigger: 'blur', message: '请填写身份证号' }],
          contactName: [{ required: true, trigger: 'blur', message: '请填写联系人' }],
          mobileNo: [{ required: true, trigger: 'blur', validator: validateMobileNo, message: '请填写手机号' }],
          withdrawDepositType: [{ required: true, trigger: ['blur', 'change'], message: '请填写提现方式' }]
        },
        paySalesAgreement: {
          assumePerson: [{ required: true, message: '请选择手续费承担方', trigger: ['blur', 'change'] }]
        }
      },
      checkAll: false,
      isIndeterminate: true
    }
  },
  watch: {
    'requestForm.merchant.merchantName': function(val) {
      console.log('merchantName changed', val)
      this.requestForm.merchant.contactName = this.requestForm.merchant.merchantName
    }
  },
  mounted() {
    console.log('mounted, orderNO: ', this.orderNo)
    if (this.orderNo !== '') {
      this.requestForm.orderNo = this.orderNo
      // todo load registration
      loadFRARequest(this.orderNo).then(res => {
        if (res.code === '0000') {
          this.requestForm = res.data
          this.requestForm.merchant.withdrawDepositType = this.requestForm.merchant.withdrawDepositType.toString()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  methods: {
    save() {
      this.requestForm.action = 'save'
      this.onSubmit()
    },
    submit2Review() {
      this.requestForm.action = 'submit4review'
      this.onSubmit()
    },
    onSubmit() {
      console.log('submit!')
      this.loading = true
      this.requestForm.merchant.idName = this.requestForm.merchant.merchantName
      this.requestForm.merchant.contactName = this.requestForm.merchant.merchantName
      this.$refs.requestForm.validate(valid => {
        if (valid) {
          return registerPerson(this.requestForm).then(res => {
            if (res.code === '0000') {
              this.requestForm = res.data
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.loading = false
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$store.dispatch('tagsView/delView', this.$route)
      // this.$router.go(-1)
      if (this.requestForm.action === 'submit4review') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'MyFRAs') {
      to.meta.refresh = false
    }
    next()
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

