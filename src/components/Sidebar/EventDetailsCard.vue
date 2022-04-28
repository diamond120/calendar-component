<template>
    <div class="details-card">
        <span class="font-xs ml-2">
            <v-icon>fa fa-user{{ appointment.tag_critical ? 's' : '' }}</v-icon>
            {{ appointment.tag_critical ? 'Workbetter-Duhs Critical Meeting' : 'Workbetter-Duhs Personal Meeting' }}
        </span>
        <div class="content-details">
            <div class="mt-1 ml-2">
                <template v-if="appointment.isRecurring && appointment.recurrence">
                    <i class="zmdi zmdi-refresh-alt"></i>
                    <span class="text-capital">
                        {{
                            $t('message.recurringPeriod', {
                                period: appointment.recurrence,
                            })
                        }}
                    </span>
                </template>
                <template v-else>
                    <v-icon>bookmark_border</v-icon>
                    <span>{{ $t('message.singleOccurrance') }}</span>
                </template>
            </div>
            <template v-if="appointment.attendees.length">
                <div class="attendees-list ml-2">
                    <i class="zmdi zmdi-accounts-alt"></i>
                    <span class="ml-2">
                        {{
                            $tc('message.numberOfAttendees', appointment.attendees.length, {
                                count: appointment.attendees.length,
                            })
                        }}
                    </span>
                    <div class="text-xs-center team-avatar">
                        <ul class="list-inline">
                            <li v-for="(attendee, index) in appointment.attendees" :key="index">
                                <div>
                                    <template v-if="attendee.name">
                                        <v-tooltip top>
                                            <div slot="activator" class="fw-bold">
                                                <span>{{ attendee.name.charAt(0).toUpperCase() }}</span>
                                            </div>
                                            <span class="fw-bold">{{ attendee.name }}</span>
                                            <br />
                                            <span>{{ attendee.email }}</span>
                                            <br />
                                            <template v-if="attendee.org">
                                                <i class="zmdi zmdi-odnoklassniki primary--text mr-2 fs-14"></i>
                                                <span class="primary--text">
                                                    {{ $t('message.organizer') }}
                                                </span>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                    <template v-else>
                                        <v-tooltip top>
                                            <div slot="activator" class="fw-bold">
                                                {{ attendee.email.charAt(0).toUpperCase() }}
                                            </div>
                                            <span class="fw-bold">{{ attendee.email }}</span>
                                            <br />
                                            <template v-if="attendee.org">
                                                <i class="zmdi zmdi-odnoklassniki primary--text fs-14"></i>
                                                <span class="primary--text">
                                                    {{ $t('message.organizer') }}
                                                </span>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-if="appointment.description">
                <div class="event-description mt-1 ml-2">
                    <v-icon class="zmdi zmdi-format-subject font-weight-light"></v-icon>
                    <span class="description ml-1">
                        {{ appointment.description }}
                    </span>
                </div>
            </template>
            <v-divider></v-divider>
            <div class="meetings-box">
                <template v-if="appointment.tag_critical || appointment.tag_personal">
                    <v-flex mx-2>
                        <v-btn class="meetinig-btn d-block white--text" block depressed @click="alert()">
                            <v-icon color="white" left class="ml-4 mr-2">fa fa-edit</v-icon>
                            <template v-if="appointment.tag_critical">
                                {{ $t('message.updateToPersonalTag') }}
                            </template>
                            <template v-if="appointment.tag_personal">
                                {{ $t('message.updateToCriticalTag') }}
                            </template>
                        </v-btn>
                    </v-flex>
                </template>
                <template v-else>
                    <v-flex mx-2>
                        <v-btn class="meetinig-btn d-block white--text" block depressed @click="alert()">
                            <v-icon color="white" left class="ml-4 mr-2">fa fa-plus</v-icon>
                            {{ $t('message.addTagToEvent') }}
                        </v-btn>
                    </v-flex>
                </template>
            </div>
            <v-list class="pa-2">
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <span>{{ $t('message.firstScheduled') }}</span>
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="mt-2">
                        <span>
                            {{
                                `${appointment.scheduled1}
                                (${$tc('message.numberOfDays', Math.abs(appointment.scheduleDiff1), {
                                    count: Math.abs(appointment.scheduleDiff1),
                                })})`
                            }}
                        </span>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-if="appointment.reschedules">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <span>{{ $t('message.schedules') }}</span>
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="mt-2">
                        <span>{{ appointment.reschedules.count }} times</span>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-if="appointment.reschedules">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <span>{{ $t('message.lastSchedule') }}</span>
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="mt-2">
                        <span>
                            {{
                                `${appointment.reschedules.last}
                                (${$tc('message.numberOfDays', Math.abs(appointment.reschedules.diff), {
                                    count: Math.abs(appointment.reschedules.diff),
                                })})`
                            }}
                        </span>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </div>
    </div>
</template>

<script>
import moment from 'moment-timezone'
import { differenceInMinutes } from 'date-fns'

export default {
    props: ['appointment'],
    data() {
        return {
            interval: undefined,
            diffMinsFromEventStart: NaN,
        }
    },
    methods: {
        calcDiffMinsFromEvent() {
            if (this.diffMinsFromEventStart <= 0) return
            const { timezone } = this.$store.getters.user
            // const timezone = 'America/Chicago'
            this.diffMinsFromEventStart = differenceInMinutes(moment(this.appointment.from), moment.tz(timezone))
        },
        alert() {
            alert('update workbetter meeting tag')
        },
    },
    created() {
        this.calcDiffMinsFromEvent()
        this.interval = setInterval(this.calcDiffMinsFromEvent, 60 * 1000)
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined
        }
    },
}
</script>

<style lang="scss" scoped>
.details-card {
    .v-icon {
        font-size: 14px;
        font-weight: $font-weight-bold;
        color: $focus-color;
        max-width: 10px;
        margin-right: 3px;
    }

    .content-details {
        border: 2px solid $gray;
        span {
            color: $light-dark;
            font-size: $font-size-xs;
        }

        .attendees-list {
            display: flex;
            align-items: center;

            .team-avatar {
                margin-left: auto !important;

                .attendee-detail {
                    display: flex;
                    flex-direction: column;
                }
            }
            .attendees-group {
                font-size: 12px;
            }
        }

        .event-description {
            display: flex;
            align-items: flex-start;

            .description {
                font-size: 0.72rem;
            }
        }

        .meetings-box {
            .v-btn {
                text-transform: none;
            }
            .meetinig-btn {
                font-size: $font-size-xs;
                font-weight: $font-weight-bold;
                background-color: $focus-color; // lighten($color: $focus-color, $amount: 5);
                border-color: $focus-color;
                @include border-radius(3px);

                .v-icon {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
