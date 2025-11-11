/**
 * 签约相关 API
 */

import { request } from '../request.js'

/**
 * 创建签约任务
 * @param {Object} params 签约参数
 * @param {String} params.name 签约人姓名
 * @param {String} params.idCard 身份证号
 * @param {String} params.phone 联系电话
 * @param {String} params.date 签约日期
 * @returns {Promise<Object>} 返回签约任务信息，包含 taskId 等
 */
export function createContractTask(params) {
	return request({
		url: '/contract/create',
		method: 'POST',
		data: {
			name: params.name,
			idCard: params.idCard,
			phone: params.phone,
			date: params.date
		}
	})
}

/**
 * 查询签约状态
 * @param {String} taskId 签约任务ID
 * @returns {Promise<Object>}
 */
export function queryContractStatus(taskId) {
	return request({
		url: '/contract/status',
		method: 'GET',
		data: { taskId }
	})
}

/**
 * 获取签约详情
 * @param {String} taskId 签约任务ID
 * @returns {Promise<Object>}
 */
export function getContractDetail(taskId) {
	return request({
		url: '/contract/detail',
		method: 'GET',
		data: { taskId }
	})
}

