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
          <el-col :span="7">
            <el-form-item prop="state" label="申请状态：">
              <el-select v-model="requestForm.state" style="width:100%">
                <el-option
                  v-for="(label, key, index) in stateList"
                  :key="index"
                  :label="label"
                  :value="key"
                />
              </el-select>
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
          prop="stateName"
          label="申请状态"
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
              v-if="scope.row.state !== 'P'"
              type="text"
              size="small"
              @click.native.prevent="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.state !== 'P' && scope.row.state !== 'F' && scope.row.state !== 'W'"
              type="text"
              size="small"
              @click.native.prevent="submit4Review(scope.row)"
            >
              提交审核
            </el-button>
            <el-tooltip v-if="scope.row.state === 'F'" class="item" effect="light" placement="left-start">
              <div slot="content" v-html="scope.row.reviewRemark.replace('\n', '<br>')" />
              <el-button
                type="text"
                size="small"
              >批注</el-button>
            </el-tooltip>
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
  </div>
</template>

<script>
import { getFRAsByQuery, submit4Review } from '@/api/merchant'
import { PAGE_SIZE } from '@/constants/constants'

export default {
  nane: 'MyFRAs',
  data() {
    return {
      merchantTypeNames: ['', '个人', '个体', '企业'],
      stateList: {
        'I': '初始',
        'W': '等待审核',
        'P': '审核通过',
        'F': '不通过'
      },
      tableData: [],
      total: 0, // 总页数
      requestForm: {
        createUsers: [this.$store.getters.id],
        startDate: '',
        endDate: '',
        state: '',
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
    edit(row) {
      console.log('edit')
      switch (row.merchantType) {
        case 1:
          this.$router.push({ name: 'RegisterPerson', params: { orderNo: row.orderNo }})
          break
        case 2:
          this.$router.push({ name: 'RegisterIndividual', params: { orderNo: row.orderNo }})
          break
        case 3:
          this.$router.push({ name: 'RegisterCompany', params: { orderNo: row.orderNo }})
          break
      }
    },
    async submit4Review(row) {
      console.log('submit4Review')
      var msg = await submit4Review(row.orderNo).then(res => {
        if (res.code === '0000') {
          return res.data
        } else {
          return res.msg
        }
      }).catch(err => {
        console.log(err)
        return '程序异常'
      })
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    closeEventHandler(event) {
      // console.log('closeEventHandler', event)
      if (event.name === 'MyFRAs') {
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
