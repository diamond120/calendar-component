import Nprogress from 'nprogress'
import amplitudeWrapper from 'amplitude-js'
import AppConfig from '@/constants/AppConfig'

const amplitude = amplitudeWrapper.getInstance()

amplitude.init(
    AppConfig.AmplitudeToken,
    null,
    {
        includeReferrer: true,
        includeUtm: true,
        includeGclid: true,
    },
    () => {
        console.log('Amplitude client init complete')
    }
)

async function event(name, ep = {}) {
    if (process.env.NODE_ENV === 'development') {
        return console.log('Amplitude:', name, ep)
    }
    Nprogress.start()
    amplitude.logEvent(name, ep, Nprogress.done)
}

function updateUserProperties(user, props) {
    if (process.env.NODE_ENV === 'development') {
        return console.log('Amplitude: Updated User Props', user, props)
    }

    let up = {}
    let uid = null
    if (user) {
        up = {
            email_address: user.email,
            ...props,
        }
        uid = user.username
    }
    amplitude.setUserId(uid)
    amplitude.setUserProperties(up)
}

const actions = {
    signUpInitiated(context, provider) {
        event('Sign-up Initiated', { integration_choosen: provider })
    },
    signUpCompleted() {
        event('Sign-up Completed')
    },
    calendarIntegration(context, { provider, authorization }) {
        event('Calendar Integration Authorization', {
            integration_choosen: provider,
            authorization,
        })
    },
    viewDashboard(context, { dashboard, dateRange, origin = 'Unknown' }) {
        event(`View ${dashboard} Dashboard`, {
            access_origin: origin,
            date_range_of_report: dateRange,
        })
    },
    dateRangeChanged(context, { dashboard, direction }) {
        event(`Dashboard Date Range Changed`, {
            dashboard_name: dashboard,
            change_direction: direction,
        })
    },
}

// mutations
const mutations = {
    userPropsLoaded(state, data = {}) {
        const { user, props } = data
        updateUserProperties(user, props)
    },
    logoutUser(state, user) {
        amplitude.setUserId(user.id)
        event('User Logged Out')
    },
    onSignupCompleted(state, user) {
        amplitude.setUserId(user.id)
    },
}

export default {
    actions,
    mutations,
}
