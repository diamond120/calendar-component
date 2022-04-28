<template>
    <v-layout row wrap mx-auto class="login-button-container">
        <v-img
            src="/static/img/btn_google_signin.png"
            srcset="/static/img/btn_google_signin.png 1x, /static/img/btn_google_signin@2x.png 2x"
            @click="google()"
            v-if="googleEnabled"
            :contain="true"
            position="center"
            max-height="42"
        />
    </v-layout>
</template>

<script>
export default {
    props: {
        googleCallback: {
            type: Function,
            default: () => {},
        },
    },
    data() {
        return {
            googleEnabled: false,
        }
    },
    methods: {
        google() {
            this.googleCallback && this.googleCallback()
        },
    },
    mounted() {
        this.$nextTick(async function() {
            await this.$authenticator.googleInitPromise
            this.googleEnabled = true
        })
    },
}
</script>

<style lang="scss" scoped>
.login-button-container {
    max-width: 500px;

    .v-image {
        cursor: pointer;
        width: 200px;
    }
}
</style>
