import request from '@/utils/request'
// import { param } from '@/utils'

export function getMerchantRole(merchantNo) {
  return request({
    url: '/foundation/portal/merchant/getMerchantRole',
    method: 'get',
    params: { merchantNo }
  })
}

export function getMerchantByMerchantNo(merchantNo) {
  return request({
    url: '/foundation/portal/merchant/getMerchantByMerchantNo',
    method: 'get',
    params: { merchantNo }
  })
}

export function registerPerson(data) {
  return request({
    url: '/foundation/portal/FRA/register/person',
    method: 'post',
    data
  })
}

export function registerIndividual(data) {
  return request({
    url: '/foundation/portal/FRA/register/individual',
    method: 'post',
    data
  })
}

export function registerCompany(data) {
  return request({
    url: '/foundation/portal/FRA/register/company',
    method: 'post',
    data
  })
}

export function submit4Review(orderNo) {
  return request({
    url: '/foundation/portal/FRA/submit4Review',
    method: 'get',
    params: { orderNo }
  })
}

export function getFRAsByQuery(data) {
  return request({
    url: '/foundation/portal/FRA/getFRAsByQuery',
    method: 'post',
    data
  })
}

export function loadFRARequest(orderNo) {
  return request({
    url: '/foundation/portal/FRA/loadFRARequest',
    method: 'get',
    params: { orderNo }
  })
}

export function approve(orderNo) {
  return request({
    url: '/foundation/portal/FRA/approve',
    method: 'get',
    params: { orderNo }
  })
}

export function reject(orderNo, remark) {
  return request({
    url: '/foundation/portal/FRA/reject',
    method: 'get',
    params: { orderNo, remark }
  })
}

export function myMerchants(data) {
  return request({
    url: '/foundation/portal/merchant/myMerchants',
    method: 'post',
    data
  })
}

export function subMerchants(data) {
  return request({
    url: '/foundation/portal/merchant/subMerchants',
    method: 'post',
    data
  })
}
export function getPubkey() {
  return request({
    url: '/foundation/portal/merkey/getPubKey',
    method: 'get'
  })
}

export function upsertPubkey(data) {
  return request({
    url: '/foundation/portal/merkey/upsert',
    method: 'post',
    data
  })
}

export function getMersByCreateUsers(userList) {
  return request({
    url: '/foundation/portal/merchant/getMersByCreateUsers',
    method: 'get',
    param: { userList }
  })
}

export function getMerDetailByMerchantNo(merchantNo) {
  return request({
    url: '/foundation/portal/merchant/getMerDetailByMerchantNo',
    method: 'get',
    params: { merchantNo }
  })
}
