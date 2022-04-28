<template>
    <div class="mf-calendar-day">
        <!-- Calendar cell(quarter) view -->
        <w-d-calendar-cell
            v-for="quarter in day.date_hours"
            :key="`${day.date}_${quarter.index}`"
            :cell-data.sync="quarter"
            :dayTentatives="sortedTentatives"
            :dayOOOs="sortedOOOs"
            :tentativeColumnCount="tentativeColumnCount"
        ></w-d-calendar-cell>
    </div>
</template>

<script>
import isSameDay from 'date-fns/is_same_day'
import orderBy from 'lodash/orderBy'
import isEmpty from 'lodash/isEmpty'
import difference from 'lodash/difference'
import WDCalendarCell from './WDCalendarCell'

export default {
    name: 'WDCalendarDay',
    props: ['day'],
    inject: ['calendarOptions'],
    components: {
        WDCalendarCell,
    },
    computed: {
        dayTentatives() {
            const { date } = this.day
            const { existing_appointments: appointments } = this.calendarOptions
            return orderBy(
                appointments.filter(
                    appointment => appointment.data.category === 'tentative' && isSameDay(appointment.data.from, date)
                ),
                ['start']
            )
        },
        dayMeetings() {
            const { date } = this.day
            const { existing_appointments: appointments } = this.calendarOptions
            return orderBy(
                appointments.filter(
                    appointment => appointment.data.category === 'meeting' && isSameDay(appointment.data.from, date)
                ),
                ['start']
            )
        },
        sortedTentatives() {
            let blocks = [...this.dayTentatives]
            let sortedBlocks = []
            while (!isEmpty(blocks)) {
                let rblocks = []
                for (const block of blocks) {
                    if (isEmpty(rblocks) || (!isEmpty(rblocks) && rblocks[rblocks.length - 1].end <= block.start)) {
                        rblocks.push(block)
                    }
                }
                sortedBlocks.push(rblocks)
                blocks = [...difference(blocks, rblocks)]
            }
            return sortedBlocks
        },
        dayOOOs() {
            const { date } = this.day
            const { existing_appointments: appointments } = this.calendarOptions
            return orderBy(
                appointments.filter(
                    appointment => appointment.data.category === 'ooo' && isSameDay(appointment.data.from, date)
                ),
                ['start']
            )
        },
        sortedOOOs() {
            let blocks = [...this.dayOOOs]
            let sortedBlocks = []
            while (!isEmpty(blocks)) {
                let rblocks = []
                for (const block of blocks) {
                    if (isEmpty(rblocks) || (!isEmpty(rblocks) && rblocks[rblocks.length - 1].end <= block.start)) {
                        rblocks.push(block)
                    }
                }
                sortedBlocks.push(rblocks)
                blocks = [...difference(blocks, rblocks)]
            }
            return sortedBlocks
        },
        tentativeColumnCount() {
            let meetings = [...this.dayMeetings]
            let sortedTentatives = [...this.sortedTentatives]
            if (isEmpty(meetings) || isEmpty(sortedTentatives)) {
                return 0
            }
            const lastTentatives = sortedTentatives[sortedTentatives.length - 1]
            for (const tentative of lastTentatives) {
                for (const meeting of meetings) {
                    if (tentative.start <= meeting.start && tentative.end > meeting.start) {
                        return sortedTentatives.length + 1
                    }
                }
            }
            return sortedTentatives.length
        },
    },
}
</script>

<style lang="scss" scoped>
.mf-calendar-day {
    position: relative;
    display: flex;
}
</style>
