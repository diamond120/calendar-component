<template>
    <div class="stats-bars">
        <div class="stats pa-2 mx-4 my-2">
            <h4 class="stats-title">{{ statsTitle }}</h4>
            <div class="week-stats" :style="`height:${hourHeight}px`">
                <div class="stats-container" v-resize="onResize">
                    <div class="metric-label white--text">{{ $t('message.totalMeetings') }} :</div>
                    <span class="white--text font-lg fw-light pa-2">
                        <v-tooltip top>
                            <div slot="activator">
                                {{ computedStats.week.total_meetings }}
                                <a href="javascript:void(0);">
                                    <i
                                        class="zmdi font-sm"
                                        :class="{
                                            'zmdi-long-arrow-up error--text': computedStats.comp.total_meetings > 0,
                                            'zmdi-long-arrow-down error--text': computedStats.comp.total_meetings < 0,
                                            'd-none': computedStats.comp.total_meetings.percentage === 0,
                                        }"
                                    ></i>
                                </a>
                            </div>
                            <span v-html="computedStats.tooltip.total_meetings"></span>
                        </v-tooltip>
                    </span>
                    <div class="metric-label white--text ml-5">{{ $t('message.meetingsHours') }} :</div>
                    <span class="white--text font-lg fw-light pa-2">
                        <v-tooltip top>
                            <div slot="activator">
                                {{ computedStats.week.meeting_hours }}
                                <a href="javascript:void(0);">
                                    <i
                                        class="zmdi font-sm"
                                        :class="{
                                            'zmdi-long-arrow-up error--text': computedStats.comp.meeting_hours > 0,
                                            'zmdi-long-arrow-down error--text': computedStats.comp.meeting_hours < 0,
                                            'd-none': computedStats.comp.meeting_hours.percentage === 0,
                                        }"
                                    ></i>
                                </a>
                            </div>
                            <span v-html="computedStats.tooltip.meeting_hours"></span>
                        </v-tooltip>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { format, isSameMonth } from 'date-fns'
import AppConfig from '@/constants/AppConfig'

export default {
    props: ['days'],
    inject: ['calendarOptions'],
    data() {
        return {
            weekCellWidth: 0,
        }
    },
    computed: {
        statsTitle() {
            if (this.days) {
                const dateStart = this.days[0].date
                const dateEnd = this.days[this.days.length - 1].date
                if (isSameMonth(dateStart, dateEnd)) {
                    return `Week of ${format(dateStart, 'MMMM')} ${format(dateStart, 'Do')} - ${format(dateEnd, 'Do')}`
                } else {
                    return `Week of ${format(dateStart, 'MMMM')} ${format(dateStart, 'Do')} - ${format(
                        dateEnd,
                        'MMMM'
                    )} ${format(dateEnd, 'Do')}`
                }
            }
            return ''
        },
        hourHeight() {
            return this.calendarOptions.cell_height * 3
        },
        stats() {
            const { stats } = this.$store.getters.planner
            return stats || {}
        },
        computedStats() {
            const { a_total = 0, o_total = 0, a_total_minutes = 0, o_total_minutes = 0 } = this.stats.week || {}

            const hours = Math.round(Math.ceil((a_total_minutes + o_total_minutes) / 60) * 10) / 10
            const week = {
                total_meetings: a_total + o_total,
                meeting_hours: hours,
                estimated_cost: hours * AppConfig.hourlyRate,
            }

            const {
                a_total: last_week_a_total = 0,
                o_total: last_week_o_total = 0,
                a_total_minutes: last_week_a_total_minutes = 0,
                o_total_minutes: last_week_o_total_minutes = 0,
            } = this.stats.prevWeek || {}

            const last_week = {
                total_meetings: last_week_a_total + last_week_o_total,
                meeting_hours: Math.ceil((last_week_a_total_minutes + last_week_o_total_minutes) / 60),
            }

            const comp = {
                total_meetings: 0,
                meeting_hours: 0,
            }

            if (last_week.total_meetings > 0) {
                comp.total_meetings = Math.round((week.total_meetings / last_week.total_meetings - 1) * 100)
            }
            if (last_week.meeting_hours > 0) {
                comp.meeting_hours = Math.round((week.meeting_hours / last_week.meeting_hours - 1) * 100)
            }

            const tooltip = {
                total_meetings: `Total Meetings Last Week: ${last_week.total_meetings} <br />
                         ${Math.abs(comp.total_meetings)}% ${comp.total_meetings > 0 ? 'increase' : 'decrease'}`,
                meeting_hours: `Meetings Hours Last Week: ${last_week.meeting_hours} <br />
                         ${Math.abs(comp.meeting_hours)}% ${comp.meeting_hours > 0 ? 'increase' : 'decrease'}`,
            }

            return {
                week,
                comp,
                tooltip,
            }
        },
    },
    methods: {
        onResize() {
            this.weekCellWidth = $('.week-stats').width() - 4
        },
    },
}
</script>

<style lang="scss" scoped>
$alpha: 0.75;
$focus-color: rgba(
    $color: $focus-color,
    $alpha: $alpha,
);

.stats-bars {
    margin-left: 80px;

    .stats {
        border: 1px solid $gray;
        @include border-radius(5px);

        &-title {
            font-weight: $font-weight-normal;
            text-align: center;
        }

        .week-stats {
            display: flex;
            align-items: center;

            .stats-container {
                flex: 1;
                display: flex;
                position: relative;
                align-items: center;
                justify-content: center;
                height: calc(100% - 5px);
                margin: 1px;
                @include border-radius(3px);
                border: 1px solid #dddddd;
                background-color: $focus-color;
            }
        }
    }
}
</style>
