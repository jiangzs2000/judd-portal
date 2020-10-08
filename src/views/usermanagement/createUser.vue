<template>
  <div class="app-container">
    <p>帐户信息</p>
    <div class="fields-block">
      <el-form ref="userForm" :model="userForm" :rules="userRules" autocomplete="on" label-width="30%" size="mini">
        <el-form-item prop="name" label="姓名：">
          <el-input ref="name" v-model="userForm.name" name="name" placeholder="姓名" type="text" class="onePerLine" autocomplete="on" />
        </el-form-item>
        <el-form-item prop="userName" label="帐户名（手机）：">
          <el-input ref="userName" v-model="userForm.userName" name="userName" placeholder="帐户名" type="text" class="onePerLine" autocomplete="on" />
        </el-form-item>
        <el-form-item v-if="merchantType == 'saas'" prop="roles" label="帐户角色：">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange($event, saasRoles)">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userForm.roles" name="roles" @change="handleCheckedRolesChange($event, saasRoles)">
            <el-checkbox v-for="item in saasRoles" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-else-if="merchantType == 'platform'" prop="roles" label="帐户角色：">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange($event, platformRoles)">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userForm.roles" name="roles" @change="handleCheckedRolesChange($event, platformRoles)">
            <el-checkbox v-for="item in platformRoles" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-else-if="merchantType == 'mer'" prop="roles" label="帐户角色：">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange($event, merRoles)">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userForm.roles" name="roles" @change="handleCheckedRolesChange($event, merRoles)">
            <el-checkbox v-for="item in merRoles" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="pid" label="上级帐户：">
          <el-select v-model="userForm.pid" class="onePerLine">
            <el-option
              v-for="item in parentUsers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电子邮箱：">
          <el-input v-model="userForm.email" class="onePerLine" />
        </el-form-item>
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
import { getUsersUnderSameMerchant, create } from '@/api/user'
import { getCurrentMerchantType } from '@/api/merchant'
import { validUsername, validEmail } from '@/utils/validate'
// import store from '@/store'

export default {
  name: 'CreateUser',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('电子邮箱格式不正确，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        userName: '',
        roles: [],
        name: '',
        pid: '',
        email: ''
      },
      userRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername, message: '请输入手机号' }],
        roles: [{ required: true, trigger: 'blur', message: '请选择帐户角色' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        pid: [{ required: true, trigger: 'blur', message: '请选择上级' }],
        email: [{ required: false, trigger: 'blur', validator: validateEmail }]
      },
      saasRoles: [{
        value: 'plat-admin',
        label: '管理员'
      }, {
        value: 'plat-salesman',
        label: '业务员'
      }, {
        value: 'plat-manager',
        label: '经理/老板'
      }, {
        value: 'plat-accountant',
        label: '财务'
      }],
      checkAll: false,
      isIndeterminate: true,
      platformRoles: [{
        value: 'platmer-admin',
        label: '管理员'
      }, {
        value: 'platmer-salesman',
        label: '业务员'
      }, {
        value: 'platmer-manager',
        label: '经理/老板'
      }, {
        value: 'platmer-accountant',
        label: '财务'
      }],
      merRoles: [{
        value: 'mer-admin',
        label: '管理员'
      }, {
        value: 'mer-manager',
        label: '经理/老板'
      }, {
        value: 'mer-accountant',
        label: '财务'
      }],
      merchantType: null,
      parentUsers: []
    }
  },
  mounted() {
    getCurrentMerchantType().then(res => {
      if (res.code === '0000') {
        this.merchantType = res.data
      }
    }).catch(err => {
      console.log(err)
    })
    getUsersUnderSameMerchant().then(res => {
      if (res.code === '0000') {
        this.parentUsers = []
        this.parentUsers.push({
          value: '0000',
          label: '无上级'
        })
        res.data.forEach(element => {
          this.parentUsers.push({
            value: element['id'],
            label: element['name']
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })
    /* if (this.userForm.userName === '') {
      this.$refs.userForm.userName.focus()
    }*/
  },
  methods: {
    onSubmit() {
      console.log('submit!')
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true
          create(this.userForm).then(res => {
            if (res.code === '0000') {
              this.$router.push({ name: 'UserDetail', params: { userName: this.userForm.userName }})
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
    handleCheckAllChange(val, allRoles) {
      console.log('all roles are: ', allRoles)
      // this.userForm.roles = val ? allRoles : []
      if (val) {
        allRoles.forEach(element => {
          this.userForm.roles.push(element.value)
        })
      } else {
        this.userForm.roles = []
      }
      this.isIndeterminate = false
    },
    handleCheckedRolesChange(value, allRoles) {
      console.log('event:', value)
      const checkedCount = value.length
      this.checkAll = checkedCount === allRoles.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < allRoles.length
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .fields-block {
  margin-left: 10px;
  width: 70%;
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

