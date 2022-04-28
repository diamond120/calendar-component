<template>
    <v-app
        :dark="darkMode"
        id="inspire"
        :class="[
            {
                'box-layout': boxLayout,
                'collapse-sidebar': collapseSidebar,
                'rtl-layout': rtlLayout,
            },
        ]"
    >
        <v-layout align-start justify-center fill-height class="session-container">
            <v-flex md6 text-center>
                <router-view />
            </v-flex>
        </v-layout>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'preauth',
    computed: {
        ...mapGetters(['darkMode', 'collapseSidebar', 'boxLayout', 'rtlLayout']),
    },
}
</script>

<style lang="scss" scoped>
.session-container {
    padding-top: 10%;
    background: url('/static/img/signup-bg.png') center/cover no-repeat;
    color: #fff;
}
</style>
