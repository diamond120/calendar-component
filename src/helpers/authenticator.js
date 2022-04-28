/* eslint no-undef: 0 */
import AppConfig from '@/constants/AppConfig'
import { post } from '@/helpers/api'

let googleUser

const subscribers = []
function subscribe(cb) {
    subscribers.push(cb)
}
function notify(err, session) {
    for (const s of subscribers) {
        s(err, session)
    }
}

async function onGoogleUserChange(user) {
    googleUser = user
}

async function workbetterduhsSignIn() {
    if (!googleUser || !googleUser.isSignedIn()) {
        notify(null, null)
        return
    }
    // const { id_token } = user.getAuthResponse()
    const profile = googleUser.getBasicProfile()
    const email = profile.getEmail()
    const password = `google:${googleUser.getId()}:${email}`
    try {
        const { message, errors, user, token } = await post('/auth/login', { email, password })
        if (errors && errors.length) {
            const e = new Error(message || 'Error')
            notify(e)
        }
        notify(null, { user, token })
        return user
    } catch (e) {
        if (e && (e === 'Incorrect email or password' || e === 'UserNotFoundException')) {
            await gapi.auth2.getAuthInstance().signOut()
        }
        notify(e)
        return
    }
}

const googleInitPromise = new Promise(resolve => {
    gapi.load('client:auth2', () => {
        gapi.client
            .init({
                apiKey: AppConfig.googleApiKey,
                clientId: AppConfig.googleClientId,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: 'profile',
            })
            .then(() => {
                gapi.auth2.getAuthInstance().currentUser.listen(onGoogleUserChange)
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    onGoogleUserChange(gapi.auth2.getAuthInstance().currentUser.get())
                }
                resolve()
            })
    })
})

const isLoggedIn = async () => {
    try {
        await googleInitPromise
        return await workbetterduhsSignIn()
    } catch (e) {
        return null
    }
}

const signUp = async code => {
    const { message, errors } = await post('/auth/register', { code })
    if (errors && errors.length) {
        return reject(new Error(message || 'Error'))
    }
    await workbetterduhsSignIn()
}

const signOut = async () => {
    await googleInitPromise
    await gapi.auth2.getAuthInstance().signOut()
}

async function googleSignIn() {
    await googleInitPromise
    await gapi.auth2.getAuthInstance().signIn({ prompt: 'select_account' })
    await workbetterduhsSignIn()
}

async function googleGrantOffline(scope) {
    await googleInitPromise
    return gapi.auth2.getAuthInstance().grantOfflineAccess({
        scope,
    })
}

export { googleInitPromise, googleSignIn, googleGrantOffline, signOut, signUp, isLoggedIn, subscribe }
