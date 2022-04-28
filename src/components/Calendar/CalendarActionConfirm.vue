<template>
    <v-dialog content-class="invite-dropdown" v-model="dialog" max-width="500">
        <!-- Box content -->
        <div class="dropdown-content">
            <div class="dropdown-top d-custom-flex justify-space-between primary">
                <!-- Header -->
                <span class="white--text fw-bold">Edit recurring event</span>
            </div>
            <v-card>
                <v-card-text>
                    <v-radio-group v-model="actionConfirm">
                        <v-radio
                            v-for="(confirm, index) in actionConfirmTyes"
                            :key="index"
                            :label="confirm.label"
                            :value="confirm.value"
                        ></v-radio>
                    </v-radio-group>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- Action Button -->
                    <v-btn flat @click="dialog = false">
                        Cancel
                    </v-btn>
                    <v-btn flat color="primary" @click="saveEvent">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-dialog>
</template>

<script>
export default {
    props: ['appointment', 'action'],
    data() {
        return {
            dialog: false,
            actionConfirm: 'one', // one, all,
            actionConfirmTyes: [
                {
                    value: 'one',
                    label: 'This event',
                },
                {
                    value: 'all',
                    label: 'This and following events',
                },
            ],
        }
    },
    methods: {
        open() {
            this.dialog = true
        },
        saveEvent() {
            // save event settings here
            const { action, actionConfirm } = this
            this.$store.commit('modifyEvent', {
                id: this.appointment.id,
                type: action.eventType,
                rcr: actionConfirm === 'all',
                origin: 'Calendar Menu',
            })
            this.dialog = false
        },
    },
}
</script>
