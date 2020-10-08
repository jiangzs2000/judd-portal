import request from '@/utils/request'

export function getBanksByMerchantType(type) {
  return request({
    url: '/foundation/openapi/bank/getBanksByMerchantType',
    method: 'get',
    params: { type }
  })
}
