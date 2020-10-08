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
        v-loading="listLoading"
        :data="tableData"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="商户编码">
          <template slot-scope="{row}">
            <span>{{ row.merchantNo }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="商户名称">
          <template slot-scope="{row}">
            <span>{{ row.merchantName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="费用承担方">
          <template slot-scope="{row}">
            <span>{{ row.assumePersonLabel }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="退款费用承担">
          <template slot-scope="{row}">
            <span>{{ row.refundAssumePersonLabel }}</span>
          </template>
        </el-table-column>

        <el-table-column label="支付费率%">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.serviceChargePercent" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >
                取消
              </el-button>
            </template>
            <span v-else>{{ row.serviceChargePercent }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              确定
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <paginator v-if="pageCount > 1" :page-count="pageCount" :init-page="requestForm.page" @togglePage="togglePage($event)" />
    </div>
  </div>
</template>

<script>
import vuePaginator from 'vue-paginator-simple'
import { myPSAs, update } from '@/api/paysalesagreement'
import { PAGE_SIZE } from '@/constants/constants'
export default {
  name: 'MyPaySalesAgreement',
  components: {
    'paginator': vuePaginator
  },
  data() {
    return {
      tableData: [],
      listLoading: true,
      pageCount: 0, // 总页数
      requestForm: {
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
      this.pageCount = 0
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
    convertTableData() {
      this.tableData.forEach(element => {
        switch (element.assumePerson) {
          case 'remittee': element.assumePersonLabel = '收款方'
            break
          case 'payer': element.assumePersonLabel = '付款方'
            break
          case 'plat':element.assumePersonLabel = '平台方'
            break
          default:element.assumePersonLabel = '收款方'
        }
        switch (element.refundAssumePerson) {
          case 'remittee': element.refundAssumePersonLabel = '收款方'
            break
          case 'payer': element.refundAssumePersonLabel = '付款方'
            break
          case 'plat':element.refundAssumePersonLabel = '平台方'
            break
          default:element.refundAssumePersonLabel = '收款方'
        }
      })
    },
    onSubmit() {
      this.requestForm.page = 1
      this.pageCount = 0
      this.query(this.requestForm)
    },
    togglePage(indexPage) {
      // 打印出当前页数
      console.log(indexPage)
      this.requestForm.page = indexPage
      this.query(this.requestForm)
    },
    query(form) {
      this.listLoading = true
      myPSAs(form).then(res => {
        if (res.code === '0000') {
          const items = res.data.list
          this.tableData = items.map(v => {
            this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalServiceChargePercent = v.serviceChargePercent //  will be used when user click the cancel botton
            return v
          })
          this.convertTableData()
          if (res.data.pageCount != null) {
            this.pageCount = res.data.pageCount
            this.requestForm.page = res.data.page
          }
        } else {
          console.log(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.serviceChargePercent = row.originalServiceChargePercent
      row.edit = false
      this.$message({
        message: '恢复费率设置',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      console.log(row)
      row.edit = false
      update(row).then(res => {
        if (res.code === '0000') {
          row.originalServiceChargePercent = row.serviceChargePercent
          this.$message({
            message: '完成费率设置',
            type: 'success'
          })
        } else {
          row.serviceChargePercent = row.originalServiceChargePercent
          this.$message({
            message: '费率更新失败',
            type: 'warning'
          })
          console.log(res.msg)
        }
      }).catch(err => {
        row.serviceChargePercent = row.originalServiceChargePercent
        this.$message({
          message: '费率更新失败',
          type: 'warning'
        })
        console.log(err)
      })
    },
    closeEventHandler(event) {
      // console.log('closeEventHandler', event)
      if (event.name === 'MyPaySalesAgreement') {
        console.log('MyPaySalesAgreement closed')
        this.$route.meta.refresh = true
      }
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
