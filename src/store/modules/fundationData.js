
const state = {
  provinceCityList: [],
  banks: []
}

const mutations = {
  SET_PROVINCECITYLIST: (state, provinceCityList) => {
    state.provinceCityList = provinceCityList
  },
  SET_BANKS: (state, banks) => {
    state.banks = banks
  }
}

const actions = {

  setProvinceCityList({ commit }, provinceCityList) {
    commit('SET_PROVINCECITYLIST', provinceCityList)
  },

  setBanks({ commit, banks }) {
    commit('SET_BANKS', banks)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
