<template>
    <div class="week-look-ahead-view">
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12 py-0>
                    <skeleton-list :data="events" :repeat="15" :enable-animation="true">
                        <w-d-calendar :configuration="config" :appointments="events" />
                    </skeleton-list>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import WDCalendar from '@/components/Calendar/WDCalendar'
import { config } from '@/components/Calendar/CalendarConfig'

export default {
    name: 'WeekLookAheadView',
    components: {
        WDCalendar,
    },
    props: ['events'],
    data() {
        return {
            loader: false,
            config,
        }
    },
}
</script>
