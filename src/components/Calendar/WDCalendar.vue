<template>
    <div
        class="calendarium wrapping-all"
        :class="{
            dark: !!calendar_options.dark,
        }"
    >
        <w-d-calendar-week :days="calendar_options.current_week" :hours="hours"></w-d-calendar-week>
    </div>
</template>

<script>
import { addDays, startOfWeek, endOfWeek, format, getTime, addHours, addMinutes } from 'date-fns'
import WDCalendarWeek from './WDCalendarWeek'
import moment from 'moment-timezone'

let timezoneOffset = 0
let slotStep = 1 * 60 * 1000

function getSlotTime(time) {
    return Math.round((time - timezoneOffset) / slotStep) * slotStep
}

export default {
    name: 'WDCalendar',
    components: {
        WDCalendarWeek,
    },
    props: {
        appointments: {
            required: true,
            type: Array,
        },
        configuration: {
            type: Object,
            required: false,
            validator: val => {
                return typeof val === 'object'
            },
        },
    },
    data() {
        return {
            default_options: {
                current_week: null,
                currently_working_on_date: null,
                current_day: null,
                existing_appointments: {},
            },
            weeks: {},
            hours: [],
        }
    },
    computed: {
        hourParts() {
            return (
                (60 / this.calendar_options.split_value) *
                (this.calendar_options.end_hours - this.calendar_options.start_hours)
            )
        },
        view_type() {
            return this.configuration.view_type
        },
        calendar_options: {
            get() {
                let options = this.default_options
                let providedProps = this.configuration
                const { timezone } = this.$store.getters.user
                // const timezone = 'America/Chicago'
                const today = moment.tz(timezone)
                if (today.day() > 5 || (today.day() === 5 && today.hours() > 11)) {
                    today.add(1, 'week').startOf('week')
                }
                today.add(this.$store.getters.wplannerOffset, 'weeks')

                options.current_day = today
                for (let key in providedProps) {
                    options[key] = providedProps[key]
                }
                return options
            },
            set(val) {
                this.configuration = val
            },
        },
    },
    beforeMount() {
        let visibleHours = []
        var today = new Date()
        let y = today.getFullYear()
        let m = today.getMonth()
        let d = today.getDate()
        for (let i = this.calendar_options.start_hours; i <= this.calendar_options.end_hours - 1; i++) {
            visibleHours.push(new Date(y, m, d, i, 0, 0))
        }
        this.hours = visibleHours
    },
    mounted() {
        this.generateCalendarProperties()
    },
    provide() {
        const provider = {}
        Object.defineProperty(provider, 'calendarOptions', {
            enumerable: true,
            get: () => this.calendar_options,
        })
        return provider
    },
    methods: {
        constructWeek() {
            const { timezone } = this.$store.getters.user
            // const timezone = 'America/Chicago'
            const utcOffset = new Date().getTimezoneOffset()
            timezoneOffset = (moment.tz(timezone).zone() - utcOffset) * 60 * 1000
            slotStep = this.calendar_options.split_value * 60 * 1000
            let filteredAppointments = []
            let date = new Date(this.calendar_options.current_day)
            date.setHours(0, 0, 0, 0)
            let _days = []
            let start = this.calendar_options.view_type === 'Week' ? this.startOfTheWeek(date) : format(date)
            let numOfDays = this.calendar_options.view_type === 'Week' ? 5 : 1
            for (let i = 0; i < numOfDays; i++) {
                let _date = addHours(addDays(start, i), this.calendar_options.start_hours)
                let payload = {
                    date: format(_date, 'YYYY-MM-DD'),
                }
                payload.date_hours = new Array(this.hourParts).fill(1).map((hour, index) => {
                    return {
                        value: index > 0 ? addMinutes(_date, index * this.calendar_options.split_value) : _date,
                        index,
                    }
                })

                for (const appointment of this.appointments) {
                    if (appointment.date !== payload.date) continue
                    let targetHourFrom = payload.date_hours.find(
                        hour => getTime(hour.value) === getSlotTime(appointment.from)
                    )
                    if (!targetHourFrom && getSlotTime(appointment.from) < getTime(payload.date_hours[0].value)) {
                        targetHourFrom = payload.date_hours[0]
                    }
                    let targetHourTo = payload.date_hours.find(
                        hour => getTime(hour.value) === getSlotTime(appointment.to)
                    )
                    if (
                        !targetHourTo &&
                        getSlotTime(appointment.to) > getTime(payload.date_hours[payload.date_hours.length - 1].value)
                    ) {
                        targetHourTo = payload.date_hours[payload.date_hours.length - 1]
                    }
                    if (!targetHourFrom || !targetHourTo) continue
                    filteredAppointments.push({
                        id: appointment.id,
                        start: targetHourFrom.index,
                        end: targetHourTo.index - 1,
                        date: appointment.date,
                        data: {
                            ...appointment.data,
                            from: moment.tz(appointment.from, timezone).format(),
                            to: moment.tz(appointment.to, timezone).format(),
                        },
                        status: 'completed',
                    })
                }
                _days.push(payload)
            }
            return {
                filteredAppointments: filteredAppointments,
                _days: _days,
            }
        },
        formatDate(_format, how) {
            return format(_format, how)
        },
        startOfTheWeek(value) {
            const sun = startOfWeek(value, {
                weekStartsOn: 0,
            })
            sun.setTime(sun.getTime() + 24 * 60 * 60 * 1000)
            return sun
        },
        endOfTheWeek(value) {
            const sat = endOfWeek(value, {
                weekStartsOn: 0,
            })
            sat.setTime(sat.getTime() - 24 * 60 * 60 * 1000)
            return sat
        },
        generateCalendarProperties() {
            let { filteredAppointments, _days } = this.constructWeek()
            this.$set(this.calendar_options, 'existing_appointments', filteredAppointments)
            this.weeks[_days[0].date] = _days
            this.$set(this.calendar_options, 'current_week', _days)
        },
        getHours(start, end) {
            return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
        },
    },
    watch: {
        appointments(val) {
            if (val) this.generateCalendarProperties()
        },
        view_type(val) {
            if (['Week', 'Day'].includes(val)) {
                this.generateCalendarProperties()
            }
        },
        split_value(val) {
            if (60 % parseInt(val) === 0) this.generateCalendarProperties()
        },
        current_day(val) {
            if (val) this.generateCalendarProperties()
        },
    },
}
</script>

<style lang="scss" scoped>
.calendarium {
    &.non-desktop .building-blocks {
        pointer-events: none;
    }
}

.week-navigator {
    display: flex;
    justify-content: flex-end;
}
</style>
