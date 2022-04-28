<template>
    <v-layout row>
        <v-flex xs11>
            <span class="white--text font-sm fw-bold">
                {{ eventTitle }}
            </span>
            <span class="white--text font-xs">
                {{ appointment.time1 }}
                -
                {{ appointment.time2 }}
                ({{ appointment.hours }}
                hours)
            </span>
            <span class="white--text font-xs">Organizer: {{ organizer }}</span>
        </v-flex>
    </v-layout>
</template>

<script>
import { isEmpty } from 'lodash'
import AppConfig from '@/constants/AppConfig'

export default {
    props: ['appointment'],
    data() {
        return {
            TAG_CRITICAL: AppConfig.meetingTag.critical,
            TAG_PERSONAL: AppConfig.meetingTag.personal,
        }
    },
    computed: {
        eventTitle() {
            if (this.appointment.title.includes(this.TAG_CRITICAL)) {
                return this.appointment.title.replace(this.TAG_CRITICAL, '')
            }

            if (this.appointment.title.includes(this.TAG_PERSONAL)) {
                return this.appointment.title.replace(this.TAG_PERSONAL, '')
            }

            return this.appointment.title
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
