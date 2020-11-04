import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/oauth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/oauth/logout',
    method: 'post'
  })
}

export function updatePassword(oldPwd, newPwd) {
  return request({
    url: '/auth/oauth/updatePassword',
    method: 'get',
    params: { oldPwd, newPwd }
  })
}

export function getUsersUnderSameMerchant(merchantNo) {
  return request({
    url: '/foundation/portal/user/getUsersUnderSameMerchant',
    method: 'get',
    params: { merchantNo }
  })
}

export function create(data) {
  return request({
    url: '/foundation/portal/user/create',
    method: 'post',
    data
  })
}

export function getSubUsers(pid) {
  return request({
    url: '/foundation/portal/user/getSubUsers',
    method: 'get',
    params: { pid }
  })
}

export function getUserByUserName(userName) {
  return request({
    url: '/foundation/portal/user/getByUserName',
    method: 'get',
    params: { userName }
  })
}

export function getUsersByQuery(data) {
  return request({
    url: '/foundation/portal/user/getUsersByQuery',
    method: 'post',
    data
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/foundation/portal/user/updateUserInfo',
    method: 'post',
    data
  })
}

