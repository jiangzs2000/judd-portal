import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import URLSafeBase64 from 'urlsafe-base64'

const state = {
  token: getToken(),
  name: '',
  avatar: 'https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png',
  introduction: '',
  roles: [],
  id: '',
  userName: '',
  merchantNo: '',
  pid: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_MERCHANTNO: (state, merchantNo) => {
    state.merchantNo = merchantNo
  },
  SET_PID: (state, pid) => {
    state.pid = pid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        console.log('loged in, got token: ', state.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      /* getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败, 请重新登录。')
        }
        console.log('getInfo:')// added by jzs
        console.log(data)// added by jzs
        const { roles, userName, avatar, introduction, id } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', userName)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_ID', id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })*/
      // fetch infos from jwt
      var user = JSON.parse(URLSafeBase64.decode(state.token.split('.')[1]))
      console.log(user)
      user.roles = JSON.parse(user.roles)
      const { id, name, username, roles, merchantno, pid } = user
      console.log('id, name, username, roles, merchantno, pid', id, name, username, roles, merchantno, pid)

      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_ID', id)
      commit('SET_MERCHANTNO', merchantno)
      commit('SET_USERNAME', username)
      commit('SET_PID', pid)
      resolve(user)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        console.log('loged out')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
