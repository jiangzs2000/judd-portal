<template>
  <div class="app-container">
    <aside>
      <ol type="I">
        <li><h3>上送资料</h3></li>
        <ol>
          <li>“平台用户”通过金融后台页面提交资料</li>
          <li>平台下属的子户进件：通过API接口提交资料，接口中增加 “提现规则”一栏（必传字段）,此商户不具有收单功能（费率与 平台用户 一致）</li>
          <li>PS：提供子户手动提现的API接口，当配置为“手动提现”时可由“平台商户”自行调用,若配置为自动提现，则不可调用手动提现接口。</li>
        </ol>
        <li><h3>生成ID</h3></li>
        <ol>
          <li>第一次上送资料时即“水滴商户ID”</li>
        </ol>
        <li><h3>审核</h3></li>
        <ol>
          <li>基础信息、绑卡信息 全部通过则视为审核通过</li>
          <li>审核通过后的商户才流转至其他页面。</li>
        </ol>
        <li><h3>修改/重新提交</h3></li>
        <ol>
          <li>审核失败时 再次提交时：若联动返回user id ：    则沿用原有“商户ID”;若联动未返回user id ：则重新提交时生成新“商户ID”</li>
          <li>可修改的信息依照联动为准。</li>
        </ol>
      </ol>
    </aside>
  </div>
</template>

<script>

export default {
  name: 'Tips'
}
</script>
