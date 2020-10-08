<template>
  <div class="app-container">
    <el-form ref="requestForm" :model="requestForm" :rules="requestRules" autocomplete="on" label-width="20%" size="mini">
      <div>
        <div class="fields-block">
          <el-form-item label="公钥：">
            <el-input
              v-model="requestForm.publickey"
              type="textarea"
              :rows="10"
              placeholder="请输入内容"
              style="width:80%;"
            />
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
import { getPubkey, upsertPubkey } from '@/api/merchant'
import { Message } from 'element-ui'
// import store from '@/store'

export default {
  name: 'PublicKey',
  data() {
    return {
      requestForm: {
        publickey: ''
      },
      requestRules: {
        publickey: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    getPubkey().then(res => {
      if (res.code === '0000') {
        this.requestForm.publickey = res.data.publickey
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
          upsertPubkey(this.requestForm).then(res => {
            if (res.code === '0000') {
              Message({
                message: '保存成功',
                type: 'success',
                duration: 5 * 1000
              })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .fields-block {
  margin-left: 10px;
  margin-top: 20px;
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

