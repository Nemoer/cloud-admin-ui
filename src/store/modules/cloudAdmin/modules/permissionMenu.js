import { PermissionMenByMenuId } from '@api/permission/permissionMenu'

export default {
  namespaced: true,
  actions: {
    /**
     * 根据菜单获取权限
     * @param dispatch
     * @param url
     * @param data
     */
    permissionMenuByMenuId ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionMenByMenuId(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
