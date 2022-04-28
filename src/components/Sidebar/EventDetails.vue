<template>
    <vue-perfect-scrollbar class="rightsidebar-scroll-area" id="details-scroll" :settings="settings">
        <div class="inner-toolbar">
            <v-timeline dense clipped align-top class="pt-0">
                <dl>
                    <template v-for="(entry, index) in events">
                        <dt :key="entry.dl" :id="`anchor-details-${index}`" class="mb-1">
                            <v-timeline-item small class="pb-0" hide-dot>
                                <h4 class="gradient-border">
                                    <span>{{ entry.d1 }}</span>
                                    <span>{{ entry.d2 }}</span>
                                </h4>
                            </v-timeline-item>
                        </dt>
                        <template v-for="block in entry.blocks">
                            <dd :key="block.id" :id="`anchor-details-${block.id}`" class="mb-2">
                                <v-timeline-item
                                    small
                                    fill-dot
                                    :color="eventColor(block.category)"
                                    class="pb-2"
                                    v-if="block.category === 'meeting'"
                                >
                                    <v-card :color="eventColor(block.category)">
                                        <v-card-title>
                                            <event-card-title :appointment="block"></event-card-title>
                                        </v-card-title>
                                        <v-card-text class="white">
                                            <event-details-card :appointment="block"></event-details-card>
                                        </v-card-text>
                                    </v-card>
                                </v-timeline-item>
                                <v-timeline-item small fill-dot color="grey" :key="block.from" class="pb-2" v-else>
                                    <v-card color="grey">
                                        <v-card-title>
                                            <event-card-title :appointment="block"></event-card-title>
                                        </v-card-title>
                                        <v-card-text class="white">
                                            <v-icon small color="grey">
                                                ti-na
                                            </v-icon>
                                            <span class="grey--text font-sm ml-2">
                                                Not Attending.
                                            </span>
                                        </v-card-text>
                                    </v-card>
                                </v-timeline-item>
                            </dd>
                        </template>
                    </template>
                </dl>
            </v-timeline>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
import EventCardTitle from '@/components/Sidebar/EventCardTitle'
import EventDetailsCard from '@/components/Sidebar/EventDetailsCard'
import { scrollTo } from '@/helpers/helpers'

export default {
    props: ['events', 'settings'],
    components: {
        EventCardTitle,
        EventDetailsCard,
    },
    methods: {
        eventColor(category) {
            if (category === 'meeting') {
                return 'rgba(93, 200, 224, 0.75)'
            }
            if (category === 'tentative') {
                return 'grey'
            }
        },
        scrollToSelectedEventWithAnimation(eventId) {
            this.$nextTick(() => {
                const scrollViewDetails = document.getElementById('details-scroll')
                const eventElementDetails = document.getElementById(`anchor-details-${eventId}`)
                if (eventElementDetails) {
                    this.$nextTick(() => {
                        scrollTo(scrollViewDetails, eventElementDetails.offsetTop - 40, 1000)
                    })
                }
            })
        },
        scrollToSelectedEvent(eventId) {
            this.$nextTick(() => {
                const scrollViewDetails = document.getElementById('details-scroll')
                const eventElementDetails = document.getElementById(`anchor-details-${eventId}`)
                if (eventElementDetails) {
                    this.$nextTick(() => {
                        scrollViewDetails.scrollTop = 0
                        scrollViewDetails.scrollTop = eventElementDetails.offsetTop - 40
                    })
                }
            })
        },
        scrollToSelectedDayWithAnimation(dayForScroll) {
            this.$nextTick(() => {
                const scrollViewDetails = document.getElementById('details-scroll')
                const eventElementDetails = document.getElementById(`anchor-details-${dayForScroll}`)
                if (eventElementDetails) {
                    this.$nextTick(() => {
                        scrollViewDetails.scrollTop = 0
                        scrollTo(scrollViewDetails, eventElementDetails.offsetTop + 25, 1000)
                    })
                }
            })
        },
        scrollToSelectedDay(dayForScroll) {
            this.$nextTick(() => {
                const scrollViewDetails = document.getElementById('details-scroll')
                const eventElementDetails = document.getElementById(`anchor-details-${dayForScroll}`)
                if (eventElementDetails) {
                    this.$nextTick(() => {
                        scrollViewDetails.scrollTop = 0
                        scrollViewDetails.scrollTop = eventElementDetails.offsetTop + 25
                    })
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
dt {
    position: -webkit-sticky;
    position: sticky;
    top: -2px;
    z-index: 999;
    padding-top: 3px;
}
.v-card__text {
    padding: 10px;
}
</style>
