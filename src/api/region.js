import request from '@/utils/request'

export function getRegions() {
  return request({
    url: '/foundation/openapi/region/getRegions',
    method: 'get'
  })
}
