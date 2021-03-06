import { uniqueId } from 'lodash'
// 设置文件
import setting from '@/setting.js'

/**
 * 给菜单数据补充上 path 字段
 * https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementMenuPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementMenuPath(e.children)
    } : {}
  }))
}

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} context
     * @param {Boolean} collapse is collapse
     */
    asideCollapseSet ({ state, dispatch }, collapse) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = collapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} context
     */
    asideCollapseToggle ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = !state.asideCollapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} context
     */
    asideCollapseLoad ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          defaultValue: setting.menu.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 设置menu
     * @param state
     * @param dispatch
     * @constructor
     */
    SetAside ({ state, dispatch }, aside) {
      return new Promise(async resolve => {
        // store 赋值
        state.aside = aside
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.aside',
          value: aside,
          user: true
        }, { root: true })
        resolve()
      })
    },
    /**
     * 获取menu
     * @param state
     * @param dispatch
     */
    getAside ({ state, dispatch, commit }) {
      return new Promise(async resolve => {
        state.aside = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.aside',
          defaultValue: [],
          user: true
        }, { root: true })
        // 应用
        commit('asideSet', state.aside)
        resolve()
      })
    }
  },
  mutations: {
    /**
     * @description 设置顶栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store 赋值
      state.header = supplementMenuPath(menu)
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store 赋值
      state.aside = supplementMenuPath(menu)
    }
  },
  method: {

    _objToStrMap (obj) {
      let strMap = new Map()
      for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k])
      }
      return strMap
    },
    /**
     *json转换为map
     */
    _jsonToMap (jsonStr) {
      return this._objToStrMap(JSON.parse(jsonStr))
    }
  }
}
