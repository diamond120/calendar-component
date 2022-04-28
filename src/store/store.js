import Vue from 'vue'
import Vuex from 'vuex'

// modules
import auth from './modules/auth'
import settings from './modules/settings'
import sidebar from './modules/sidebar'
import api from './modules/api'
import stats from './modules/stats'

// plugins
import createLogger from '@/lib/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const plugins = []

export const store = new Vuex.Store({
    modules: {
        auth,
        sidebar,
        settings,
        stats,
        api,
    },
    strict: debug,
    plugins: debug ? plugins.concat([createLogger()]) : plugins,
})
