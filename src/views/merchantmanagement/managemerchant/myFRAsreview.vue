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
              <el-input ref="merSearch" v-model="requestForm.merSearch" placeholder="请输入商户名称/商户号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          prop="orderNo"
          label="申请编号"
        />
        <el-table-column
          prop="merchantName"
          label="商户名称"
        />
        <el-table-column
          prop="merchantTypeName"
          label="商户类型"
        />
        <el-table-column
          prop="merchantNo"
          label="商户编号"
        />
        <el-table-column
          prop="creatorName"
          label="进件员工"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="merDetail(scope.row)"
            >
              商户详情
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="agreementDetail(scope.row)"
            >
              协议
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="toApprove(scope.row)"
            >
              批准
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="toReject(scope.row)"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <p>请输入批注:</p>
        <el-input
          v-model="remark"
          type="textarea"
          :rows="2"
          placeholder="请输入批注"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelReject">取 消</el-button>
          <el-button type="primary" @click="doReject">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getFRAsByQuery, approve, reject } from '@/api/merchant'
import { getSubUsers } from '@/api/user'
import { PAGE_SIZE } from '@/constants/constants'

export default {
  nane: 'MyFRAsReview',
  data() {
    return {
      merchantTypeNames: ['', '个人', '个体', '企业'],
      stateList: {
        'I': '初始',
        'W': '等待审核',
        'P': '审核通过',
        'F': '不通过'
      },
      dialogVisible: false, // 控制对话框显示
      remark: '', // 记录批注
      curOrderNo: '', // 当前批注的申请单号
      tableData: [],
      createUsers: [],
      total: 0, // 总页数
      requestForm: {
        createUsers: [],
        startDate: '',
        endDate: '',
        state: 'W',
        merSearch: '',
        pageSize: PAGE_SIZE,
        page: 1
      }
    }
  },
  activated() {
    console.log('activated')
    if (this.$route.meta.refresh) {
      this.tableData = []
      this.total = 0
      this.requestForm.startDate = ''
      this.requestForm.endDate = ''
      this.requestForm.merSearch = ''
      this.requestForm.page = 1
      this.$route.meta.refresh = false
    }
    this.query(this.requestForm)
    console.log('register listener')
    this.$bus.$on('closeSelectedTag', this.closeEventHandler)
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave', to)
    this.$bus.$off('closeSelectedTag', this.closeEventHandler)
    next()
  },
  deactivated() {
    console.log('deactivated')
    this.$bus.$off('closeSelectedTag', this.closeEventHandler)
  },
  mounted() {
    getSubUsers(this.$store.getters.id).then(res => {
      if (res.code === '0000') {
        this.createUsers = res.data
        res.data.forEach(element => {
          this.requestForm.createUsers.push(element.id)
        })
        this.query(this.requestForm)
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    }).catch(err => {
      this.$message({
        message: err,
        type: 'error'
      })
    })
  },
  methods: {
    handleCurrentChange(indexPage) {
      // 打印出当前页数
      console.log(indexPage)
      this.requestForm.page = indexPage
      this.query(this.requestForm)
    },
    query(data) {
      getFRAsByQuery(data).then(res => {
        if (res.code === '0000') {
          this.tableData = res.data.list
          this.tableData.forEach(element => {
            element.merchantTypeName = this.merchantTypeNames[element.merchantType]
            element.stateName = this.stateList[element.state]
            element.creatorName = this.createUsers.find(item => item.id === element.createUser).name
          })
          if (res.data.count != null) {
            this.total = res.data.count
            this.requestForm.page = res.data.page
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      console.log('onsubmit')
      this.requestForm.page = 1
      this.total = 0
      this.query(this.requestForm)
    },
    merDetail(row) {
      console.log('agreementDetail')
      this.$router.push({ name: 'MerchantDetail', params: { merchantNo: row.merchantNo }})
    },
    agreementDetail(row) {
      console.log('agreementDetail')
    },
    toApprove(row) {
      console.log('approve')
      approve(row.orderNo).then(res => {
        if (res.code === '0000') {
          this.$message({
            message: res.data,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.query(this.requestForm)
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    toReject(row) {
      console.log('reject')
      this.curOrderNo = row.orderNo
      this.remark = row.reviewRemark
      this.dialogVisible = true
    },
    cancelReject() {
      console.log('cancelReject')
      this.dialogVisible = false
      this.curOrderNo = ''
      this.remark = ''
    },
    doReject() {
      console.log('doReject')
      var d = new Date() // 根据时间戳生成的时间对象
      var str = (d.getFullYear()) + '-' +
           (d.getMonth() + 1) + '-' +
           (d.getDate()) + ' ' +
           (d.getHours()) + ':' +
           (d.getMinutes()) + ':' +
           (d.getSeconds())
      this.remark = this.remark + '\n【' + str + '】'
      console.log('this.remark', this.remark)
      reject(this.curOrderNo, this.remark).then(res => {
        if (res.code === '0000') {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.dialogVisible = false
          this.curOrderNo = ''
          this.remark = ''
          this.query(this.requestForm)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
        return '程序异常'
      })
    },
    handleClose() {
      console.log('handleClose')
      this.dialogVisible = false
    },
    closeEventHandler(event) {
      // console.log('closeEventHandler', event)
      if (event.name === 'MyFRAsReview') {
        console.log('MyFRAs closed')
        this.$route.meta.refresh = true
      }
    }
  }
}
</script>

<!--style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style-->
<style lang="scss" scoped>
.app-container {
  ::v-deep .requestForm {
    position: relative;
    margin-left: 0%;
    width: 100%;
  }

  ::v-deep .buttons-block {
  margin-left: 10px;
  margin-top: 10px;
  width: 30%;
  margin-bottom: 0px;
  background-color: #f0f9eb;
  border-radius: 4px;
  }
  ::v-deep .onePerLine{
    width: 80%;
  }
  ::v-deep .twoPerLineContent{
    width: 33%;
  }
  ::v-deep .sixPerLineContent{
    width: 16.7%;
  }
  ::v-deep .customWidth{
    width: 90%;
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
