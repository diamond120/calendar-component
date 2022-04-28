<template>
    <div>
        <v-layout class="ma-0 cell-title" :style="astyle">
            <h4 :title="appointment.data.title" ref="title">
                {{ eventTitle }}
            </h4>
            <v-spacer></v-spacer>
            <template v-if="sameLinePosition">
                <cell-meeting-tag v-if="collapsed" collapsed :title="tagTitle" :type="tagType"></cell-meeting-tag>
                <cell-meeting-tag v-else :title="tagTitle" :type="tagType"></cell-meeting-tag>
            </template>
            <calendar-actions class="calendar-action" :appointment="appointment"></calendar-actions>
        </v-layout>
        <v-layout class="ma-0 cell-title" ref="doubleLine" v-if="!sameLinePosition">
            <cell-meeting-tag v-if="collapsed" collapsed :title="tagTitle" :type="tagType"></cell-meeting-tag>
            <cell-meeting-tag v-else :title="tagTitle" :type="tagType"></cell-meeting-tag>
        </v-layout>
    </div>
</template>

<script>
import CalendarActions from './CalendarActions'
import CellMeetingTag from './WDCalendarCellMeetingTag'
import AppConfig from '@/constants/AppConfig'

export default {
    name: 'WDCalendarCellTitleMeeting',
    components: {
        CalendarActions,
        CellMeetingTag,
    },
    props: ['appointment', 'astyle', 'eventHeight'],
    data() {
        return {
            sameLinePosition: false,
            collapsed: false,
            TAG_CRITICAL: AppConfig.meetingTag.critical,
            TAG_PERSONAL: AppConfig.meetingTag.personal,
        }
    },
    computed: {
        eventTitle() {
            if (this.appointment.data.title.includes(this.TAG_CRITICAL)) {
                return this.appointment.data.title.replace(this.TAG_CRITICAL, '')
            }

            if (this.appointment.data.title.includes(this.TAG_PERSONAL)) {
                return this.appointment.data.title.replace(this.TAG_PERSONAL, '')
            }

            return this.appointment.data.title
        },
        tagTitle() {
            if (this.appointment.data.tag_critical) {
                return 'Workbetter-Duhs Critical Meeting'
            } else {
                return 'Workbetter-Duhs Personal Meeting'
            }
        },
        tagType() {
            if (this.appointment.data.tag_critical) {
                return this.TAG_CRITICAL
            } else {
                return this.TAG_PERSONAL
            }
        },
    },
    methods: {
        recalc() {
            if (!this.$refs.title) return false

            const eventHeight = this.eventHeight()
            const titleHeight = this.$refs.title.clientHeight || 1
            const titleWidth = this.$refs.title.clientWidth || 100
            const percentage = parseFloat(this.astyle.width || 100) / 100
            this.sameLinePosition = (eventHeight + 1) / titleHeight < 2
            if (this.sameLinePosition) {
                this.collapsed = titleWidth > 245 * percentage - 83
            } else {
                if (this.$refs.doubleLine) {
                    const doubleLineWidth = this.$refs.doubleLine.clientWidth
                    this.collapsed = doubleLineWidth * percentage < 65
                }
            }
        },
    },
    updated() {
        this.recalc()
    },
    mounted() {
        this.recalc()
    },
}
</script>

<style lang="scss" scoped>
.cell-title {
    h4,
    p,
    span {
        margin: 0;
    }
    h4 {
        padding: 5px;
        font-size: 0.75rem;
        font-weight: $font-weight-bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    &:hover h4 {
        white-space: normal;
    }
}
</style>
