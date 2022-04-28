<template>
    <div class="meeting-network">
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xl6 lg6 md6 sm12 pa-0>
                    <!-- Peolple Network -->
                    <skeleton-list :data="stats.loading" :repeat="10" :enable-animation="true">
                        <v-flex xs12 py-0>
                            <span xs12 py-0 class="chart-title">
                                {{ $t(meetingNetworkPeopleTitle) }}
                            </span>
                        </v-flex>
                        <meeting-network-map :period="period" :stats="stats.attendees"></meeting-network-map>
                        <v-spacer class="pa-2"></v-spacer>
                    </skeleton-list>
                </v-flex>
                <v-flex xl6 lg6 md6 sm12 pa-0>
                    <!-- External Organizations -->
                    <skeleton-list :data="stats.loading" :repeat="10" :enable-animation="true">
                        <v-flex xs12 py-0>
                            <span class="chart-title">
                                {{ $t(meetingNetworkCompaniesTitle) }}
                            </span>
                        </v-flex>
                        <stats-horizontal-bar-chart :stats="externalOrganizations"></stats-horizontal-bar-chart>
                    </skeleton-list>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import StatsHorizontalBarChart from '@/components/Charts/StatsHorizontalBarChart'
import MeetingNetworkMap from '@/components/Widgets/MeetingNetworkMap'
import orderBy from 'lodash/orderBy'

export default {
    name: 'MeetingNetwork',
    components: {
        StatsHorizontalBarChart,
        MeetingNetworkMap,
    },
    props: ['period', 'stats'],
    data() {
        return {
            loader: false,
            activeTab: 2,
        }
    },
    computed: {
        externalOrganizations() {
            const { externalDomains } = this.stats
            return orderBy(
                externalDomains.map(el => ({
                    name: el.hd,
                    hours: Math.ceil(el.minutes / 60),
                })),
                ['hours'],
                ['desc']
            )
        },
        meetingNetworkPeopleTitle() {
            let title = ''
            if (this.period === 'Week') {
                title = 'message.peopleYouMetWith'
            } else if (this.period === 'WeekAhead') {
                title = 'message.peopleYouAreMeetingWith'
            }
            return title
        },
        meetingNetworkCompaniesTitle() {
            let title = ''
            if (this.period === 'Week') {
                title = 'message.companiesYouMeetWith'
            } else if (this.period === 'WeekAhead') {
                title = 'message.companiesYouAreMeetingWith'
            }
            return title
        },
    },
    methods: {
        onChangeType(index) {
            this.activeTab = index
        },
    },
}
</script>

<style lang="scss" scoped>
.meeting-network {
    .comparison-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
.compare-link {
    cursor: pointer;
}
</style>
