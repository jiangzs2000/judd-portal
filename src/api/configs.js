import request from '@/utils/request'

export function getAllPayWays() {
  return request({
    url: '/foundation/openapi/misc/getAllPayWays',
    method: 'post'
  })
}

export function getAliOSSConfigs() {
  return request({
    url: '/foundation/portal/misc/getAliOSSConfigs',
    method: 'post'
  })
}
