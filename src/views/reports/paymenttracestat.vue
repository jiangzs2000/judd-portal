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
              <el-select v-model="requestForm.state" clearable style="width:90%">
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
              <el-select v-model="requestForm.merNo" filterable clearable placeholder="请选择" style="width:90%">
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
    <div class="report-block">
      <div id="chart" style="width:100%;height:500px;" />
    </div>
  </div>
</template>

<script>
import { subMerchants } from '@/api/merchant'
import { statPaymentTraceByQuery } from '@/api/orders'
import echarts from 'echarts'

export default {
  name: 'FundInOrderList',
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
          label: '支付成功'
        },
        {
          value: 'P',
          label: '处理中'
        },
        {
          value: 'F',
          label: '失败'
        }
      ],
      merList: [],
      chart: null,
      requestForm: {
        startDate: '',
        endDate: '',
        state: '',
        merNo: '',
        merNos: []
      },
      option: {
        backgroundColor: '#344b58',
        title: {
          text: '支付流水报表',
          x: '20',
          left: '45%',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['总笔数', '总交易金额', '总结算金额']
        },
        calculable: true,
        dataset: {
          dimensions: ['day', 'count', 'totalAmount', 'totalSettleAmt'],
          source: []
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 10,
            rotate: 40
          }
        }],
        yAxis: [{
          type: 'value',
          name: '笔数',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }, {
          type: 'value',
          name: '金额（元）',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 10,
          start: 0,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '总笔数',
            type: 'line',
            stack: 'total',
            symbolSize: 2,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            yAxisIndex: 0
          }, {
            name: '总交易金额',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            yAxisIndex: 1
          },

          {
            name: '总结算金额',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            yAxisIndex: 1
          }
        ]
      }
    }
  },
  mounted() {
    console.log('mounted')
    subMerchants().then(res => {
      if (res.code === '0000') {
        this.merList = res.data.list
        this.chart = echarts.init(document.getElementById('chart'))
        this.stat(this.requestForm)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    onSubmit() {
      console.log('onsubmit')
      this.stat(this.requestForm)
    },
    stat(data) {
      this.requestForm.merNos = []
      if (this.requestForm.merNo === '') {
        this.merList.forEach(item => {
          this.requestForm.merNos.push(item.no)
        })
      }
      statPaymentTraceByQuery(data).then(res => {
        if (res.code === '0000') {
          this.option.dataset.source = res.data == null ? [] : res.data
          // 横坐标控制在20个刻度
          this.option.xAxis[0].axisLabel.interval = Math.round(this.option.dataset.source.length / 20)
          this.chart.setOption(this.option)
        }
      }).catch(err => {
        console.log(err)
      })
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
  ::v-deep .query-block {
    width: 100%;
  }
  ::v-deep .report-block {
    width: 100%;
  }
}
</style>
