<template>
  <div class="app-container">
    <el-form ref="requestForm" :model="requestForm" :rules="requestRules" label-width="20%" size="mini" class="requestForm">
      <div>
        <p>商户信息</p>
        <div class="fields-block">
          <el-form-item label="商户名称：" prop="merchant.merchantName">
            <el-input ref="merchantName" v-model="requestForm.merchant.merchantName" class="onePerLine" />
          </el-form-item>
          <el-form-item label="所在城市：" prop="merchant.province">
            <el-row>
              <el-select v-model="requestForm.merchant.province" placeholder="请选择 省" class="twoPerLineContent" @change="onProvinceChange">
                <el-option
                  v-for="item in provinces"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              -
              <el-select v-model="requestForm.merchant.city" placeholder="请选择 市" class="twoPerLineContent">
                <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item label="营业执照号：" prop="merchant.businessLicenseNo">
            <el-input ref="businessLicenseNo" v-model="requestForm.merchant.businessLicenseNo" class="onePerLine" />
          </el-form-item>
          <el-form-item label="营业期限：" prop="">
            <el-row>
              <el-date-picker v-model="requestForm.merchant.startDate" type="date" placeholder="选择日期" class="twoPerLineContent" />
              -
              <el-date-picker v-model="requestForm.merchant.endDate" type="date" placeholder="选择日期" class="twoPerLineContent" />
            </el-row>
          </el-form-item>
          <el-form-item label="营业执照上传：" prop="merchant.businessLicenseUrl">
            <el-input v-model="requestForm.merchant.businessLicenseUrl" type="hidden" />
            <el-upload
              class="upload-demo"
              action=""
              :before-upload="preUploadBizLicence"
              :http-request="handleHttpRequest"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </div>
      </div>
      <div>
        <p>法人信息</p>
        <div class="fields-block">
          <el-form-item label="法定代表人：" prop="merchant.idName">
            <el-input v-model="requestForm.merchant.idName" class="onePerLine" />
          </el-form-item>
          <el-form-item label="法人身份证号：" prop="merchant.idNo">
            <el-input v-model="requestForm.merchant.idNo" class="onePerLine" />
          </el-form-item>
          <el-form-item label="法人身份证正面：" prop="merchant.idFrontSideUrl">
            <el-input v-model="requestForm.merchant.idFrontSideUrl" type="hidden" />
            <el-upload
              class="upload-demo"
              action=""
              :before-upload="preUploadIdFrontSide"
              :http-request="handleHttpRequest"
              :on-remove="handleRemoveIdFrontSide"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="法人身份证反面：" prop="merchant.idBackSideUrl">
            <el-input v-model="requestForm.merchant.idBackSideUrl" type="hidden" />
            <el-upload
              class="upload-demo"
              action=""
              :before-upload="preUploadIdBackSide"
              :http-request="handleHttpRequest"
              :on-remove="handleRemoveIdBackSide"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </div>
      </div>
      <div>
        <p>预留银行账户信息</p>
        <div class="fields-block">
          <el-form-item prop="merchantBank.accountName" label="姓名：">
            <el-input ref="accountName" v-model="requestForm.merchantBank.accountName" name="accountName" placeholder="姓名" type="text" class="onePerLine" autocomplete="on" />
          </el-form-item>
          <el-form-item prop="merchantBank.cardNo" label="卡号：">
            <el-input ref="cardNo" v-model="requestForm.merchantBank.cardNo" name="cardNo" class="onePerLine" />
          </el-form-item>
          <el-form-item prop="merchantBank.bankCode" label="开户行：">
            <el-select v-model="requestForm.merchantBank.bankCode" class="onePerLine">
              <el-option
                v-for="(item, index) in bankList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="merchantBank.branchName" label="支行名称：">
            <el-input ref="branchName" v-model="requestForm.merchantBank.branchName" name="branchName" placeholder="支行全称" class="onePerLine" />
          </el-form-item>
          <el-form-item label="开户许可证上传：" prop="merchant.licenceUrl">
            <el-upload
              class="upload-demo"
              action=""
              :before-upload="preUploadLicence"
              :http-request="handleHttpRequest"
              :on-remove="handleRemoveLicence"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
                v-for="item in assumePersons"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
                v-for="item in withdrawTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
import { getRegions } from '@/api/region'
import { validMobile } from '@/utils/validate'
import { registerCompany } from '@/api/merchant'
import { getBanksByMerchantType } from '@/api/bank'
import { getAliOSSConfigs } from '@/api/configs'
// import { Message } from 'element-ui'
import { ossClient } from '@/utils/aliOSSClient'

// import store from '@/store'

export default {
  name: 'CreateMerchant',
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
      provinces: this.initRegion(),
      cities: [],
      withdrawTypes: [
        {
          value: '0',
          label: '手动提现'
        },
        {
          value: '1',
          label: '自动提现'
        }
      ],
      assumePersons: [
        {
          value: 'payer',
          label: '付款方'
        },
        {
          value: 'remittee',
          label: '收款方'
        },
        {
          value: 'plat',
          label: '平台方'
        }
      ],
      uploadHeaders: {
        authorization: '*'
      },
      ossFileName: '',
      disabled: false,
      fileList: [],
      files: 10,
      aliOSSConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: ''
      },
      requestForm: {
        channelCode: 'LDLJ',
        merchant: {
          merchantType: 3,
          merchantName: '',
          businessLicenseNo: '',
          businessLicenseUrl: null,
          licenceUrl: null, // 开户许可证地址
          idName: '',
          idNo: '',
          idFrontSideUrl: '',
          idBackSideUrl: '',
          contactName: '',
          mobileNo: '',
          withdrawDepositType: '',
          notificationUrl: null
        },
        merchantBank: {
          merchantNo: '',
          cardNo: '',
          bankName: '',
          bankCode: '',
          accountName: '',
          branchName: '',
          mobile: ''
        },
        paySalesAgreement: {
          assumePerson: '',
          serviceChargePercent: '0.5'
        }
      },
      requestRules: {
        merchant: {
          merchantName: [{ required: true, trigger: 'blur', message: '请填写商户名称' }],
          businessLicenseNo: [{ required: true, trigger: 'blur', message: '请填写营业执照号' }],
          idName: [{ required: true, trigger: 'blur', message: '请填写姓名' }],
          idNo: [{ required: true, trigger: 'blur', message: '请填写身份证号' }],
          withdrawDepositType: [{ required: true, trigger: ['blur', 'change'], message: '请填写提现方式' }],
          contactName: [{ required: true, trigger: 'blur', message: '请填写手机号' }],
          mobileNo: [{ required: true, trigger: 'blur', message: '请填写手机号' }, { validator: validateMobileNo, trigger: 'blur' }],
          businessLicenseUrl: [{ required: true, message: '请上传营业执照' }],
          idFrontSideUrl: [{ required: true, message: '请上传身份证正面' }],
          idBackSideUrl: [{ required: true, message: '请上传身份证反面' }],
          licenceUrl: [{ required: true, message: '请上传开户许可证' }]
        },
        merchantBank: {
          cardNo: [{ required: true, trigger: 'blur', message: '请填写卡号' }],
          bankCode: [{ required: true, trigger: ['blur', 'change'], message: '请选择开户行' }],
          accountName: [{ required: true, trigger: 'blur', message: '请选择开户人姓名' }],
          branchName: [{ required: true, trigger: 'blur', message: '请输入支行名称' }]
        },
        paySalesAgreement: {
          assumePerson: [{ required: true, message: '请选择手续费承担方', trigger: ['blur', 'change'] }]
        }
      },
      checkAll: false,
      isIndeterminate: true
    }
  },
  mounted() {
    getBanksByMerchantType(3).then(res => {
      if (res.code === '0000') {
        res.data.forEach(element => {
          this.bankList.push({
            value: element.bankCode,
            label: element.bankName
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })
    getAliOSSConfigs().then(res => {
      if (res.code === '0000') {
        this.aliOSSConfig.region = res.data.region
        this.aliOSSConfig.accessKeyId = res.data.accessKeyId
        this.aliOSSConfig.accessKeySecret = res.data.accessKeySecret
        this.aliOSSConfig.bucket = res.data.registration_company
      } else {
        console.log(res)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    onSubmit() {
      console.log('submit!')
      this.$refs.requestForm.validate(valid => {
        if (valid) {
          this.loading = true
          registerCompany(this.requestForm).then(res => {
            if (res.code === '0000') {
              this.$router.push({ name: 'RegisterCompanyResult' })
              this.loading = false
            }
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onProvinceChange() {
      if (this.requestForm.merchant.province) {
        getRegions().then(res => {
          if (res.code === '0000') {
            console.log('cities:')
            this.cities = []
            res.data.forEach((item, i) => {
              if (item[this.requestForm.merchant.province]) {
                console.log(item[this.requestForm.merchant.province])
                item[this.requestForm.merchant.province].forEach((city) => {
                  this.cities.push({
                    value: city,
                    label: city
                  })
                })
              }
            })
            console.log(this.cities)
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.cities = []
    },
    initRegion() {
      var provinces = []
      getRegions().then(res => {
        if (res.code === '0000') {
          // this.$store.dispatch('fundationData/setProvinceCityList', res.data)
          res.data.forEach(element => {
            provinces.push({
              value: Object.keys(element)[0],
              label: Object.keys(element)[0]
            })
          })
        }
      }).catch(err => {
        console.log(err)
      })
      return provinces
    },
    handleRemove(file, fileList) {
      console.log('handleRemove')
      console.log(file, fileList)
    },
    preUploadBizLicence(file) {
      console.log('preUploadBizLicence')
      console.log(file)
      this.ossFileName = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop()
      this.requestForm.merchant.businessLicenseUrl = this.ossFileName
      console.log('this.requestForm.merchant.businessLicenseUrl:', this.requestForm.merchant.businessLicenseUrl)
    },
    preUploadIdFrontSide(file) {
      console.log('preUploadIdFrontSide')
      console.log(file)
      this.ossFileName = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop()
      this.requestForm.merchant.idFrontSideUrl = this.ossFileName
      console.log('this.requestForm.merchant.idFrontSideUrl:', this.requestForm.merchant.idFrontSideUrl)
    },
    handleRemoveIdFrontSide(file, fileList) {
      console.log('handleRemoveIdFrontSide')
      console.log(file, fileList)
    },
    preUploadIdBackSide(file) {
      console.log('preUploadIdBackSide')
      console.log(file)
      this.ossFileName = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop()
      this.requestForm.merchant.idBackSideUrl = this.ossFileName
      console.log('this.requestForm.merchant.businessLicenidBackSideUrlseUrl:', this.requestForm.merchant.idBackSideUrl)
    },
    handleRemoveIdBackSide(file, fileList) {
      console.log('handleRemoveIdBackSide')
      console.log(file, fileList)
    },
    preUploadLicence(file, fileList) {
      console.log('preUploadLicence')
      console.log(file, fileList)
      this.ossFileName = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop()
      this.requestForm.merchant.licenceUrl = this.ossFileName
      console.log('this.requestForm.merchant.licenceUrl:', this.requestForm.merchant.licenceUrl)
    },
    handleRemoveLicence(file, fileList) {
      console.log('handleRemoveLicence')
      console.log(file, fileList)
    },
    beforeUpload(file) {
      console.log('beforeUpload(file):', file)
      /*
      return new Promise((resolve, reject) => {
        this.getAliToken().then(response => {
          if (response) {
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })*/
    },
    async handleHttpRequest(option) { // 上传OSS
      try {
        console.log('option:', option)
        const vm = this
        vm.disabled = true
        const client = ossClient(this.aliOSSConfig)
        const file = option.file
        // 分片上传文件
        await client.multipartUpload(this.ossFileName, file, {
          progress: async function(p) {
            const e = {}
            e.percent = p * 100
            option.onProgress(e)
          }
        }).then(res => {
          console.log('handleHttpRequest', res)
          if (res.statusCode === 200) {
            // option.onSuccess(ret)
            return res.requestUrls
          } else {
            vm.disabled = false
            option.onError('上传失败')
          }
        }).catch(err => {
          vm.disabled = false
          option.onError('上传失败')
          console.log(err)
        })
      } catch (error) {
        console.log(error)
        this.disabled = false
        option.onError('上传失败')
      }
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // 随机生成文件名
    random_string(len) {
      len = len || 32
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678'; const maxPos = chars.length; let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .requestForm {
    position: relative;
    margin-left: 0%;
    width: 100%;
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

