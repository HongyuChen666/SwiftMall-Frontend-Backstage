<template>
  <dl>
    <dt>有以下两种方式设置页面不缓存：</dt>
    <dd>- 当前页面不设置name属性</dd>
    <dd>- 或者路由配置的meta增加noCache: true</dd>
  </dl>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'test-no-cache', // The `name` must be consistent with the name configured in the routing. If it is inconsistent or not set, caching will not be applied
  setup() {
    console.log('nocache')
  },
})
</script>
