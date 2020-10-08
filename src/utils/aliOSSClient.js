import OSS from 'ali-oss'

export function ossClient(aliOSSConfig) {
  // 后端提供数据
  return new OSS({
    region: aliOSSConfig.region, // oss-cn-beijing-internal.aliyuncs.com
    accessKeyId: aliOSSConfig.accessKeyId,
    accessKeySecret: aliOSSConfig.accessKeySecret,
    bucket: aliOSSConfig.bucket
  })
}
