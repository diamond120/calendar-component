<template>
    <v-container fluid grid-list-xl class="planner-container">
        <planner-header></planner-header>
        <planner-schedule-management></planner-schedule-management>
    </v-container>
</template>

<script>
import PlannerHeader from '@/components/Planner/PlannerHeader'
import PlannerScheduleManagement from '@/components/Planner/PlannerScheduleManagement'
import moment from 'moment-timezone'

export default {
    name: 'Dashboard',
    components: {
        PlannerHeader,
        PlannerScheduleManagement,
    },
    mounted: function() {
        this.$store.dispatch('loadWPlanner', this.$store.getters.wplannerOffset)
        this.$store.dispatch('viewDashboard', {
            dashboard: 'Individual Weekly Planner',
            dateRange: this.currentWeek,
        })
    },
    computed: {
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
            startDate.add(this.$store.getters.plannerOffset, 'weeks')

            const endDate = startDate
                .clone()
                .endOf('week')
                .day(5)

            return `${startDate.format(dateFormatter)} - ${endDate.format(dateFormatter)}`
        },
    },
}
</script>

<style lang="scss" scoped>
.planner-container {
    background: white;
}
</style>
