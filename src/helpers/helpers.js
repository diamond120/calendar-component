/**
 * Helpers Functions
 */
import moment from 'moment'

// Get Date
export const getTheDate = (timestamp, format) => {
    let time = timestamp * 1000
    let formatDate = format || 'MM-DD-YYYY'
    return moment(time).format(formatDate)
}

// Convert Date To Timestamp
export const convertDateToTimeStamp = (date, format) => {
    let formatDate = format || 'YYYY-MM-DD'
    return moment(date, formatDate).unix()
}

/**
 * Text Truncate
 */
export const textTruncate = (str, length, ending) => {
    if (length == null) {
        length = 100
    }
    if (ending == null) {
        ending = '...'
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending
    } else {
        return str
    }
}
/**
 * Function to generate random string UUID
 */
export const generateUUID = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    )
}

/**
 * Function to convert hex to rgba
 */
export const hexToRgbA = (hex, alpha) => {
    var c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')'
    }
    throw new Error('Bad Hex')
}

Number.prototype.format = function(fl = 2) {
    // eslint-disable-line no-extend-native
    let val = this.toFixed(fl)
    if (fl === 0) {
        val = `${val}.`
    }
    val = val.replace(/\d(?=(\d{3})+\.)/g, '$&,')
    if (fl === 0) {
        return val.substr(0, val.length - 1)
    }
    return val
}

/**
 * Function to scroll with animation
 */
export const scrollTo = (element, to, duration) => {
    var start = element.scrollTop
    var change = to - start
    var currentTime = 0
    var increment = 20
    const animateScroll = () => {
        currentTime += increment
        var val = easeInOutQuad(currentTime, start, change, duration)
        element.scrollTop = val
        // element.scrollTo(0, val)
        if (currentTime < duration) {
            setTimeout(animateScroll, increment)
        }
    }
    animateScroll()
}

/**
 * Function to calculate the distance for scrolling
 */
export const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
}
