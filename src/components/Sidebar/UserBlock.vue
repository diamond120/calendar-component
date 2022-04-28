<template>
    <v-list-tile class="sidebar-profile">
        <v-list-tile-avatar>
            <img :src="user.picture" alt="avatar" height="40" width="40" class="img-responsive" />
        </v-list-tile-avatar>
        <v-list-tile-content class="ml-3">
            <v-list-tile-title>
                <span>{{ user.name }}</span>
            </v-list-tile-title>
        </v-list-tile-content>
        <v-menu
            bottom
            offset-y
            left
            content-class="userblock-dropdown"
            nudge-top="-10"
            nudge-right="0"
            transition="slide-y-transition"
        >
            <v-btn dark icon slot="activator" class="ma-0">
                <v-icon>more_vert</v-icon>
            </v-btn>
            <div class="dropdown-content">
                <div class="dropdown-top white--text primary">
                    <span class="white--text fs-14 fw-bold d-block">{{ user.name }}</span>
                    <span class="d-block fs-12 fw-light">{{ user.email }}</span>
                </div>
                <v-list class="dropdown-list">
                    <v-list-tile @click="openUserSettings">
                        <i class="ti-settings mr-3 primary--text"></i>
                        <span>{{ $t('message.userSettings') }}</span>
                    </v-list-tile>
                    <v-list-tile @click="logoutUser">
                        <i class="ti-power-off mr-3 error--text"></i>
                        <span>{{ $t('message.logOut') }}</span>
                    </v-list-tile>
                </v-list>
            </div>
        </v-menu>
        <user-settings ref="userSettings" />
    </v-list-tile>
</template>

<script>
import UserSettings from '@/components/UserSettings'
import { mapGetters } from 'vuex'

export default {
    name: 'UserBlock',
    components: {
        UserSettings,
    },
    methods: {
        openUserSettings() {
            this.$refs.userSettings.open()
        },
        logoutUser() {
            this.$store.dispatch('logoutUser')
        },
    },
    computed: {
        ...mapGetters(['user']),
    },
}
</script>
