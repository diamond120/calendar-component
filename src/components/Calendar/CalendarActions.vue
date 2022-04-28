<template>
    <div>
        <!-- Event Action Menu -->
        <v-menu
            bottom
            offset-y
            left
            content-class="calendar-action-dropdown"
            nudge-top="-10"
            nudge-right="0"
            transition="slide-y-transition"
            @click.native.stop
        >
            <v-btn dark small icon slot="activator" class="ma-0">
                <v-icon small>more_vert</v-icon>
            </v-btn>
            <div class="dropdown-content">
                <div class="dropdown-top white--text primary">
                    <span class="white--text fs-14 fw-bold d-block">
                        {{ eventData.title }}
                        <span class="fs-12 fw-light" v-if="eventData.isRecurring">
                            (Recurring)
                        </span>
                    </span>
                </div>
                <v-list class="dropdown-list">
                    <v-subheader>
                        Add Tag to Event
                    </v-subheader>
                    <template v-for="(action, index) in actionTypes">
                        <v-list-tile @click="setEvent(action)" :key="index" ripple>
                            <v-list-tile-action>
                                <v-icon v-if="eventData[`${'tag_' + action.type}`]" color="secondary">
                                    done
                                </v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <span>{{ action.title }}</span>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </div>
        </v-menu>
        <!-- Confirm Modal -->
        <calendar-action-confirm
            ref="calendarActionConfirmModal"
            :appointment="appointment"
            :action="selectedAction"
        ></calendar-action-confirm>
    </div>
</template>

<script>
import CalendarActionConfirm from './CalendarActionConfirm'

export default {
    components: {
        CalendarActionConfirm,
    },
    props: ['appointment'],
    data() {
        return {
            actionTypes: [
                {
                    type: 'personal',
                    title: 'Add workbetter:personal Tag',
                },
                {
                    type: 'critical',
                    title: 'Add workbetter:critical Tag',
                },
            ],
            selectedAction: null,
        }
    },
    methods: {
        openConfirmModal() {
            this.$refs.calendarActionConfirmModal.open()
        },
        setEvent(action) {
            this.selectedAction = action
            // open confirm modal for the recurring event only
            if (this.eventData.isRecurring) {
                this.openConfirmModal()
            } else {
                this.$store.commit('modifyEvent', {
                    id: this.appointment.id,
                    type: action.eventType,
                    origin: 'Calendar Menu',
                })
            }
        },
    },
    computed: {
        eventData() {
            return this.appointment.data
        },
    },
}
</script>

<style lang="scss" scoped>
.calendar-action-dropdown {
    background-color: $base-light;
    .dropdown-content {
        //width: 225px;
        .dropdown-top {
            padding: 1rem 1.25rem;
        }
        .dropdown-list {
            background: transparent;
            > div {
                box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.11);
                margin: 0.3125rem;
                .v-list__tile {
                    background-color: $light;
                    span {
                        font-size: $font-size-sm;
                        transition: color 0.3s ease;
                    }
                    &:hover {
                        span {
                            color: $primary !important;
                        }
                        background-color: $light !important;
                    }
                    .v-list__tile__action {
                        min-width: 40px;
                    }
                    .sub-title {
                        position: absolute;
                        font-size: 10px;
                        bottom: 0;
                        left: 25px;
                    }
                }
            }
        }
    }
    .v-subheader {
        background: rgb(113, 230, 244);
    }
}
.v-btn--small {
    height: 24px;
}
</style>
