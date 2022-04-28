import Vue from 'vue'

Vue.filter('normalizeNumber', function(value, digit = 0, sign = false) {
    if (typeof value === 'string') return value
    if (!value) value = 0
    return parseFloat(value).toFixed(digit)
})
