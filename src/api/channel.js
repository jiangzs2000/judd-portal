import request from '@/utils/request'

export function getAllPayChannel3rds() {
  return request({
    url: '/foundation/portal/paychannel3rd/getAllPayChannel3rds',
    method: 'get'
  })
}

export function myCRAs(data) {
  return request({
    url: '/foundation/portal/CRA/mychannelregistrationapplications',
    method: 'post',
    data
  })
}

export function channelProvision(merchantNo, channelCode) {
  return request({
    url: '/foundation/portal/CRA/channelProvision',
    method: 'get',
    params: { merchantNo, channelCode }
  })
}

export function bindMerchantCardOrder(data) {
  return request({
    url: '/foundation/portal/CRA/bindCard/order',
    method: 'post',
    data
  })
}

export function bindMerchantCardSubmit(data) {
  return request({
    url: '/foundation/portal/CRA/bindCard/confirm',
    method: 'post',
    data
  })
}

