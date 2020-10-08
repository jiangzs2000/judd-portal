import request from '@/utils/request'

export function myPSAs(data) {
  return request({
    url: '/foundation/portal/psa/myPSAs',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/foundation/portal/psa/update',
    method: 'post',
    data
  })
}
