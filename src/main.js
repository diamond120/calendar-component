/**
 * App Entry File
 * Workbetter-Duhs: A Powerfull Google Calendar Analytics Tool
 * Copyright 2019. All Rights Reserved
 * Created By: Calvin Flood
 */
import '@/helpers/progress'
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { VueExtendLayout, layout } from 'vue-extend-layout'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'
import VModal from 'vue-js-modal'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import VueTour from 'vue-tour'
import fullscreen from 'vue-fullscreen'
import '@/filters'
import $ from 'jquery'

// global components
import GlobalComponents from './globalComponents'

// router
import router from './router'

// store
import { store } from './store/store'

// include script file
import './lib/WorkbetterDuhsScript'

// include all css files
import './lib/WorkbetterDuhsCss'

// messages
import messages from './lang'

// session
import * as authenticator from '@/helpers/authenticator'
Object.defineProperty(Vue.prototype, '$authenticator', { value: authenticator })

// navigation guards before each
router.beforeEach(async (to, from, next) => {
    Nprogress.start()
    const loginRes = await authenticator.isLoggedIn()
    // const loginRes = store.getters.user
    if (to.matched.some(record => record.meta.requiresAuth) && !loginRes) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        Nprogress.done()
        return next({
            path: '/session/login',
            query: { redirect: to.fullPath },
        })
    }

    next() // make sure to always call next()!
})

// navigation guard after each
router.afterEach((to, from) => {
    Nprogress.done()
    setTimeout(() => {
        $('.v-content__wrap').scrollTop(0, 0)
        $('.app-boxed-layout .app-content').scrollTop(0, 0)
        $('.app-mini-layout .app-content').scrollTop(0, 0)
    }, 200)
})

function toast({ title, message, type, timeout, cb }) {
    return miniToastr[type](message, title, timeout, cb)
}

const options = {
    success: toast,
    error: toast,
    info: toast,
    warn: toast,
}

const toastTypes = {
    success: 'success',
    error: 'error',
    info: 'info',
    warn: 'warn',
}

miniToastr.init({ types: toastTypes })

// plugins
Vue.use(Vuetify, {
    theme: store.getters.selectedTheme.theme,
})
Vue.use(VueI18n)
Vue.use(VModal)
Vue.use(VueTour)
Vue.use(VueBreadcrumbs)
Vue.use(VueExtendLayout)
Vue.use(VueNotifications, options)
Vue.use(fullscreen)
Vue.use(GlobalComponents)

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: store.getters.selectedLocale.locale, // set locale
    messages, // set locale messages
})

/* eslint-disable no-new */
new Vue({
    store,
    el: '#app',
    i18n,
    router,
    ...layout,
})
