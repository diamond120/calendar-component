<template>
    <v-layout row wrap class="planner-schedule-management">
        <!-- Header -->
        <v-flex xs12 py-0><v-divider class="my-0"></v-divider></v-flex>
        <v-flex xs12 py-0 class="header-section d-custom-flex">
            <v-flex grow py-1 class="d-custom-flex align-items-center">
                <h4 class="ma-0">Plan Your Week</h4>
            </v-flex>
            <v-flex shrink py-1 class="d-custom-flex align-items-center">
                <v-btn flat icon small @click="refreshEvents">
                    <v-icon color="grey">autorenew</v-icon>
                </v-btn>
            </v-flex>
        </v-flex>
        <v-flex xs12 py-0><v-divider class="my-0 mx-3"></v-divider></v-flex>
        <!-- Content -->
        <v-flex xs12 lg8 class="events-section">
            <v-timeline dense clipped align-top>
                <template v-if="!events || Object.keys(events).length === 0">
                    <div class="date-box pa-2">You do not have any events scheduled for this week.</div>
                </template>

                <template v-for="(entry, index) in events">
                    <div :key="`scheduled-date-${index}`" class="date-box pa-2">
                        <h5 class="date-label my-1">{{ entry.d1 }} ({{ entry.d2 }})</h5>
                    </div>
                    <template v-for="block in entry.blocks">
                        <planner-meeting-card
                            :appointment="block"
                            :key="`scheduled-meeting-${block.id}`"
                            v-if="block.category === 'meeting' || block.category === 'tentative'"
                            class="my-2 pa-0"
                            @open_feedback_dialog="openFeedbackDialog"
                        ></planner-meeting-card>
                    </template>
                </template>
            </v-timeline>
        </v-flex>
    </v-layout>
</template>

<script>
import moment from 'moment-timezone'
import Blocks from '@/components/Calendar/Blocks'
import orderBy from 'lodash/orderBy'
import PlannerMeetingCard from './PlannerMeetingCard'

export default {
    name: 'PlannerScheduleManagement',
    components: {
        PlannerMeetingCard,
    },
    computed: {
        events() {
            const { events } = this.$store.getters.planner
            if (!events) return null
            const blocks = {}
            let res = []

            for (const date of Object.keys(events)) {
                const timezone = this.$store.getters.user.timezone
                // const timezone = 'America/Chicago'
                const mdate = moment.tz(date, 'YYYY-MM-DD', timezone)

                const agg = new Blocks(mdate)
                for (const event of events[date]) {
                    agg.addEvent(event)
                }

                agg.calculate()
                blocks[date] = orderBy(
                    agg.blocks.filter(
                        block => block.data.category === 'meeting' || block.data.category === 'tentative'
                    ),
                    ['from']
                )
                res = res.concat(agg.blocks)
            }

            this.$store.commit('calculatedBlocks', blocks)

            // calculate
            const visibleBlocks = {}
            const { timezone } = this.$store.getters.user
            for (const date of Object.keys(blocks)) {
                const md = moment.tz(date, 'YYYY-MM-DD', timezone)
                for (const block of blocks[date]) {
                    visibleBlocks[date] = visibleBlocks[date] || {
                        d1: md.format('dddd'),
                        d2: md.format('MM/DD'),
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
    mounted() {},
    methods: {
        refreshEvents() {
            this.$store.dispatch('loadWPlanner', this.$store.getters.wplannerOffset)
        },
        openFeedbackDialog(originalEventId, existingFeedback) {
            this.$refs.feedbackModal.open(originalEventId, existingFeedback)
        },
    },
}
</script>

<style lang="scss" scoped>
.planner-schedule-management {
    .events-section {
        .date-box {
            position: sticky;
            top: 0;
            max-width: 100%;
            margin-left: 48px;
            text-align: center;
            background: white;
            border: 1px solid $gray;
            @include border-radius(5px);
            z-index: 1;

            .date-label {
                font-size: $font-size-lg;
                color: $light-dark;
            }
        }
    }
}
</style>
