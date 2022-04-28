/**
 * Auth Module
 */
import Nprogress from 'nprogress'
import VueNotifications from 'vue-notifications'
import router from '@/router'
import { store } from '../../store'
import { subscribe, signOut, signUp } from '@/helpers/authenticator'

const state = {
    user: JSON.parse(localStorage.getItem('userId')),
    token: JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')).accessToken : null,
    signupResult: null,
    writeAccessRequired: false,
    loginError: null,
}

subscribe((err, session) => {
    if (err) return store.commit('onLoginError', err)
    if (session && store.getters.token === session.token.accessToken) return
    store.commit('onSessionUpdate', session)
    // const { user } = session || {}
    // if (user && !store.getters.userProps) {
    //     store.dispatch('loadUserProps')
    // }
})

// getters
const getters = {
    user: state => {
        return state.user
    },
    token: state => {
        return state.token
    },
    signupResult: state => {
        return state.signupResult
    },
    writeAccessRequired: state => {
        return state.writeAccessRequired
    },
    loginError: state => {
        return state.loginError
    },
}

// actions
const actions = {
    async signupUser(context, code) {
        try {
            await signUp(code)
            context.commit('onSignupCompleted', true)
            context.commit('writeAccessRequired', false)
            context.commit('onLoginError', null)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e.error || e || 'Unexpected error',
            })
            console.error(e)
            context.commit('onSignupCompleted', false)
        }
    },
    async logoutUser(context) {
        Nprogress.start()
        try {
            const { user } = context.state
            await signOut()
            context.commit('logoutUser', user)
            router.push('/session/login')
        } catch (e) {
            VueNotifications.error({
                message: e.message || e.error || e || 'Unexpected error',
            })
            console.error(e)
        }
        Nprogress.done()
    },
}

// mutations
const mutations = {
    logoutUser(state) {
        localStorage.removeItem('userId')
        state.user = null
        state.token = null
        state.signupResult = null
    },
    onSessionUpdate(state, session) {
        if (!session) {
            localStorage.removeItem('userId')
            state.user = null
            state.token = null
            state.signupResult = null
            return
        }
        state.token = session.token.accessToken
        state.user = session.user
        localStorage.setItem('userId', JSON.stringify(state.user))
        localStorage.setItem('token', JSON.stringify(session.token))
        const { IntercomPromise } = window
        if (IntercomPromise) {
            IntercomPromise.then(() =>
                window.Intercom('update', {
                    email: state.user.email,
                    user_id: state.user.id,
                    name: state.user.name,
                })
            )
        }
        Nprogress.doneAll()
    },
    onSignupCompleted(state, res) {
        state.signupResult = res
    },
    writeAccessRequired(state, val) {
        state.writeAccessRequired = !!val
    },
    onLoginError(state, err) {
        state.loginError = err
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
