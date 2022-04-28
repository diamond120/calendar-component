<template>
    <div>
        <v-container fluid grid-list-xl>
            <v-layout row wrap border-rad-sm overflow-hidden>
                <!-- Meeting Stats -->
                <app-card
                    :heading="$t('message.meetingStats')"
                    colClasses="xl4 lg4 md6 sm12 xs12"
                    :fullBlock="true"
                    :withTabs="true"
                    :tabs="[$t('message.lastWeek'), $t('message.last30Days')]"
                    @onChangeTabCallback="onChangeTab"
                >
                    <skeleton-list :data="recapStatsData" :repeat="5" :enable-animation="true">
                        <meeting-stats :statsOption="meetingStatsOption" :stats="meetingStats"></meeting-stats>
                    </skeleton-list>
                </app-card>

                <!-- Meeting Makeup -->
                <app-card :heading="$t('message.meetingTypes')" colClasses="xl8 lg8 md6 sm12 xs12">
                    <skeleton-list :data="recapStatsData" :repeat="5" :enable-animation="true">
                        <meeting-makeup :stats="meetingMakeup"></meeting-makeup>
                    </skeleton-list>
                </app-card>

                <!-- Meeting Trends -->
                <app-card :heading="$t('message.meetingTrends')" colClasses="xs12">
                    <meeting-trends :stats="meetingTrends"></meeting-trends>
                </app-card>

                <!-- Meeting Network -->
                <app-card :heading="$t('message.meetingNetwork')" colClasses="xs12">
                    <meeting-network period="Week" :stats="meetingNetwork"></meeting-network>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment-timezone'
import MeetingStats from '@/components/Widgets/MeetingStats'
import MeetingMakeup from '@/components/Widgets/MeetingMakeup'
import MeetingTrends from '@/components/Widgets/MeetingTrends'
import MeetingNetwork from '@/components/Widgets/MeetingNetwork'

export default {
    name: 'WeeklyAnalyzer',
    components: {
        MeetingStats,
        MeetingMakeup,
        MeetingTrends,
        MeetingNetwork,
    },
    data() {
        return {
            meetingStatsOption: 'last-week',
        }
    },
    mounted: async function() {
        this.$store.dispatch('loadWAnalyzer', this.$store.getters.wanalyzerOffset)
        this.$store.dispatch('viewDashboard', {
            dashboard: 'Weekly Recap',
            dateRange: this.currentWeek(),
        })
    },
    computed: {
        recapStatsData() {
            return this.$store.getters.recap.stats
        },
        meetingStats() {
            const { stats } = this.$store.getters.recap
            if (!stats) return { week: {}, month: {} }
            return {
                week: stats.week,
                month: stats.month,
            }
        },
        meetingMakeup() {
            const { makeup } = this.$store.getters.recap
            if (!makeup) return { externalDomains: [], makeup: {}, loading: null }
            return { ...makeup, loading: { loaded: true } }
        },
        meetingTrends() {
            const { trends } = this.$store.getters.recap
            if (!trends) return { week: [], month: [], loading: null }

            const meetingTrends = { ...trends }
            if (meetingTrends) meetingTrends.loading = { loaded: true }
            return meetingTrends || { week: [], month: [], loading: null }
        },
        meetingNetwork() {
            const { makeup, attendees } = this.$store.getters.recap
            let externalDomains = []
            if (makeup) externalDomains = makeup.externalDomains

            if (!attendees) {
                return {
                    externalDomains,
                    attendees: { peers: [], sharedMap: {} },
                    loading: null,
                }
            }
            return {
                externalDomains,
                attendees,
                loading: { loaded: true },
            }
        },
    },
    methods: {
        onChangeTab(value) {
            switch (value) {
                case 0:
                    this.meetingStatsOption = 'last-week'
                    break
                case 1:
                    this.meetingStatsOption = 'last-month'
                    break
                default:
                    break
            }
        },
        currentWeek() {
            const { timezone } = this.$store.getters.user
            const dateFormatter = 'MM/DD/YYYY'
            const startDate = moment
                .tz(timezone)
                .startOf('week')
                .day(1)
            const f = moment
                .tz(timezone)
                .day(5)
                .set({ hours: 12, minutes: 0, seconds: 0 })
            const now = moment.tz(timezone)

            if (now.isAfter(f)) {
                startDate.add(1, 'week')
            }
            startDate.add(this.$store.getters.recapOffset, 'weeks')

            const endDate = startDate
                .clone()
                .endOf('week')
                .day(5)

            return `${startDate.format(dateFormatter)} - ${endDate.format(dateFormatter)}`
        },
    },
}
</script>
