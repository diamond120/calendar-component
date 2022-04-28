<template>
    <div class="meeting-trends">
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xl6 lg6 md6 sm12 pa-0>
                    <skeleton-list :data="stats.loading" :repeat="10" :enable-animation="true">
                        <v-flex xs12 py-0>
                            <span class="chart-title">
                                {{ $t('message.weeklyTrend') }}
                            </span>
                        </v-flex>
                        <stats-vertical-bar-chart statsOption="week" :stats="stats.week"></stats-vertical-bar-chart>
                    </skeleton-list>
                </v-flex>
                <v-flex xl6 lg6 md6 sm12 pa-0>
                    <skeleton-list :data="stats.loading" :repeat="10" :enable-animation="true">
                        <v-flex xs12 py-0>
                            <span class="chart-title">
                                {{ $t('message.monthlyTrend') }}
                            </span>
                        </v-flex>
                        <stats-vertical-bar-chart statsOption="month" :stats="stats.month"></stats-vertical-bar-chart>
                    </skeleton-list>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import StatsVerticalBarChart from '@/components/Charts/StatsVerticalBarChart'

export default {
    name: 'MeetingTrends',
    components: {
        StatsVerticalBarChart,
    },
    props: {
        stats: {
            type: Object,
        },
    },
    data() {
        return {
            loader: false,
        }
    },
}
</script>
