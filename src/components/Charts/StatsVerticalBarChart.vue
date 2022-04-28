<template>
    <div>
        <v-container fluid grid-list-xl class="meeting-trends-chart">
            <v-layout row justify-center pa-0 class="chart-container">
                <template v-for="(item, index) in trends">
                    <div class="chart-bar" :key="item.week_of">
                        <div class="py-2 text-xs-center font-xs fw-semi-bold text-upper">
                            {{ statsOption === 'week' ? item.week_of : item.month_of }}
                        </div>
                        <div class="chart-bar-container">
                            <div class="chart-bar-item py-1" :style="getBarHeightStyle(index)">
                                <div class="text-xs-center font-xl">
                                    {{ item.meeting_time_hours }}
                                </div>
                                <div class="text-xs-center font-xs fw-semi-bold text-upper">
                                    Hours
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment-timezone'
export default {
    name: 'StatsVerticalBarChart',
    props: {
        statsOption: {
            type: String,
            default: 'week',
        },
        stats: {
            type: Array,
        },
    },
    computed: {
        trends() {
            return this.statsOption === 'week' ? this.trends_week : this.trends_month
        },
        trends_week: function() {
            if (!this.$store.getters.user) return []
            const { timezone } = this.$store.getters.user
            // const timezone = 'America/Chicago'
            const trends = this.stats.reduce((acc, cur) => {
                const d = moment
                    .tz(timezone)
                    .day(1)
                    .isoWeek(cur.week)
                    .format('MM/DD/YYYY')
                acc[d] = cur.total
                return acc
            }, {})
            const res = []

            for (const date of Object.keys(trends)) {
                const entry = {
                    week_of: date,
                    meeting_time_hours: Math.ceil(trends[date] / 60),
                }
                res.push(entry)
            }
            return res
        },
        trends_month: function() {
            if (!this.$store.getters.user) return []
            const { timezone } = this.$store.getters.user
            // const timezone = 'America/Chicago'
            const trends = (this.stats || []).reduce((acc, cur) => {
                const d = moment
                    .tz(timezone)
                    .startOf('month')
                    .month(cur.month)
                    .format('MMM')
                acc[d] = cur.total
                return acc
            }, {})
            const res = []

            for (const date of Object.keys(trends)) {
                const entry = {
                    month_of: date,
                    meeting_time_hours: Math.ceil(trends[date] / 60),
                }
                res.push(entry)
            }
            return res
        },
    },
    methods: {
        getBarHeightStyle(index) {
            const bars = this.trends.map(x => x.meeting_time_hours)
            const barMaxHeight = Math.max(...bars)
            const barMinHeight = 20
            return {
                height: barMinHeight + (bars[index] * (100 - barMinHeight)) / barMaxHeight + '%',
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.meeting-trends-chart {
    .chart-container {
        display: flex;
        min-height: 350px;
        background: $gray-lighter;
        border-left: 2px solid $gray;
        border-bottom: 2px solid $gray;

        .chart-bar {
            flex: 0 0 70px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 0 1rem;
            background: repeating-linear-gradient(
                -55deg,
                transparent,
                transparent 1px,
                lighten($color: $gray, $amount: 2%) 2px,
                lighten($color: $gray, $amount: 2%) 3px
            );

            .chart-bar-container {
                flex: 1 1 auto;
                position: relative;

                .chart-bar-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    color: $light;
                    background: linear-gradient(135deg, $primary2, $primary1);
                    @include border-radii(35px 14px, 35px 14px, 0, 0);
                    animation: expand-height 1.5s ease-out;
                    -moz-animation: expand-height 1.5s ease-out;
                    -webkit-animation: expand-height 1.5s ease-out;
                }
            }

            @media (max-width: 1024px) {
                flex: 0 0 60px;
            }

            @media (max-width: 480px) {
                flex: 0 0 50px;
                margin: 0 0.5rem;
            }
        }
    }
}
@keyframes expand-height {
    0% {
        height: 30px;
    }
    100% {
        transform: 100%;
    }
}
@-moz-keyframes expand-height {
    0% {
        height: 30px;
    }
    100% {
        transform: 100%;
    }
}
@-webkit-keyframes expand-height {
    0% {
        height: 30px;
    }
    100% {
        transform: 100%;
    }
}
</style>
