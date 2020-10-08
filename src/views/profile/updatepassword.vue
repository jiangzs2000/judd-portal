<template>
  <div class="app-container">
    <p>密码更新</p>
    <div class="fields-block">
      <el-form ref="userForm" :model="userForm" :rules="userRules" autocomplete="on" label-width="30%" size="mini">
        <el-tooltip v-model="capsTooltip" content="大写锁定" placement="right" manual>
          <el-form-item prop="oldPwd" label="旧密码">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="userForm.oldPwd"
              :type="passwordType"
              placeholder="旧密码"
              name="oldPwd"
              tabindex="1"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-tooltip v-model="capsTooltip" content="大写锁定" placement="right" manual>
          <el-form-item prop="newPwd1" label="新密码">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="userForm.newPwd1"
              :type="passwordType"
              placeholder="新密码"
              name="newPwd1"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-tooltip v-model="capsTooltip" content="大写锁定" placement="right" manual>
          <el-form-item prop="newPwd2" label="新密码">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="userForm.newPwd2"
              :type="passwordType"
              placeholder="新密码"
              name="newPwd2"
              tabindex="3"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-row>
          <el-col :span="8">
            <el-form-item />
          </el-col>
          <el-col :span="6">
            <el-button>重 置</el-button>
          </el-col>
          <el-col :span="6" />
          <el-col :span="6">
            <el-button type="primary" @click.native.prevent="onSubmit">提 交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
// import store from '@/store'
import { updatePassword } from '@/api/user'
export default {
  name: 'UpdatePassword',
  data() {
    return {
      passwordType: 'password',
      capsTooltip: false,
      userForm: {
        oldPwd: '',
        newPwd1: '',
        newPwd2: ''
      },
      userRules: {
        oldPwd: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        newPwd1: [{ required: true, trigger: 'blur', message: '请输入新密码' }],
        newPwd2: [{ required: true, trigger: 'blur', message: '请再输入一次' }]
      }
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    onSubmit() {
      console.log('submit!')
      if (this.userForm.newPwd1 !== this.userForm.newPwd2) {
        this.$message({
          message: '两次新密码不一致',
          type: 'error',
          duration: 5 * 10000
        })
        return
      }
      this.$refs.userForm.validate(valid => {
        if (valid) {
          updatePassword(this.userForm.oldPwd, this.userForm.newPwd2).then(res => {
            if (res.code === '0000') {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 5 * 10000
              })
            }
          }).catch(err => {
            console.log(err)
            this.$message({
              message: '更新失败',
              type: 'error',
              duration: 5 * 10000
            })
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
  .fields-block {
    position: relative;
    width: 80%;
    max-width: 100%;
    padding: 10px 35px 0;
    overflow: hidden;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 5px;
      }
    }
  }
  ::v-deep .show-pwd {
    position: relative;
    right: -5px;
    top: 5px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>

