import AppConfig from '@/constants/AppConfig'
import { store } from '../store/store'

async function call(endpoint, params = {}, method = 'GET', token) {
    let body = null
    let query = ''
    if (method !== 'GET') {
        body = JSON.stringify(params)
    } else {
        const parts = []
        for (const k of Object.keys(params)) {
            parts.push(`${k}=${encodeURIComponent(params[k])}`)
        }
        query = parts.join('&')
    }

    const opts = {
        headers: new Headers({
            Authorization: 'Bearer ' + (token || store.getters.token),
            'content-type': 'application/json',
        }),
        method,
        body,
    }

    const url = query ? `${AppConfig.baseURI}${endpoint}?${query}` : `${AppConfig.baseURI}${endpoint}`
    const res = await fetch(url, opts)
    const json = await res.json()
    if (res.status >= 400) {
        if (json && (json.errors && json.errors.length)) {
            throw json.errors[0].message
        } else {
            throw json.message
        }
    }
    return json
}

function get(endpoint, params = {}, token) {
    return call(endpoint, params, 'GET', token)
}
function post(endpoint, params = {}, token) {
    return call(endpoint, params, 'POST', token)
}
function put(endpoint, params = {}, token) {
    return call(endpoint, params, 'PUT', token)
}
function del(endpoint, params = {}, token) {
    return call(endpoint, params, 'DELETE', token)
}

export { call, get, put, del, post }
