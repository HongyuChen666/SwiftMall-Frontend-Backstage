import { ElLoading } from 'element-plus'
import router from '@/router'
// import store from '@/store'
import { TOKEN } from '@/pinia/modules/app'
import { nextTick } from 'vue'
import { useApp } from './pinia/modules/app'
import { useAccount } from './pinia/modules/account'
import { useMenus } from './pinia/modules/menu'

const getPageTitle = title => {
  const { title: appTitle } = useApp()
  if (title) {
    return `${title} - ${appTitle}`
  }
  return appTitle
}

// Whitelist containing the `name` of routing objects
const WhiteList = ['login', 'lock']

let loadingInstance = null

// route guards
router.beforeEach(async to => {
  loadingInstance = ElLoading.service({
    lock: true,
    // text: 'Loading data, please wait',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  if (WhiteList.includes(to.name)) {
    return true
  }
  if (!window.localStorage[TOKEN]) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath, // `redirect` means that after logging in, the user can be redirected to the page specified by `redirect`
      },
      replace: true,
    }
  } else {
    const { userinfo, getUserinfo } = useAccount()
    // Retrieve user role information and determine permissions based on the roles
    if (!userinfo) {
      try {
        // Retrieve user information
        await getUserinfo()
      } catch (err) {
        loadingInstance.close()
        return false
      }

      return to.fullPath
    }

    // Generate menus (if the project has dynamic menus, dynamic routes will be added here)
    const { menus, generateMenus } = useMenus()
    if (menus.length <= 0) {
      try {
        await generateMenus()
        return to.fullPath // After adding dynamic routes, it is necessary to include this statement to trigger redirection, otherwise, it may result in a 404 error
      } catch (err) {
        loadingInstance.close()
        return false
      }
    }

    // Check whether the system is in a locked screen state
    if (to.name !== 'lock') {
      const { authorization } = useApp()
      if (!!authorization && !!authorization.screenCode) {
        return {
          name: 'lock',
          query: {
            redirect: to.path,
          },
          replace: true,
        }
      }
    }
  }
})

router.afterEach(to => {
  loadingInstance.close()
  if (router.currentRoute.value.name === to.name) {
    nextTick(() => {
      document.title = getPageTitle(!!to.meta && to.meta.truetitle)
    })
  }
})
