<template>
    <v-timeline-item fill-dot color="transparent" class="meeting-timeline-item">
        <div slot="icon" class="time-line-dot">
            <v-img class="dot" src="/static/img/icon-calendar-time.svg"></v-img>
            <v-icon class="person" v-if="isCompletedMeeting">person</v-icon>
        </div>
        <v-card
            flat
            class="meeting-card mb-2"
            :color="appointment.category === 'tentative' ? 'grey' : ''"
            :dark="appointment.category === 'tentative'"
        >
            <i class="zmdi zmdi-circle secondary--text font-xxl progress-mark" v-if="isCurrentMeeting"></i>
            <v-layout row wrap ma-0 align-start>
                <!-- Meeting info -->
                <v-flex md8 sm6>
                    <v-layout row>
                        <v-flex grow>
                            <h5 class="py-0 font-lg">{{ appointment.title }}</h5>
                        </v-flex>
                    </v-layout>
                    <v-flex
                        py-0
                        class="d-flex align-items-center"
                        :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }"
                    >
                        <span class="font-xs">
                            {{ appointment.from | normalizeDate('dddd') }}
                            {{ appointment.time1 }}
                            -
                            {{ appointment.time2 }}
                            ({{ appointment.hours | pluralize('hour') }})
                        </span>
                        <div class="d-flex" :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }">
                            <span class="font-xs d-custom-flex align-center">
                                <template v-if="appointment.category === 'meeting'">
                                    <v-icon class="mr-1" size="12">fa fa-users</v-icon>
                                    {{ Object.keys(appointment.attendees).length | pluralize('Attendee') }}
                                </template>
                                <template v-else-if="appointment.category === 'tentative'">
                                    <v-icon small color="grey" class="mr-1">ti-na</v-icon>
                                    Not Attending.
                                </template>
                            </span>
                        </div>
                    </v-flex>
                    <v-flex py-0 class="">
                        <span class="font-xs">Organizer: {{ organizer }}</span>
                    </v-flex>
                    <v-flex
                        py-0
                        class="d-flex align-items-center"
                        :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }"
                        v-if="appointment.category === 'meeting'"
                    >
                        <span class="font-xs text-capitalize">
                            {{
                                $t('message.recurringPeriod', {
                                    period: appointment.recurrence,
                                })
                            }}
                        </span>
                    </v-flex>
                </v-flex>
                <v-flex md4 sm6 :pt-0="$vuetify.breakpoint.xs" v-if="appointment.category === 'meeting'">
                    <v-flex py-0>
                        <v-btn depressed block color="primary" class="btn-meeting" @click="openMeetingTagDialog">
                            Add Tag to Event
                        </v-btn>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-card>
    </v-timeline-item>
</template>

<script>
import moment from 'moment-timezone'
import { isEmpty } from 'lodash'

export default {
    name: 'PlannerMeetingCard',
    components: {
        // EventRateMeeting,
        // EventActions,
    },
    props: {
        appointment: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            loading: false,
        }
    },
    mounted() {},
    methods: {
        openMeetingTagDialog() {
            this.$emit('open_meeting_tag_dialog', this.appointment.originalId, this.appointment.tag)
        },
    },
    computed: {
        isCompletedMeeting() {
            const { to } = this.appointment
            return moment().isAfter(moment(to))
        },
        isCurrentMeeting() {
            let { from, to } = this.appointment
            from -= 60 * 10 * 1000 // allow joining 10 min prior
            return moment().isBetween(moment(from), moment(to))
        },
        isUpcomingMeeting() {
            const { from } = this.appointment
            return moment().isBefore(moment(from))
        },
        organizer() {
            if (this.appointment.isOrganizer) {
                return this.$store.getters.user.name
            } else {
                const { attendees } = this.appointment
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
    },
}
</script>

<style lang="scss" scoped>
.meeting-timeline-item {
    /deep/ .v-timeline-item__dot {
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;

        .time-line-dot {
            position: relative;
            flex: 1;

            .dot {
                opacity: 0.5;
            }

            .person {
                position: absolute;
                left: 0;
                bottom: -5px;
                color: $light-dark;
            }
        }
    }

    .meeting-card {
        color: $body-color;
        background: transparent;
        border: 1px solid $gray;
        @include border-radius(5px);

        &::before,
        &::after {
            display: none;
        }

        .progress-mark {
            position: absolute;
            top: -10px;
            left: -10px;
        }

        .flex-column {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
        }

        .btn-meeting {
            text-transform: none;
            @include border-radius(3px);
        }

        .btn-atttending {
            height: 100%;
            color: $body-color;
            text-transform: none;
            border-color: $gray;
            @include border-radius(3px);
        }
    }
}
</style>
