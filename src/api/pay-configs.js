import request from '@/utils/request'

export function addPayChannel(data) {
  return request({
    url: '/basic/payChannel/add', // origin commented by jzs:  url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getChannelsByCreator(userId) {
  return request({
    url: '/basic/channels/getChannelsByCreator', // origin commented by jzs:  url: '/vue-element-admin/user/login',
    method: 'get',
    params: { userId }
  })
}
