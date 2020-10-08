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

export function getUsersUnderSameMerchant() {
  return request({
    url: '/foundation/portal/user/getUsersUnderSameMerchant',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/foundation/portal/user/create',
    method: 'post',
    data
  })
}

export function getUserByUserName(userName) {
  return request({
    url: '/foundation/portal/user/getByUserName',
    method: 'get',
    params: { userName }
  })
}

export function getSubUsers(data) {
  return request({
    url: '/foundation/portal/user/getSubUsers',
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

