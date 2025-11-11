# 平台登录适配器使用说明

## 如何添加新的平台登录

1. 在 `services/platforms/` 目录下创建新的平台适配器文件，例如 `weixin.js`
2. 实现以下方法：
   - `silentLogin()` - 静默登录
   - `checkLoginStatus()` - 检查登录状态
   - `getUserInfo()` - 获取用户信息
   - `logout()` - 退出登录

3. 在 `services/platforms/index.js` 中注册新平台：
```javascript
import WeixinLogin from './weixin.js'

const platformMap = {
  alipay: AlipayLogin,
  weixin: WeixinLogin, // 添加新平台
}
```

4. 在 `utils/login.js` 中添加平台判断：
```javascript
// #ifdef MP-WEIXIN
this.platformLogin = getPlatformLogin('weixin')
// #endif
```

## 使用示例

在页面中使用登录服务：

```javascript
import loginService from '@/utils/login.js'

export default {
  onLoad() {
    // 监听登录成功事件
    uni.$on('loginSuccess', (data) => {
      console.log('登录成功:', data)
      // 更新页面数据
    })
    
    // 检查登录状态
    this.checkLogin()
  },
  methods: {
    async checkLogin() {
      const isLoggedIn = await loginService.checkLoginStatus()
      if (isLoggedIn) {
        const userInfo = await loginService.getUserInfo()
        console.log('用户信息:', userInfo)
      }
    },
    logout() {
      loginService.logout()
      // 跳转到登录页或其他操作
    }
  },
  onUnload() {
    // 移除事件监听
    uni.$off('loginSuccess')
  }
}
```

