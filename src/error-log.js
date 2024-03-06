import { nextTick } from 'vue'
import { useErrorlog } from './pinia/modules/errorLog'
// import store from '@/store'

// Determine the environment to decide whether to enable error monitoring
//   - import.meta.env.DEV ----Boolean value, representing the development environment
//   - import.meta.env.PROD ----Boolean value, representing the production environment.

// const flag =  import.meta.env.PROD  // Error monitoring is only conducted in the production environment
const flag = true // Error monitoring is enabled by default

export default app => {
  if (flag) {
    app.config.errorHandler = function(err, vm, info) {
      nextTick(() => {
        useErrorlog().addErrorLog({
          err,
          // vm,
          info,
          url: window.location.href,
          id: Date.now(),
        })
        console.error(err, info)
      })
    }
  }
}
