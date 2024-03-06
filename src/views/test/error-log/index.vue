<template>
  <div class="errPage-container">
    <ErrorA />
    <ErrorB />
    <h2>This page is for testing error logging functionality</h2>
    <h4>
      This page intentionally throws an error (any errors occurring on this page will be logged). Now you can click on the 'debugger' icon in the top right corner to view the error log
    </h4>
    <div>
      You can report errors to the server by modifying the `addErrorLog` method in `store/modules/errorLog.js`
    </div>
    <br />
    <div>
      If your project doesn't require error logging functionality, you need to set the 'flag' variable to false in `src/error-log.js`
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import ErrorA from './components/ErrorTestA.vue'
import ErrorB from './components/ErrorTestB.vue'
import { TestError } from '@/api/test'

export default defineComponent({
  name: 'test-error-log',
  components: { ErrorA, ErrorB },
  setup() {
    onMounted(async () => {
      await TestError() // This interface throws a 500 internal server error
    })
  },
})
</script>

<style scoped>
.errPage-container {
  padding: 30px;
}
</style>
