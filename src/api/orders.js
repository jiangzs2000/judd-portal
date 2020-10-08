import request from '@/utils/request'

export function getFundInOrdersByQuery(data) {
  return request({
    url: '/bizengine/portal/fundin/query',
    method: 'post',
    data
  })
}

export function getPaymentTracesByQuery(data) {
  return request({
    url: '/bizengine/portal/payment/query',
    method: 'post',
    data
  })
}

export function getRefundOrdersByQuery(data) {
  return request({
    url: '/bizengine/portal/refund/query',
    method: 'post',
    data
  })
}

export function getWithdrawOrdersByQuery(data) {
  return request({
    url: '/bizengine/portal/withdraw/query',
    method: 'post',
    data
  })
}

export function getFundInOrderDetail(orderNo) {
  return request({
    url: '/bizengine/portal/fundin/orderdetail',
    method: 'get',
    params: { orderNo }
  })
}

export function getRefundOrderDetail(orderNo) {
  return request({
    url: '/bizengine/portal/refund/orderdetail',
    method: 'get',
    params: { orderNo }
  })
}

export function getWithidrawOrderDetail(orderNo) {
  return request({
    url: '/bizengine/portal/withdraw/orderdetail',
    method: 'get',
    params: { orderNo }
  })
}

export function getPaymentTraceDetail(trace) {
  return request({
    url: '/bizengine/portal/payment/traceDetail',
    method: 'get',
    params: { trace }
  })
}

export function statFundinOrderByQuery(data) {
  return request({
    url: '/bizengine/portal/fundin/stat',
    method: 'post',
    data
  })
}

export function statPaymentTraceByQuery(data) {
  return request({
    url: '/bizengine/portal/payment/stat',
    method: 'post',
    data
  })
}

export function statRefundOrderByQuery(data) {
  return request({
    url: '/bizengine/portal/refund/stat',
    method: 'post',
    data
  })
}

export function statWithdrawOrderByQuery(data) {
  return request({
    url: '/bizengine/portal/withdraw/stat',
    method: 'post',
    data
  })
}