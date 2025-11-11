/**
 * 权限管理工具类
 * 定义角色和权限常量
 */

// 角色类型
export const ROLE = {
  EMPLOYEE: 'employee',           // 员工
  MANAGER: 'manager'              // 驻场经理
}

// 权限标识
export const PERMISSION = {
  // 员工权限
  CONTRACT: 'contract',                    // 签约
  ADVANCE_APPLY: 'advance_apply',          // 借支申请
  DEDUCTION_APPLY: 'deduction_apply',      // 代扣申请
  RESIGN: 'resign',                        // 离职
  
  // 驻场经理权限
  PENDING_RECEIVE: 'pending_receive',      // 待接收
  PENDING_ENTRY: 'pending_entry',          // 待入职
  SUPPLEMENT_INFO: 'supplement_info',      // 补录信息
  MANAGER_RESIGN: 'manager_resign',        // 离职
  AUDIT_ADVANCE: 'audit_advance',          // 审核借支
  CONFIRM_BANK_CARD: 'confirm_bank_card',  // 员工银行卡确认
  CONFIRM_SALARY: 'confirm_salary',// 员工工资确认
  
  // 公共权限
  UPLOAD_ID_CARD: 'upload_id_card',        // 上传身份证照片
  
}

// 角色权限映射
export const ROLE_PERMISSIONS = {
  [ROLE.EMPLOYEE]: [
    PERMISSION.CONTRACT,
	PERMISSION.UPLOAD_ID_CARD,
    PERMISSION.ADVANCE_APPLY,
    PERMISSION.DEDUCTION_APPLY,
    PERMISSION.RESIGN,
  ],
  [ROLE.MANAGER]: [
    PERMISSION.PENDING_RECEIVE,
    PERMISSION.PENDING_ENTRY,
    PERMISSION.UPLOAD_ID_CARD,
    PERMISSION.SUPPLEMENT_INFO,
    PERMISSION.MANAGER_RESIGN,
    PERMISSION.AUDIT_ADVANCE,
    PERMISSION.CONFIRM_BANK_CARD,
    PERMISSION.CONFIRM_SALARY
  ]
}

// 功能菜单配置
export const MENU_CONFIG = {
  [PERMISSION.CONTRACT]: {
    name: '签约',
    icon: '📝',
    path: '/pages/employee/contract'
  },
  [PERMISSION.ADVANCE_APPLY]: {
    name: '借支申请',
    icon: '💰',
    path: '/pages/employee/advance-apply'
  },
  [PERMISSION.DEDUCTION_APPLY]: {
    name: '代扣申请',
    icon: '💳',
    path: '/pages/employee/deduction-apply'
  },
  [PERMISSION.RESIGN]: {
    name: '离职',
    icon: '👋',
    path: '/pages/employee/resign'
  },
  [PERMISSION.PENDING_RECEIVE]: {
    name: '待接收',
    icon: '📥',
    path: '/pages/manager/pending-receive'
  },
  [PERMISSION.PENDING_ENTRY]: {
    name: '待入职',
    icon: '📋',
    path: '/pages/manager/pending-entry'
  },
  [PERMISSION.UPLOAD_ID_CARD]: {
    name: '上传身份证',
    icon: '🆔',
    path: '/pages/common/upload-id-card'
  },
  [PERMISSION.SUPPLEMENT_INFO]: {
    name: '补录信息',
    icon: '📝',
    path: '/pages/manager/supplement-info'
  },
  [PERMISSION.MANAGER_RESIGN]: {
    name: '离职',
    icon: '👋',
    path: '/pages/manager/resign'
  },
  [PERMISSION.AUDIT_ADVANCE]: {
    name: '审核借支',
    icon: '✅',
    path: '/pages/manager/audit-advance'
  },
  [PERMISSION.CONFIRM_BANK_CARD]: {
    name: '员工银行卡确认',
    icon: '💳',
    path: '/pages/manager/confirm-bank-card'
  },
  [PERMISSION.CONFIRM_SALARY]: {
    name: '员工工资确认',
    icon: '💰',
    path: '/pages/manager/confirm-salary'
  }
}

/**
 * 获取用户权限列表
 * @param {String} role 用户角色
 * @returns {Array} 权限列表
 */
export function getUserPermissions(role) {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * 检查用户是否有某个权限
 * @param {String} role 用户角色
 * @param {String} permission 权限标识
 * @returns {Boolean}
 */
export function hasPermission(role, permission) {
  const permissions = getUserPermissions(role)
  return permissions.includes(permission)
}

// 功能开放状态配置
// 只开放的功能设为 true，未开放的功能设为 false
export const FEATURE_ENABLED = {
  // 员工功能
  [PERMISSION.CONTRACT]: true,              // 签约 - 已开放
  [PERMISSION.UPLOAD_ID_CARD]: true,        // 上传身份证照片 - 已开放
  [PERMISSION.ADVANCE_APPLY]: false,        // 借支申请 - 未开放
  [PERMISSION.DEDUCTION_APPLY]: false,      // 代扣申请 - 未开放
  [PERMISSION.RESIGN]: false,               // 离职 - 未开放
  
  // 驻场经理功能
  [PERMISSION.PENDING_RECEIVE]: false,      // 待接收 - 未开放
  [PERMISSION.PENDING_ENTRY]: false,        // 待入职 - 未开放
  [PERMISSION.UPLOAD_ID_CARD]: true,        // 上传身份证照片 - 已开放
  [PERMISSION.SUPPLEMENT_INFO]: false,      // 补录信息 - 未开放
  [PERMISSION.MANAGER_RESIGN]: false,       // 离职 - 未开放
  [PERMISSION.AUDIT_ADVANCE]: false,        // 审核借支 - 未开放
  [PERMISSION.CONFIRM_BANK_CARD]: false,    // 员工银行卡确认 - 未开放
  [PERMISSION.CONFIRM_SALARY]: false        // 员工工资确认 - 未开放
}

/**
 * 检查功能是否开放
 * @param {String} permission 权限标识
 * @returns {Boolean}
 */
export function isFeatureEnabled(permission) {
  return FEATURE_ENABLED[permission] === true
}

/**
 * 根据角色获取功能菜单
 * @param {String} role 用户角色
 * @returns {Array} 菜单列表，包含 enabled 字段标识是否开放
 */
export function getMenuList(role) {
  const permissions = getUserPermissions(role)
  return permissions.map(permission => ({
    permission,
    ...MENU_CONFIG[permission],
    enabled: isFeatureEnabled(permission) // 添加功能开放状态
  }))
}

/**
 * 获取角色名称
 * @param {String} role 角色标识
 * @returns {String} 角色名称
 */
export function getRoleName(role) {
  const roleNames = {
    [ROLE.EMPLOYEE]: '员工',
    [ROLE.MANAGER]: '驻场经理'
  }
  return roleNames[role] || '未知'
}

