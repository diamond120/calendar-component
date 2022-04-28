<template>
    <div class="mf-calendar-cell">
        <div
            class="calendar-cell"
            :class="{
                'is-an-hour': (cellData.index + 1) % (60 / calendarOptions.split_value) === 0,
            }"
            :style="`height: ${calendarOptions.cell_height}px`"
        ></div>
        <div
            v-for="(appointment, aIndex) in cellAppointments"
            :key="`appointment-${appointment.id}`"
            class="cell_content_block"
            :class="{
                is_meeting: isCategory('meeting', aIndex),
                is_transition: isCategory('transition', aIndex),
                is_focus: isCategory('focus', aIndex),
                is_ooo: isCategory('ooo', aIndex),
                is_tentative: isCategory('tentative', aIndex),
                is_non_working: isCategory('non-working', aIndex),
            }"
            :style="appointmentStyle(aIndex)"
        >
            <v-tooltip
                color="white"
                top
                content-class="cellTooltip"
                nudge-top="-8"
                :disabled="!(appointment.data.category === 'meeting')"
                open-delay="1000"
            >
                <div
                    slot="activator"
                    v-if="appointment.data"
                    class="existing-event"
                    ref="event"
                    @click="selectEvent(appointment.id)"
                >
                    <template
                        v-if="
                            appointment.data.category === 'meeting' ||
                                appointment.data.category === 'ooo' ||
                                appointment.data.category === 'tentative'
                        "
                    >
                        <cell-title-meeting
                            :appointment="appointment"
                            :astyle="appointmentTitleStyle(aIndex)"
                            v-if="
                                appointment.data.category === 'meeting' &&
                                    (appointment.data.tag_critical || appointment.data.tag_personal)
                            "
                            :eventHeight="eventHeight(aIndex)"
                        />
                        <cell-title :appointment="appointment" :astyle="appointmentTitleStyle(aIndex)" v-else />
                        <small v-if="calendarOptions.show_description && appointment.end - appointment.start > 2">
                            {{ appointment.data.description }}
                        </small>
                        <span class="time" v-if="calendarOptions.show_hours">
                            {{ normalizeTime(appointment.data.from) }}
                            -
                            {{ normalizeTime(appointment.data.to) }}
                        </span>
                    </template>
                </div>
                <span v-if="appointment.data.category === 'meeting'">
                    <template
                        v-if="appointment.data.category === 'focus' || appointment.data.category === 'transition'"
                    >
                        <p class="ma-2">
                            <template v-if="appointment.data.category === 'focus'">
                                Focus Time:
                            </template>
                            <template v-else>
                                Transition Time:
                            </template>
                            {{ hours(aIndex) | normalizeNumber(2) }} hours<br />
                            ({{ normalizeTime(appointment.data.from) }} - {{ normalizeTime(appointment.data.to) }})
                        </p>
                    </template>
                    <p v-else-if="appointment.data.category === 'meeting'" class="ma-2">
                        <strong>{{ eventTitle(appointment.data.title) }}</strong>
                        <br />
                        {{ normalizeTime(appointment.data.from) }}
                        -
                        {{ normalizeTime(appointment.data.to) }}
                        ({{ hours(aIndex) | normalizeNumber(2) }} hours)
                        <br />
                        Organizer: {{ organizer(aIndex) }}<br />
                        <template v-if="appointment.data.tag_critical || appointment.data.tag_personal">
                            <br />
                            <span>
                                <v-icon>fa fa-user{{ appointment.data.tag_critical ? 's' : '' }}</v-icon>
                                {{
                                    appointment.data.tag_critical
                                        ? 'Workbetter-Duhs Critical Meeting'
                                        : 'Workbetter-Duhs Personal Meeting'
                                }}
                            </span>
                        </template>
                    </p>
                </span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
import { isEmpty } from 'lodash'
import { EventBus } from '@/lib/eventBus'
import { isSameDay, differenceInMinutes } from 'date-fns'
import moment from 'moment-timezone'
import CellTitle from './WDCalendarCellTitle'
import CellTitleMeeting from './WDCalendarCellTitleMeeting'
import AppConfig from '@/constants/AppConfig'

export default {
    name: 'WDCalendarCell',
    components: {
        CellTitle,
        CellTitleMeeting,
    },
    props: ['cellData', 'dayTentatives', 'tentativeColumnCount'],
    inject: ['calendarOptions'],
    data() {
        return {
            TAG_CRITICAL: AppConfig.meetingTag.critical,
            TAG_PERSONAL: AppConfig.meetingTag.personal,
        }
    },
    computed: {
        cellAppointments() {
            const { cellData } = this
            const { existing_appointments: appointments } = this.calendarOptions
            return appointments
                .filter(
                    appointment =>
                        appointment.start === cellData.index && isSameDay(appointment.data.from, cellData.value)
                )
                .map(appointment => appointment)
        },
    },
    methods: {
        eventTitle(title) {
            if (title.includes(this.TAG_CRITICAL)) {
                return title.replace(this.TAG_CRITICAL, '')
            }

            if (title.includes(this.TAG_PERSONAL)) {
                return title.replace(this.TAG_PERSONAL, '')
            }

            return title
        },
        isCategory(category, index) {
            const { cellAppointments } = this
            return cellAppointments[index] && cellAppointments[index].data.category === category
        },
        hours(index) {
            const { cellAppointments } = this
            if (!cellAppointments[index]) {
                return false
            }
            const mins = differenceInMinutes(cellAppointments[index].data.to, cellAppointments[index].data.from)
            return mins / 60
        },
        distance(index) {
            const { cellAppointments } = this
            if (!cellAppointments[index]) {
                return false
            }
            const { cell_height: cellHeight } = this.calendarOptions
            return (cellAppointments[index].end - cellAppointments[index].start + 1) * cellHeight
        },
        appointmentStyle(index) {
            let left = '0%'
            let right = '1px'
            let height = this.distance(index) + 'px'
            if (this.isCategory('tentative', index)) {
                const { tentativeColumnCount, dayTentatives, cellAppointments } = this
                const appointment = cellAppointments[index]
                let tCount = tentativeColumnCount
                let tIndex = dayTentatives.reduce(
                    (tNum, tentatives, hIndex) => {
                        if (tentatives.includes(appointment)) {
                            tNum = {
                                h: hIndex,
                                v: tentatives.indexOf(appointment),
                            }
                        }
                        return tNum
                    },
                    {
                        h: 0,
                        v: 0,
                    }
                )
                if (tCount < 2) tCount = 2
                if (tCount > 3) {
                    tCount = tCount - 1
                    const tentativeWidth = (100 * 2) / 3
                    left = `${100 - ((tIndex.h + 1) * tentativeWidth) / tCount}%`
                    right = `${(tIndex.h * tentativeWidth) / tCount}%`
                } else {
                    left = `${100 - ((tIndex.h + 1) * 100) / tCount}%`
                    right = `${(tIndex.h * 100) / tCount}%`
                }
            }
            return {
                left,
                right,
                height,
            }
        },
        appointmentTitleStyle(index) {
            let width = '100%'
            const { tentativeColumnCount, dayTentatives, cellAppointments } = this
            const appointment = cellAppointments[index]
            let tCount = tentativeColumnCount
            if (tCount < 2) tCount = 2
            let overlappings = 0
            if (this.isCategory('meeting', index) || this.isCategory('ooo', index)) {
                for (const tentatives of dayTentatives) {
                    for (const tentative of tentatives) {
                        if (tentative.start <= appointment.start && tentative.end > appointment.start) {
                            overlappings = overlappings + 1
                        }
                    }
                }
                let meetingTitleWidth = 100 - (overlappings * 100) / tCount
                if (meetingTitleWidth < (100 * 1) / 3) meetingTitleWidth = (100 * 1) / 3
                width = `${meetingTitleWidth}%`
            } else {
                width = '100%'
            }
            return {
                width,
            }
        },
        eventHeight(index) {
            return () => {
                return this.$refs.event && this.$refs.event[index] ? this.$refs.event[index].clientHeight : 0
            }
        },
        selectEvent(eventId) {
            EventBus.$emit('clickEvent', { eventId, from: 'calendar' })
        },
        organizer(index) {
            const appointment = this.cellAppointments[index]
            if (!appointment) return '-'
            if (appointment.data.isOrganizer) {
                return this.$store.getters.user.name
            } else {
                const { attendees } = appointment.data
                if (!isEmpty(attendees)) {
                    const attender = attendees.find(attendee => attendee.org === 1)
                    if (!isEmpty(attender)) {
                        if (attender.name) return attender.name
                        const recapPeers =
                            !isEmpty(this.$store.getters.recap) && !isEmpty(this.$store.getters.recap.attendees.peers)
                                ? this.$store.getters.recap.attendees.peers
                                : null
                        const plannerPeers =
                            !isEmpty(this.$store.getters.planner) &&
                            !isEmpty(this.$store.getters.planner.attendees.peers)
                                ? this.$store.getters.planner.attendees.peers
                                : null
                        const peers = recapPeers || plannerPeers
                        if (peers) {
                            const peerAttender = peers.find(attendee => attendee.email === attender.email)
                            if (!isEmpty(peerAttender)) {
                                return peerAttender.name
                            }
                        }
                        if (attender.email) return attender.email
                    }
                }
            }
            return '-'
        },
        normalizeTime(date) {
            const timezone = this.$store.getters.user.timezone
            // const timezone = 'America/Chicago'
            if (date) {
                return moment.tz(date, timezone).format('h:mm A')
            }
            return '?'
        },
    },
}
</script>

<style lang="scss" scoped>
$alpha: 0.75;
$meeting-color: rgba(
    $color: $meeting-color,
    $alpha: $alpha,
);
$transition-color: rgba(
    $color: $transition-color,
    $alpha: $alpha,
);
$focus-color: rgba(
    $color: $focus-color,
    $alpha: $alpha,
);
$ooo-color: rgba(
    $color: $gray-dark,
    $alpha: $alpha,
);
$tentative-color: rgba(0, 0, 0, 0.05);
$non-working-color: darken(
    $color: $transition-color,
    $amount: 20%,
);

.mf-calendar-cell {
    position: relative;

    .calendar-cell {
        border-right: solid 1px $border-color;
        z-index: 0;
        &.is-an-hour {
            border-bottom: solid 1px $border-color;
        }
    }

    .cell_content_block {
        position: absolute;
        top: 0;
        left: 0;
        right: 1px;
        z-index: 1;
        opacity: 1;
        // pointer-events: none;
        user-select: none;
        will-change: height; //padding: 4px 6px;

        .existing-event {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: default;
            word-break: break-word;
            font-size: $font-size-sm;
            background-color: #bfecff;
            opacity: 1;
            color: #1f6570;
            overflow: hidden;
            p,
            span {
                margin: 0;
            }
            .buttons {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: absolute;
                bottom: 0;
                left: 6px;
                button {
                    margin: 0;
                    width: 20px;
                    height: 20px;
                }
            }
            .time {
                position: absolute;
                bottom: 4px;
                right: 6px;
                font-size: 11px;
            }
        }

        &.is_meeting {
            .existing-event {
                color: white;
                background: $meeting-color;
                opacity: 1;
                cursor: pointer;
                @include border(1px solid, $border-color, bottom);
                &:hover {
                    background: darken($color: $meeting-color, $amount: 10%);
                }
            }
        }
        &.is_focus .existing-event {
            background: $focus-color url('/static/logos/logo.png') no-repeat;
            background-size: 34px 34px;
            background-position: center;
        }
        &.is_ooo {
            .existing-event {
                color: white;
                background: $ooo-color;
                opacity: 1;
                cursor: pointer;
                @include border(1px solid, $border-color, bottom);
                &:hover {
                    background: darken($color: $ooo-color, $amount: 10%);
                }
            }
        }
        &.is_transition .existing-event {
            background: $transition-color;
            opacity: 1;
        }
        &.is_tentative {
            z-index: 5;
            .existing-event {
                color: white;
                background-color: $tentative-color;
                cursor: pointer;
                @include border(1px solid, $border-color, top left right bottom);
                &:hover {
                    background: rgba(0, 0, 0, 0.35);
                }
                h4 {
                    font-weight: $font-weight-semi-bold;
                }
            }
        }
        &.is_non_working .existing-event {
            background-color: lighten($color: $non-working-color, $amount: 20%);
            border-left: solid 3px $non-working-color;
            color: darken($color: $non-working-color, $amount: 10%);
        }
    }
}

.cellTooltip {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $light-dark;

    p {
        margin: 0;
    }
}

.v-icon {
    font-size: 15px;
    color: $focus-color;
}
</style>
