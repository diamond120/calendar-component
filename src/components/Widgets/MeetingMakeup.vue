<template>
    <div>
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap align-center>
                <v-flex xl4 lg4 md4 sm4 xs12 pa-0>
                    <skeleton-list :data="stats.loading" :repeat="10" :enable-animation="true">
                        <v-flex xs12 py-0 class="text-center">
                            <span class="chart-title">
                                {{ $t('message.recurringVsOneTimeMeetings') }}
                            </span>
                        </v-flex>
                        <!-- Recuring donuts stats -->
                        <stats-donut-echart1
                            :data="donutChartData1"
                            :colors="donutChartColors"
                            other="One-Time"
                            :toolTipFormatter="donutChartToolTipFormatter"
                            showToolTip
                            showInfoLabel
                            showPercentage
                        ></stats-donut-echart1>
                    </skeleton-list>
                </v-flex>
                <v-flex xl2 lg2 md2 sm2 xs12 pa-0>
                    <v-flex xs12 py-0 class="legend-container">
                        <div class="d-custom-flex legend-box">
                            <div class="pa-1 fs-12 fw-semi-bold">
                                <span class="v-badge mr-1 focus"></span>
                                <span class="d-block">
                                    {{ $t('message.recurringMeetings') }}
                                </span>
                            </div>
                            <div class="pa-1 fs-12 fw-semi-bold">
                                <span class="v-badge mr-1 meeting"></span>
                                <span class="d-block">
                                    {{ $t('message.oneTimeMeetings') }}
                                </span>
                            </div>
                        </div>
                    </v-flex>
                </v-flex>
                <v-flex xl4 lg4 md4 sm4 xs12 pa-0>
                    <skeleton-list :data="stats.loading" :repeat="10" :enable-animation="true">
                        <v-flex xs12 py-0 class="text-center">
                            <span class="chart-title">
                                {{ $t('message.externalVsInternalMeetings') }}
                            </span>
                        </v-flex>
                        <!-- External donuts stats -->
                        <stats-donut-echart1
                            :data="donutChartData2"
                            :colors="donutChartColors"
                            other="Internal"
                            :toolTipFormatter="donutChartToolTipFormatter"
                            showToolTip
                            showInfoLabel
                            showPercentage
                        ></stats-donut-echart1>
                    </skeleton-list>
                </v-flex>
                <v-flex xl2 lg2 md2 sm2 xs12 pa-0>
                    <v-flex xs12 py-0 class="legend-container">
                        <div class="d-custom-flex legend-box">
                            <div class="pa-1 fs-12 fw-semi-bold">
                                <span class="v-badge mr-1 focus"></span>
                                <span class="d-block">
                                    {{ $t('message.externalMeetings') }}
                                </span>
                            </div>
                            <div class="pa-1 fs-12 fw-semi-bold mb-2">
                                <span class="v-badge mr-1 meeting"></span>
                                <span class="d-block">
                                    {{ $t('message.internalMeetings') }}
                                </span>
                            </div>
                        </div>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable camelcase */
import StatsDonutEchart1 from '@/components/Charts/StatsDonutEchart1'
import { lightColor, mediumColor, darkColor } from '@/components/Charts/StatsDonutEchartConfig'

export default {
    name: 'MeetingMakeup',
    components: {
        StatsDonutEchart1,
    },
    props: ['stats'],
    data() {
        return {
            loader: false,
        }
    },
    computed: {
        donutChartData1() {
            const { makeup } = this.stats
            const { recurring_minutes = 0, total_minutes = 0 } = makeup
            const value = total_minutes > 0 ? Math.round((recurring_minutes / total_minutes) * 100) : 0
            return {
                name: 'Recuring',
                value,
                y: recurring_minutes / 60,
            }
        },
        donutChartData2() {
            const { makeup } = this.stats
            const { external_minutes = 0, total_minutes = 0 } = makeup
            const value = total_minutes > 0 ? Math.round((external_minutes / total_minutes) * 100) : 0
            return {
                name: 'External',
                value,
                y: external_minutes / 60,
            }
        },
        donutChartColors() {
            return [darkColor, mediumColor, lightColor]
        },
        donutChartToolTipFormatter() {
            return '{b} Meetings <br /> % of Total: {d}% <br /> Total Hours: {c} Hours'
        },
    },
}
</script>

<style lang="scss" scoped>
.legend-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .legend-box {
        flex-direction: column;

        & > div {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .v-badge {
                padding: 0;
                height: 12px;
                width: 12px;
                @include border-radius(50%);
            }
        }
    }
}
</style>
