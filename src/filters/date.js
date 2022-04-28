import Vue from 'vue'
import format from 'date-fns/format'

Vue.filter('normalizeDate', (date, formatType = 'YYYY-MM-DD') => format(date, formatType))
