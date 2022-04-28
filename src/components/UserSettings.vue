<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent transition="dialog-bottom-transition" max-width="600px">
            <v-card>
                <v-toolbar dark color="secondary">
                    <v-btn icon dark @click.native="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                        {{ $t('message.userSettings') }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="saveUserSettings">
                            {{ $t('message.save') }}
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <!-- Settings -->
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title class="pb-0">
                            <div class="headline">
                                {{ $t('message.notificationSettings') }}
                            </div>
                        </v-card-title>
                    </v-flex>
                    <v-flex xs12 pl-5>
                        <v-card-text>
                            <div class="subheader my-1">
                                {{ $t('message.notificationTitle') }}
                            </div>
                            <p class="font-xs mb-0">
                                {{ $t('message.notificationDescription') }}
                            </p>
                            <v-layout row wrap mt-3>
                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-flex xs3 offset-xs9>
                                            {{ $t('message.notificationEmail') }}
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs9 align-center pl-3>
                                            {{
                                                `${$t('message.notificationWAnalyzerReminder')}${
                                                    this.showWarningFor('wanalyzer') ? ' *' : ''
                                                }`
                                            }}
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-switch v-model="notifications.email_wanalyzer"></v-switch>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs9 align-center pl-3>
                                            {{
                                                `${$t('message.notificationWPlannerReminder')}${
                                                    this.showWarningFor('wplanner') ? ' *' : ''
                                                }`
                                            }}
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-switch v-model="notifications.email_wplanner"></v-switch>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs9 align-center pl-3>
                                            {{
                                                `${$t('message.notificationMAnalzyerReminder')}${
                                                    this.showWarningFor('manalyzer') ? ' *' : ''
                                                }`
                                            }}
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-switch v-model="notifications.email_manalyzer"></v-switch>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap v-if="showWarning">
                                        <v-flex xs8 align-center pl-3 red--text font-xs>
                                            {{ $t('message.notificationDisabling') }}
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title class="pb-0">
                            <div class="headline">
                                {{ $t('message.deleteYourAccount') }}
                            </div>
                        </v-card-title>
                    </v-flex>
                    <v-flex xs12 pl-5>
                        <v-card-text>
                            <p>
                                {{ $t('message.deleteSadMessage') }}
                            </p>
                            <p>
                                <small>
                                    {{ $t('message.deleteDescription') }}
                                </small>
                            </p>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn color="error" @click="showBeforeYouGo = true">{{
                                        $t('message.deleteMyAccount')
                                    }}</v-btn>
                                </v-flex>
                            </v-layout>
                            <v-flex xs12 v-if="showBeforeYouGo">
                                <v-layout row>
                                    <v-flex xs6>
                                        <v-btn color="info" @click="showBeforeYouGo = false">{{
                                            $t('message.cancelDeletion')
                                        }}</v-btn>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-btn color="error" @click="deleteAccount">{{
                                            $t('message.confirmDeletion')
                                        }}</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-card-text>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
export default {
    name: 'UserSettings',
    data() {
        return {
            dialog: false,
            notifications: {
                email_wanalyzer: false,
                email_wplanner: false,
                email_manalyzer: false,
            },
            showBeforeYouGo: false,
        }
    },
    computed: {
        storedSettings() {
            return this.$store.getters.settings.notifications
        },
        showWarning() {
            const { email_wanalzyer, email_wplanner, email_manalyzer } = this.notifications
            return !email_wanalzyer || !email_wplanner || !email_manalyzer
        },
    },
    methods: {
        open() {
            this.dialog = true
        },
        saveUserSettings() {
            // save user settings here
            this.$store.dispatch('setSettings', {
                notifications: Object.assign({}, this.notifications),
            })
            this.dialog = false
        },
        showWarningFor(type) {
            return !this.notifications[`email_${type}`]
        },
        deleteAccount() {
            this.$store.dispatch('deleteAccount')
        },
    },
    watch: {
        storedSettings(val) {
            if (val) {
                for (const k of Object.keys(this.notifications)) {
                    this.$set(this.notifications, k, val[k])
                }
            }
        },
    },
    mounted() {
        this.$store.dispatch('getSettings')
    },
}
</script>

<style lang="scss" scoped>
.headline {
    font-size: $font-size-base;
    color: $secondary;
}
.subheader {
    font-size: $font-size-md;
    font-weight: $font-weight-semi-bold;
}
.target-input-box {
    flex: 0 0 60px;
}
</style>
