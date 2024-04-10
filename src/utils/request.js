import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useApp } from '@/pinia/modules/app'

const service = axios.create({
  baseURL: 'http://localhost:8501',
  timeout: 10000,
  withCredentials: true,
})


service.interceptors.request.use(
  config => {
    const { authorization } = useApp()
    if (authorization) {
      // config.headers.Authorization = `Bearer ${authorization.token}`
      // Place the token in the request header
      config.headers.token = `${authorization.token}`
    }
    return config
  },
  error => {
    // console.log(error);
    return Promise.reject(error)
  }
)


service.interceptors.response.use(
 
  response => {
    const res = response.data
    if (res.code == 208) {
      const redirect = encodeURIComponent(window.location.href) 
      router.push(`/login?redirect=${redirect}`)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },

  async error => {

    if (error.response && error.response.status === 401) {

      const { authorization, clearToken, setToken } = useApp()
      if (!authorization || !authorization.refresh_token) {
        if (router.currentRoute.value.name === 'login') {
          return Promise.reject(error)
        }
        const redirect = encodeURIComponent(window.location.href)
        router.push(`/login?redirect=${redirect}`)
      
        clearToken()
        setTimeout(() => {
          ElMessage.closeAll()
          try {
            ElMessage.error(error.response.data.msg)
          } catch (err) {
            ElMessage.error(error.message)
          }
        })
      
        return Promise.reject(error)
      }
  
      try {
        const res = await axios({
          method: 'PUT',
          url: '/api/authorizations',
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${authorization.refresh_token}`,
          },
        })
    
        setToken({
          token: res.data.data.token, 
          refresh_token: authorization.refresh_token, 
        })
    
        return service(error.config)
      } catch (err) {
      
        const redirect = encodeURIComponent(window.location.href)
        router.push(`/login?redirect=${redirect}`)
      
        clearToken()
        return Promise.reject(error)
      }
    }

    // console.dir(error)
    ElMessage.closeAll()
    try {
      ElMessage.error(error.response.data.msg)
    } catch (err) {
      ElMessage.error(error.message)
    }

    return Promise.reject(error)
  }
)

export default service
