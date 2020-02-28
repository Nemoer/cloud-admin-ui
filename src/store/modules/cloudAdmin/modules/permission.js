import { PermissionSave } from '@api/permission/permission'

export default {
  namespaced: true,
  actions: {
    /**
     * 权限新增
     * @param dispatch
     * @param url
     * @param data
     */
    permissionSave ({ dispatch }, { url, data } = {}) {
      return new Promise((resolve, reject) => {
        PermissionSave(url, data).then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
