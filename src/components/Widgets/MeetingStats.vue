<template>
    <div class="stats-card-container">
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12 class="text-center text-upper font-sm fw-normal">
                    {{ $t('message.total') }}
                </v-flex>
                <v-flex xs6></v-flex>
                <v-flex xs3 class="text-xs-right text-upper font-xs fw-semi-bold px-0">
                    <v-tooltip top>
                        <div slot="activator">
                            {{ $t('message.attended') }}
                            <a href="javascript:void(0);">
                                <v-icon size="12">ti-help-alt</v-icon>
                            </a>
                        </div>
                        <span>{{ $t('message.attendedTip') }}</span>
                    </v-tooltip>
                </v-flex>
                <v-flex xs3 class="text-xs-right text-upper font-xs fw-semi-bold px-0">
                    <v-tooltip top>
                        <div slot="activator">
                            {{ $t('message.organized') }}
                            <a href="javascript:void(0);">
                                <v-icon size="12">ti-help-alt</v-icon>
                            </a>
                        </div>
                        <span>{{ $t('message.organizedTip') }}</span>
                    </v-tooltip>
                </v-flex>
            </v-layout>
            <template v-for="item in meetingStatsData">
                <template v-if="item.type === 'average_div'">
                    <v-layout :key="item.title" row wrap mt-2>
                        <v-flex xs12 class="text-center text-upper font-sm fw-normal">
                            {{ $t('message.average') }}
                        </v-flex>
                        <v-flex xs6></v-flex>
                        <v-flex xs3 class="text-xs-right text-upper font-xs fw-semi-bold px-1">
                            <v-tooltip top>
                                <div slot="activator">
                                    {{ $t('message.attended') }}
                                    <a href="javascript:void(0);">
                                        <v-icon size="12">ti-help-alt</v-icon>
                                    </a>
                                </div>
                                <span>{{ $t('message.attendedTip') }}</span>
                            </v-tooltip>
                        </v-flex>
                        <v-flex xs3 class="text-xs-right text-upper font-xs fw-semi-bold px-1">
                            <v-tooltip top>
                                <div slot="activator">
                                    {{ $t('message.organized') }}
                                    <a href="javascript:void(0);">
                                        <v-icon size="12">ti-help-alt</v-icon>
                                    </a>
                                </div>
                                <span>{{ $t('message.organizedTip') }}</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                </template>
                <template v-else>
                    <v-layout :key="item.title" row wrap align-center py-1 class="dash-bg-block">
                        <v-flex xs6 py-0 class="metric-label">
                            {{ item.title }}
                        </v-flex>
                        <v-flex
                            xs3
                            py-1
                            class="grey--text text-xs-right"
                            :class="{
                                'fw-semi-bold font-sm':
                                    item.type === 'average_attendees' ||
                                    item.type === 'average_duration' ||
                                    item.type === 'lead_time',
                                'fw-light font-sm':
                                    item.type === 'total' ||
                                    item.type === 'total_minutes' ||
                                    item.type === 'total_attendees' ||
                                    item.type === 'total_attendee_time',
                            }"
                        >
                            {{ item.attended }}
                        </v-flex>
                        <v-flex
                            xs3
                            py-0
                            class="grey--text text-xs-right"
                            :class="{
                                'fw-semi-bold font-sm':
                                    item.type === 'average_attendees' ||
                                    item.type === 'average_duration' ||
                                    item.type === 'lead_time',
                                'fw-light font-sm':
                                    item.type === 'total' ||
                                    item.type === 'total_minutes' ||
                                    item.type === 'total_attendees' ||
                                    item.type === 'total_attendee_time',
                            }"
                        >
                            {{ item.organized }}
                        </v-flex>
                    </v-layout>
                </template>
            </template>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable no-case-declarations */
export default {
    props: {
        statsOption: {
            type: String,
            default: 'last-week',
        },
        stats: {
            type: Object,
        },
    },
    data() {
        return {
            loader: false,
        }
    },
    computed: {
        meetingStatsData() {
            return this.statsOption === 'last-week' ? this.meetingStats.week : this.meetingStats.month
        },
        meetingStats() {
            const agg = this.stats
            const titles = [
                ['total', '# of Meetings'],
                ['total_minutes', 'Total Duration (Hours)'],
                ['total_attendees', 'Total Attendees'],
                ['total_attendee_time', 'Total Attendance (Hours)'],
                ['average_div', ''],
                ['average_attendees', 'Avg. Attendees'],
                ['average_duration', 'Avg. Duration (minutes)'],
                ['lead_time', 'Lead Time (Days)'],
            ]

            const res = {
                week: [],
                month: [],
            }

            for (const key in titles) {
                const k = titles[key][0]
                for (const period of ['week', 'month']) {
                    const entry = {
                        type: k,
                        title: titles[key][1],
                        organized: 0,
                        attended: 0,
                    }
                    res[period].push(entry)
                    for (const type of ['organized', 'attended']) {
                        const prefix = type.substr(0, 1)
                        const total = agg[period][`${prefix}_total`] || 0
                        const aggkey = `${prefix}_${k}`

                        switch (k) {
                            case 'total_minutes':
                                entry[type] = Math.ceil((agg[period][aggkey] || 0) / 60)
                                break
                            case 'total_attendee_time':
                                entry[type] = Math.ceil((agg[period][`${prefix}_attendees_minutes`] || 0) / 60)
                                break
                            case 'average_attendees':
                                entry[type] =
                                    total > 0 ? Math.ceil((agg[period][`${prefix}_total_attendees`] || 0) / total) : 0
                                break
                            case 'average_duration':
                                entry[type] =
                                    total > 0 ? Math.ceil((agg[period][`${prefix}_total_minutes`] || 0) / total) : 0
                                break
                            case 'lead_time':
                                const leadDays = (agg[period][`${prefix}_lead_time_minutes`] || 0) / 60 / 24
                                const leadEvents = total - (agg[period][`${prefix}_recurring`] || 0)
                                entry[type] = leadEvents ? Math.round((leadDays / leadEvents) * 100) / 100 : 0
                                break
                            default:
                                entry[type] = agg[period][aggkey] || 0
                        }
                    }
                }
            }
            return res
        },
    },
}
</script>
