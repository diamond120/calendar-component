import { menus } from './data'

const state = {
    menus,
    userSettingOpened: false,
}

const getters = {
    menus: state => {
        return state.menus
    },
    userSettingOpened: state => state.userSettingOpened,
}

const actions = {
    setActiveMenuGroup(context, payload) {
        context.commit('setActiveMenuGroupHandler', payload)
    },
}

const mutations = {
    setActiveMenuGroupHandler(state, router) {
        for (const category in state.menus) {
            for (const menuGroup in state.menus[category]) {
                if (state.menus[category][menuGroup].items !== null) {
                    for (const matched in state.menus[category][menuGroup].items) {
                        if (state.menus[category][menuGroup].items[matched].route === router.name) {
                            state.menus[category][menuGroup].active = true
                        }
                    }
                }
            }
        }
    },
    userSettingOpened(state, val) {
        state.userSettingOpened = val
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
