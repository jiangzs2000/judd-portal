<template>
  <div class="app-container">
    <div class="query-block">
      <el-form ref="requestForm" :inline="true" :model="requestForm" size="mini" class="requestForm">
        <el-row :gutter="0">
          <el-col :span="2.1">
            <el-form-item label="创建时间：" />
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-date-picker v-model="requestForm.startDate" type="date" value-format="yyyyMMdd" placeholder="选择日期" style="width:45%" />
              -
              <el-date-picker v-model="requestForm.endDate" type="date" value-format="yyyyMMdd" placeholder="选择日期" style="width:45%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="搜索：">
              <el-input ref="search" v-model="requestForm.search" placeholder="请输入员工姓名/帐户名" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click.native.prevent="onSubmit">提 交</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button>重 置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-block">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | FormatDate('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="userName"
          label="帐户名"
        />
        <el-table-column
          prop="email"
          label="电子邮箱"
        />
      </el-table>
      <div><p /></div>
      <el-button icon="el-icon-plus" @click="createUser" />
      <div style="width:100%;text-align:center;margin-top:15px">
        <el-pagination
          v-if="total / requestForm.pageSize > 1"
          background
          :current-page="requestForm.page"
          :page-size="requestForm.pageSize"
          :page-count="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getUsersByQuery } from '@/api/user'
import { PAGE_SIZE } from '@/constants/constants'

export default {
  name: 'SubMerUserList',
  props: {
    merchantNo: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      tableData: [],
      total: 0, // 总页数
      requestForm: {
        merchantNo: '',
        startDate: '',
        endDate: '',
        state: '',
        search: '',
        pageSize: PAGE_SIZE,
        page: 1
      }
    }
  },
  mounted() {
    console.log('mounted')
    console.log('merchantNo: ', this.merchantNo)
  },
  activated() {
    console.log('activated')
    if (this.$route.meta.refresh) {
      this.tableData = []
      this.total = 0
      this.requestForm.startDate = ''
      this.requestForm.endDate = ''
      this.requestForm.state = ''
      this.requestForm.search = ''
      this.requestForm.page = 1
      this.$route.meta.refresh = false
    }
    console.log('this.merchantNo: ', this.merchantNo)
    console.log('this.requestForm.merchantNo: ', this.requestForm.merchantNo)
    if (this.merchantNo !== '') {
      this.requestForm.merchantNo = this.merchantNo
      this.query(this.requestForm)
    } else if (this.requestForm.merchantNo !== '') { // 通过 this.$router.back()或this.$router.go(-1)回到本页，页内参数不初始化
      console.log('go(-1) or back()')
      this.query(this.requestForm)
    } else {
      this.$message({
        message: '没有收到传入参数',
        type: 'error'
      })
    }
    console.log('register listener')
    this.$bus.$on('closeSelectedTag', this.closeEventHandler)
  },
  beforeRouteLeave(to, from, next) {
    console.log('merchantNo: ', this.merchantNo)
    console.log('beforeRouteLeave', to)
    this.$bus.$off('closeSelectedTag', this.closeEventHandler)
    next()
  },
  deactivated() {
    console.log('deactivated')
    this.$bus.$off('closeSelectedTag', this.closeEventHandler)
  },
  methods: {
    handleCurrentChange(indexPage) {
      // 打印出当前页数
      console.log(indexPage)
      this.requestForm.page = indexPage
      this.query(this.requestForm)
    },
    onSubmit() {
      console.log('onsubmit')
      this.requestForm.page = 1
      this.total = 0
      this.query(this.requestForm)
    },
    query(data) {
      getUsersByQuery(data).then(res => {
        if (res.code === '0000') {
          this.tableData = res.data.list
          if (res.data.count != null) {
            this.total = res.data.count
            this.requestForm.page = res.data.page
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    closeEventHandler(event) {
      // console.log('closeEventHandler', event)
      if (event.name === 'SubMerUserList') {
        console.log('SubMerUserList closed')
        this.$route.meta.refresh = true
      }
    },
    createUser() {
      console.log('createuser')
      this.$router.push({ name: 'CreateMerUser', params: { merchantNo: this.requestForm.merchantNo }})
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
  ::v-deep .pagination[data-v-7ce5917a]{
    width:100%;
    text-align:center
  }
  ::v-deep .pagination>ul[data-v-7ce5917a]{
    margin:40px 0 60px
  }
  ::v-deep .pagination>ul>li[data-v-7ce5917a]{
    cursor:pointer;
    display:inline-block;
    padding:5px 9px;
    border:1px solid #e1e1eb;
    margin-right:5px
  }
  ::v-deep .pagination>ul>li.active[data-v-7ce5917a]{
    background:#4078c0;
    color:#fff
  }
  ::v-deep .pagination>ul>li.ellipsis[data-v-7ce5917a]{
    border:none
  }
  ::v-deep .pagination>ul>li.disabled[data-v-7ce5917a]{
    color:#dcdcdc
  }
}
</style>
