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
          prop="no"
          label="商户号"
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
          prop="contactName"
          label="联系人"
        />
        <el-table-column
          prop="mobileNo"
          label="手机号"
        />
        <el-table-column
          prop="stateName"
          label="状态"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="subMerUserList(scope.row)">员工帐户</el-button>
            <el-button v-if="scope.row.state === 'P'" type="text" size="small" @click="selectChannel(scope.row)">开通渠道</el-button>
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
    </div>
    <el-dialog title="选择渠道" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="渠道名称">
          <el-select v-model="form.channelCode" placeholder="请选择活动区域">
            <el-option
              v-for="(item, index) in channelList"
              :key="index"
              :label="item.channelName"
              :value="item.channelCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="channelProvision">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="去绑卡" :visible.sync="dialogBindCardVisible">
      渠道已经完成个人基础资料审核，是否现在去绑卡？
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBindCardVisible = false">取 消</el-button>
        <el-button type="primary" @click="gotoBindCard">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMerchants } from '@/api/merchant'
import { channelProvision } from '@/api/channel'
import { PAGE_SIZE } from '@/constants/constants'
import { getAllPayChannel3rds } from '@/api/channel'

export default {
  name: 'MyMerchants',
  data() {
    return {
      merchantTypeNames: ['', '个人', '个体', '企业'],
      stateList: {
        'N': '未生效',
        'P': '审批通过',
        'A': '已开通服务',
        'B': '冻结'
      },
      tableData: [],
      total: 0, // 总页数
      requestForm: {
        startDate: '',
        endDate: '',
        state: '',
        merSearch: '',
        pageSize: PAGE_SIZE,
        page: 1
      },
      dialogFormVisible: false,
      channelList: [],
      form: {
        row: null,
        channelCode: ''
      },
      dialogBindCardVisible: false
    }
  },
  activated() {
    console.log('activated')
    if (this.$route.meta.refresh) {
      this.tableData = []
      this.total = 0
      this.requestForm.startDate = ''
      this.requestForm.endDate = ''
      this.requestForm.state = ''
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
    this.query(this.requestForm)
    getAllPayChannel3rds().then(res => {
      if (res.code === '0000') {
        this.channelList = res.data
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
    onSubmit() {
      console.log('onsubmit')
      this.requestForm.page = 1
      this.total = 0
      this.query(this.requestForm)
    },
    query(data) {
      myMerchants(data).then(res => {
        if (res.code === '0000') {
          this.tableData = res.data.list
          this.tableData.forEach(element => {
            element.merchantTypeName = this.merchantTypeNames[element.merchantType]
            element.stateName = this.stateList[element.state]
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
    viewDetail(row) {
      console.log('row', row)
      this.$router.push({ name: 'MerchantDetail', params: { merchantNo: row.no }})
    },
    subMerUserList(row) {
      console.log('row', row)
      this.$router.push({ name: 'SubMerUserList', params: { merchantNo: row.no }})
    },
    closeEventHandler(event) {
      // console.log('closeEventHandler', event)
      if (event.name === 'MyMerchants') {
        console.log('MyMerchants closed')
        this.$route.meta.refresh = true
      }
    },
    selectChannel(row) {
      this.form.row = row
      this.dialogFormVisible = true
    },
    channelProvision() {
      console.log('channelProvision, merchantNo: ', this.form.row.no, ', merchantType: ', this.form.row.merchantType, ', channelCode: ', this.form.channelCode)
      channelProvision(this.form.row.no, this.form.channelCode).then(res => {
        if (res.code === '0000') {
          if (this.form.row.merchantType === 1) {
            this.dialogFormVisible = false
            if (res.data.state === 2) {
              console.log('channelProvision, open dialog')
              this.dialogBindCardVisible = true
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          } else {
            this.dialogFormVisible = false
            this.$message({
              message: '资料已经上传，等待渠道审核',
              type: 'success'
            })
          }
        } else {
          console.log('channelProvision, res.code', res.code)
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
    gotoBindCard() {
      this.dialogBindCardVisible = false
      this.$router.push({ name: 'BindCard', params: { merchantNo: this.form.row.no, channelCode: this.form.channelCode, merchantType: 1, idName: this.form.row.idName, mobileNo: this.form.row.mobileNo }})
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
