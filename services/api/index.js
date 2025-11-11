/**
 * API 接口统一入口
 * 根据功能模块导出不同的 API
 */

// 认证相关 API
export * from './auth.js'

// 签约相关 API
export * from './contract.js'

// 用户相关 API
export * from './user.js'

// 订单相关 API
// export * from './order.js'

// 商品相关 API
// export * from './product.js'

// 导出 request 方法，方便其他地方直接使用
export { request,uploadFile } from '../request.js'

// 默认导出，包含所有 API 模块
import * as auth from './auth.js'
import * as contract from './contract.js'
import * as user from './user.js'
// import * as order from './order.js'
// import * as product from './product.js'

export default {
	// 认证相关
	auth,
	// 签约相关
	contract,
	// 用户相关
	user,
	// 订单相关
	// order,
	// 商品相关
	// product,
}

