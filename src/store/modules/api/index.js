/**
 * Auth Module
 */
import Nprogress from 'nprogress'
import VueNotifications from 'vue-notifications'
import { get, post } from '@/helpers/api'
import router from '@/router'

// recap dummy data
import { recap } from './recap'
// planner dummy data
import { planner } from './planner'

function getFreshState() {
    return {
        importResult: null,
        recap: {},
        planner: {},
        calculatedBlocks: {},
        settings: {
            notifications: {
                email_wanalyzer: false,
                email_wplanner: false,
                email_manalyzer: false,
            },
        },
    }
}

const cache = {
    recap: {},
    planner: {},
}

const state = getFreshState()
let _unobservableState = {}

function refreshUnobservableState() {
    _unobservableState = {}
}

function ustate(key, value) {
    if (value === undefined) {
        return _unobservableState[key]
    }
    _unobservableState[key] = value
}

// getters
const getters = {
    importResult: state => {
        return state.importResult
    },
    recap: state => {
        return state.recap
    },
    planner: state => {
        return state.planner
    },
    calculatedBlocks: state => {
        return state.calculatedBlocks
    },
    settings: state => {
        return state.settings
    },
}

// actions
const actions = {
    async importEvents(context) {
        try {
            if (ustate('import')) {
                return
            }

            ustate('import', 1)
            const res = await get('/calendar/import')
            context.commit('onImportCompleted', !!(res && !res.errors))
            ustate('import', 2)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e || 'Unexpected error',
            })
            console.error(e)
            context.commit('onImportCompleted', false)
            ustate('import', 0)
        }
        router.push({ name: 'home' })
    },
    async loadWAnalyzer(context, offset) {
        try {
            if (cache.recap[offset]) {
                context.commit('recapLoaded', cache.recap[offset])
                return
            }

            if (ustate(`recap.${offset}`)) {
                return
            }

            context.commit('recapLoaded', {})

            ustate(`recap.${offset}`, 1)
            Nprogress.start()

            // get recap dummy data from temp file
            context.commit('recapLoaded', recap)
            cache.recap[offset] = recap

            // get recap real data from back-end
            // const { recap } = await get('/reports/recap', { offset })
            // context.commit('recapLoaded', recap)
            // cache.recap[offset] = recap

            ustate(`recap.${offset}`, 2)
        } catch (e) {
            ustate(`recap.${offset}`, 0)
            VueNotifications.error({
                message: e.message || e || e.errorMessage || 'Unexpected error',
            })
            console.error(e)
        }
        Nprogress.done()
    },
    async loadWPlanner(context, offset) {
        try {
            if (cache.planner[offset]) {
                context.commit('plannerLoaded', cache.planner[offset])
                return
            }

            if (ustate(`planner.${offset}`)) {
                return
            }

            context.commit('plannerLoaded', {})

            ustate(`planner.${offset}`, 1)
            Nprogress.start()

            // get planner dummy data from temp file
            context.commit('plannerLoaded', planner)
            cache.planner[offset] = planner

            // get planner real data from back-end
            // const { planner } = await get('/reports/planner', { offset })
            // context.commit('plannerLoaded', planner)
            // cache.planner[offset] = planner

            ustate(`planner.${offset}`, 2)
        } catch (e) {
            // process error
            ustate(`planner.${offset}`, 0)
            VueNotifications.error({
                message: e.message || e || e.errorMessage || 'Unexpected error',
            })
            console.error(e)
        }
        Nprogress.done()
    },
    async getSettings(context) {
        try {
            if (ustate('settings')) {
                return
            }

            ustate('settings', 1)
            Nprogress.start()
            const res = await get('/reports/settings')
            context.commit('settingsLoaded', res)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e || 'Unexpected error',
            })
            console.error(e)
        }
        ustate('settings', 0)
        Nprogress.done()
    },
    async setSettings(context, settings) {
        try {
            if (ustate('settings2')) {
                return
            }

            ustate('settings2', 1)
            Nprogress.start()
            await post('/reports/settings', settings)
            context.commit('settingsLoaded', settings)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e || e.errorMessage || 'Unexpected error',
            })
            console.error(e)
        }
        ustate('settings2', 0)
        Nprogress.done()
    },
}

// mutations
const mutations = {
    onImportCompleted(state, result) {
        state.importResult = result
    },
    recapLoaded(state, recap) {
        state.recap = recap
    },
    plannerLoaded(state, planner) {
        state.planner = planner
    },
    logoutUser(state) {
        const fresh = getFreshState()
        for (const k of Object.keys(fresh)) {
            state[k] = fresh[k]
        }
        refreshUnobservableState()
    },
    calculatedBlocks(state, value) {
        state.calculatedBlocks = value
    },
    settingsLoaded(state, value) {
        state.settings = value
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
