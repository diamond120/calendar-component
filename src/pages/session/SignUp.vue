<template>
    <div>
        <template v-if="step === 1">
            <h2 class="my-3">{{ $t('message.signupToDashboard') }}</h2>
            <social-buttons v-bind="{ googleCallback }" />
            <p class="fs-14 my-3">
                {{ $t('message.havingAnAccount') }}
                <router-link to="/session/login">
                    <h5 class="login">{{ $t('message.login') }}</h5>
                </router-link>
            </p>
        </template>
        <template v-else-if="step === 2">
            <p class="fs-16">
                {{ $t('message.registering') }}
            </p>
            <v-progress-circular indeterminate color="white"></v-progress-circular>
        </template>
        <template v-else-if="step === 3">
            <p class="fs-16">
                {{ $t('message.importingevents') }}
            </p>
            <v-progress-circular indeterminate color="white"></v-progress-circular>
        </template>
    </div>
</template>

<script>
import SocialButtons from '@/components/SocialButtons'
import AppConfig from '@/constants/AppConfig'
import { mapGetters } from 'vuex'

export default {
    components: {
        SocialButtons,
    },
    data() {
        return {
            valid: false,
            appLogo: AppConfig.appLogo2,
            step: 1,
        }
    },
    methods: {
        googleCallback() {
            this.$authenticator
                .googleGrantOffline(
                    'profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
                )
                .then(({ code }) => {
                    this.$store.dispatch('signupUser', code)
                    this.step = 2
                    this.$store.dispatch('calendarIntegration', {
                        provider: 'Google',
                        authorization: 'success',
                    })
                })
                .catch(e => {
                    this.$store.dispatch('calendarIntegration', {
                        provider: 'Google',
                        authorization: 'denied',
                    })
                })
            this.$store.commit('onLoginError', null)
            this.$store.dispatch('signUpInitiated', 'Google')
        },
    },
    computed: {
        ...mapGetters({
            signupResult: 'signupResult',
        }),
    },
    watch: {
        signupResult(res) {
            if (res) {
                this.step = 3
                this.$store.dispatch('signUpCompleted')
                this.$store.dispatch('importEvents')
            } else this.step = 1
        },
    },
}
</script>

<style lang="scss" scoped>
.login {
    color: pink;
}
</style>
