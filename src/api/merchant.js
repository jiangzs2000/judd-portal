import request from '@/utils/request'
// import { param } from '@/utils'

export function getCurrentMerchantType() {
  return request({
    url: '/foundation/portal/merchant/getCurrentMerchantType',
    method: 'get'
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
    url: '/foundation/portal/merchant/register/person',
    method: 'post',
    data
  })
}

export function registerIndividual(data) {
  return request({
    url: '/foundation/portal/merchant/register/individual',
    method: 'post',
    data
  })
}

export function registerCompany(data) {
  return request({
    url: '/foundation/portal/merchant/register/company',
    method: 'post',
    data
  })
}

export function bindMerchantCardOrder(data) {
  return request({
    url: '/foundation/portal/merchant/bindCard/order',
    method: 'post',
    data
  })
}

export function bindMerchantCardSubmit(data) {
  return request({
    url: '/foundation/portal/merchant/bindCard/confirm',
    method: 'post',
    data
  })
}

export function myRAs(data) {
  return request({
    url: '/foundation/portal/RA/myregistrationapplications',
    method: 'post',
    data
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
