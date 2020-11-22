import { request } from './request'

// ### 1.4.2. 左侧菜单权限
export function GetMenus() {
  return request({
      url: 'menus',
      method: 'get'
  })
}