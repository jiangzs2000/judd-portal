<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="电子邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserInfo } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      console.log('submit user', this.user)
      updateUserInfo(this.user).then(res => {
        if (res.code === '0000') {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 5 * 1000
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '更新异常',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
