<template>
    <div>
        <v-navigation-drawer app clipped v-model="toggle" :width="350" right :temporary="temporary">
            <v-toolbar color="primary" dark>
                <v-toolbar-side-icon icon @click="toggleSidebar"></v-toolbar-side-icon>
                <v-toolbar-title>
                    {{ $t('message.calendarEvents') }}
                </v-toolbar-title>
            </v-toolbar>
            <event-details :events="events" :settings="settings" ref="refDetails"></event-details>
        </v-navigation-drawer>

        <div class="right-sidebar">
            <a class="customizer-toggle primary v-step-3" href="javascript:;" @click="toggleSidebar">
                <i class="zmdi ti-menu font-lg"></i>
            </a>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/lib/eventBus'
import moment from 'moment-timezone'
import EventDetails from '@/components/Sidebar/EventDetails'

export default {
    components: {
        EventDetails,
    },
    data() {
        return {
            toggle: false,
            settings: {
                maxScrollbarLength: 160,
            },
        }
    },
    methods: {
        toggleSidebar() {
            this.toggle = !this.toggle
        },
        scrollToEvent(eventId) {
            if (eventId) {
                if (!this.toggle) {
                    this.toggle = true
                }
                this.$refs.refDetails.scrollToSelectedEventWithAnimation(eventId)
            }
        },
        getDayForScroll() {
            const { timezone } = this.$store.getters.user
            // const timezone = 'America/Chicaco'
            const today = moment.tz(timezone).format('YYYY-MM-DD')

            let dayForScroll = ''
            const weekDays = Object.keys(this.events)
            if (weekDays.length && !weekDays.includes(today)) {
                // If today and weekDays are on the same year/month
                if (weekDays[0].substring(0, 7) === today.substring(0, 7)) {
                    // If today is on the out of weekDays arange
                    if (
                        weekDays[0].substring(8, 10) > today.substring(8, 10) ||
                        weekDays[weekDays.length - 1].substring(8, 10) < today.substring(8, 10)
                    ) {
                        dayForScroll = weekDays[0]
                    } else {
                        // If today is in the weekDays arange
                        for (const day of weekDays) {
                            if (day.substring(8, 10) > today.substring(8, 10)) {
                                dayForScroll = day
                                break
                            }
                        }
                    }
                } else {
                    // If today and weekDays are on the different year/month
                    dayForScroll = weekDays[0]
                }
            } else {
                dayForScroll = today
            }
            return dayForScroll
        },
    },
    computed: {
        temporary() {
            if (this.$breadcrumbs[0]) {
                return this.$breadcrumbs[0].meta.type !== 'wplanner'
            }
            return undefined
        },
        events() {
            const blocks = this.$store.getters.calculatedBlocks
            const visibleBlocks = {}
            const { timezone } = this.$store.getters.user
            // const timezone = 'America/Chicago'
            for (const date of Object.keys(blocks)) {
                const md = moment.tz(date, 'YYYY-MM-DD', timezone)
                for (const block of blocks[date]) {
                    visibleBlocks[date] = visibleBlocks[date] || {
                        d1: md.format('DD'),
                        d2: md.format('dddd'),
                        blocks: [],
                    }
                    visibleBlocks[date].blocks.push({
                        id: block.id,
                        category: block.data.category,
                        title: block.data.title,
                        description: block.data.description,
                        from: block.from,
                        to: block.to,
                        time1: moment.tz(block.from, timezone).format('h:mm A'),
                        time2: moment.tz(block.to, timezone).format('h:mm A'),
                        hours: Math.round((block.to - block.from) / 36000) / 100,
                        isOrganizer: block.data.isOrganizer,
                        org: block.data.org,
                        attendees: block.data.attendees,
                        isRecurring: block.data.isRecurring,
                        recurrence: block.data.recurrence,
                        scheduled1: moment.tz(block.data.created, timezone).format('DD/MM/YYYY'),
                        scheduleDiff1: moment.tz(timezone).diff(moment.tz(block.data.created, timezone), 'days'),
                        reschedules: block.data.reschedules
                            ? {
                                  count: block.data.reschedules.count,
                                  last: moment.tz(block.data.reschedules.last * 1000, timezone).format('DD/MM/YYYY'),
                                  diff: moment
                                      .tz(timezone)
                                      .diff(moment.tz(block.data.reschedules.last * 1000, timezone), 'days'),
                              }
                            : undefined,
                        tag_critical: block.data.tag_critical,
                        tag_personal: block.data.tag_personal,
                    })
                }
            }
            return visibleBlocks
        },
    },
    mounted() {
        const vm = this
        EventBus.$on('clickEvent', payload => {
            const { eventId } = payload
            vm.toggle = true
            vm.$refs.refDetails.scrollToSelectedEventWithAnimation(eventId)
        })
    },
    beforeDestroy() {
        EventBus.$off('clickEvent')
    },
}
</script>
