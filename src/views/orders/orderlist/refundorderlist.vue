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
            <el-form-item prop="state" label="状态：">
              <el-select v-model="requestForm.state" clearable style="width:100%">
                <el-option
                  v-for="(item, index) in stateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户：">
              <el-select v-model="requestForm.merNo" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in merList"
                  :key="index"
                  :label="item.merchantName"
                  :value="item.no"
                />
              </el-select>
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
    <div v-if="total > 0" style="margin:5px;">
      <span class="query-stat">查询统计</span><span class="stat-block">交易笔数共：{{ count }}笔</span> <span class="stat-block">交易金额共：{{ totalAmount | F2Y() }}元</span>
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
          prop="merOrderNo"
          label="商户订单号"
        />
        <el-table-column
          prop="orderNo"
          label="平台订单号"
        />
        <el-table-column
          prop="oriOrderNo"
          label="原平台订单"
        />
        <el-table-column
          prop="oriMerTrace"
          label="原商户支付流水"
        />
        <el-table-column
          prop="merNo"
          label="发起商户"
        />
        <el-table-column
          prop="amount"
          label="金额(元)"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.amount | F2Y() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stateName"
          label="状态"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDetial(scope.row)">详情</el-button>
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
import { myMerchants } from '@/api/merchant'
import { getRefundOrdersByQuery } from '@/api/orders'
import { PAGE_SIZE } from '@/constants/constants'

export default {
  name: 'RefundOrderList',
  data() {
    return {
      merchantTypeNames: ['', '个人', '个体', '企业'],
      stateList: [
        {
          value: 'I',
          label: '初始'
        },
        {
          value: 'S',
          label: '退款成功'
        },
        {
          value: 'P',
          label: '处理中'
        },
        {
          value: 'F',
          label: '退款失败'
        }
      ],
      merList: [],
      tableData: [],
      count: 0, // 总
      total: 0, // 总页数
      totalAmount: 0, // 总
      totalFeeAmount: 0,
      requestForm: {
        startDate: '',
        endDate: '',
        state: '',
        merNo: '',
        merNos: [],
        pageSize: PAGE_SIZE,
        page: 1
      }
    }
  },
  mounted() {
    myMerchants().then(res => {
      if (res.code === '0000') {
        this.merList = res.data.list
      } else {
        console.log('myMerchants return ', res.code, res.msg)
      }
    }).catch(err => {
      console.log(err)
    })
    // this.query(this.requestForm)
    console.log('register listener')
    this.$bus.$on('closeSelectedTag', this.closeEventHandler)
  },
  activated() {
    console.log('activated')
    if (this.$route.meta.refresh) {
      this.tableData = []
      this.count = 0
      this.total = 0
      this.totalAmount = 0
      this.totalFeeAmount = 0
      this.requestForm.startDate = ''
      this.requestForm.endDate = ''
      this.requestForm.state = ''
      this.requestForm.merNo = ''
      this.requestForm.page = 1
      this.$route.meta.refresh = false
    }
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
      this.requestForm.merNos = []
      if (this.requestForm.merNo === '') {
        this.merList.forEach(item => {
          this.requestForm.merNos.push(item.no)
        })
      }
      this.query(this.requestForm)
    },
    query(data) {
      getRefundOrdersByQuery(data).then(res => {
        if (res.code === '0000') {
          this.tableData = res.data == null || res.data.list == null ? [] : res.data.list
          this.count = res.data.count
          this.totalAmount = res.data.totalAmount
          this.totalFeeAmount = res.data.totalFeeAmount
          this.tableData.forEach(element => {
            this.stateList.forEach(state => {
              if (state.value === element.state) {
                element.stateName = state.label
              }
            })
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
    viewDetial(row) {
      // console.log('row', row)
      this.$router.push({ name: 'RefundOrderDetail', params: { orderNo: row.orderNo }})
    },
    closeEventHandler(event) {
      // console.log('closeEventHandler', event)
      if (event.name === 'RefundOrderList') {
        console.log('RefundOrderList closed')
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
  ::v-deep .query-stat {
    margin:10px;
    font-size: 20px;
  }
  ::v-deep .stat-block {
    margin: 10px;
    border:1px solid rgb(218, 218, 221);
    border-radius: 5px;
    padding: 5px;
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
