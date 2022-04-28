<!-- Header Structure -->
<template>
    <div>
        <v-navigation-drawer
            v-if="!horizontal"
            app
            fixed
            v-model="drawer"
            :mini-variant="collapseSidebar"
            mini-variant-width="70"
            :width="250"
            class="workbetter-duhs-sidebar"
            :style="{ backgroundImage: 'url(' + selectedSidebarBgImage.url + ')' }"
            :class="{ 'background-none': !backgroundImage }"
            :right="rtlLayout"
        >
            <!-- App Sidebar -->
            <app-sidebar></app-sidebar>
        </v-navigation-drawer>
        <v-toolbar class="workbetter-duhs-toolbar" app :color="activeHeaderFilter.class">
            <div class="d-custom-flex align-items-center navbar-left">
                <div v-if="!horizontal">
                    <v-toolbar-side-icon
                        icon
                        large
                        @click.stop="drawer = !drawer"
                        class="v-step-0"
                    ></v-toolbar-side-icon>
                </div>
                <div class="site-logo-wrap d-custom-flex ml-0 align-items-center" v-else>
                    <router-link to="/horizontal/dashboard/ecommerce" class="grayish-blue site-logo-img">
                        <img src="/static/img/site-logo.png" alt="site logo" width="100" height="30" />
                    </router-link>
                </div>
                <div class="week-bar">
                    <span class="font-lg fw-semi-bold" v-if="pageTitle">
                        {{ $t(pageTitle) }}
                    </span>
                    <span class="grey--text mx-2">|</span>
                    <div class="secondary--text week-nav">
                        <v-btn
                            class="v-pagination__navigation v-step-1"
                            @click="changeWeek(-1)"
                            :disabled="!showLeft()"
                        >
                            <v-icon medium>chevron_left</v-icon>
                        </v-btn>
                        <div class="text-center">
                            {{ textOffset }}
                            <small>({{ currentWeek }})</small>
                        </div>
                        <v-btn
                            class="v-pagination__navigation v-step-2"
                            @click="changeWeek(1)"
                            :disabled="!showRight()"
                        >
                            <v-icon medium>chevron_right</v-icon>
                        </v-btn>
                    </div>
                </div>
                <div class="mobile-week d-none">
                    <div class="secondary--text text-center mobile-week-btn">
                        {{ textOffset }}
                        <small>({{ currentWeek }})</small>
                    </div>
                </div>
            </div>
            <div class="navbar-right">
                <v-btn icon large disabled v-if="!drawer" class="ml-3">
                    <img src="/static/logos/logo.png" height="40" />
                </v-btn>
            </div>
        </v-toolbar>
        <mobile-week-form></mobile-week-form>
    </div>
</template>

<script>
import Sidebar from '../Sidebar/Sidebar.vue'
import screenfull from 'screenfull'
import MobileWeekForm from './MobileWeekForm'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'

export default {
    name: 'Header',
    props: {
        horizontal: {
            default: false,
            type: Boolean,
        },
    },
    data() {
        return {
            collapsed: false, // collapse sidebar
            drawer: true, // sidebar drawer default true
            chatSidebar: false, // chat component right sidebar
            sidebarImages: '', // sidebar background images
            enableDefaultSidebar: false,
        }
    },
    computed: {
        ...mapGetters([
            'rtlLayout',
            'backgroundImage',
            'backgroundImage',
            'selectedSidebarBgImage',
            'darkMode',
            'collapseSidebar',
            'activeHeaderFilter',
        ]),
        pageTitle() {
            if (this.$breadcrumbs[0]) {
                return this.$breadcrumbs[0].meta.title
            }
            return undefined
        },
        offsetType() {
            if (this.$breadcrumbs[0]) {
                return this.$breadcrumbs[0].meta.type
            }
            return undefined
        },
        // eslint-disable-next-line vue/return-in-computed-property
        textOffset() {
            const offset = this.$store.getters[`${this.offsetType}Offset`]
            if (this.offsetType !== 'manalyzer') {
                switch (offset) {
                    case -4:
                        return '4 Weeks Ago'
                    case -3:
                        return '3 Weeks Ago'
                    case -2:
                        return '2 Weeks Ago'
                    case -1:
                        return 'Last Week'
                    case 0:
                        return 'This Week'
                    case 1:
                        return 'Next Week'
                }
            } else {
                switch (offset) {
                    case -4:
                        return '4 Months Ago'
                    case -3:
                        return '3 Months Ago'
                    case -2:
                        return '2 Months Ago'
                    case -1:
                        return 'Last Month'
                    case 0:
                        return 'This Month'
                }
            }
        },
        currentWeek() {
            const { timezone } = this.$store.getters.user
            const dateFormatter = 'MM/DD/YYYY'
            const startDate = moment
                .tz(timezone)
                .startOf('week')
                .day(1)
            const f = moment
                .tz(timezone)
                .day(5)
                .set({
                    hours: 12,
                    minutes: 0,
                    seconds: 0,
                })
            const now = moment.tz(timezone)
            if (now.isAfter(f)) {
                startDate.add(1, 'week')
            }

            const offset = this.$store.getters[`${this.offsetType}Offset`]
            startDate.add(offset, 'week')

            const endDate = startDate
                .clone()
                .endOf('week')
                .day(5)

            return `${startDate.format(dateFormatter)} - ${endDate.format(dateFormatter)}`
        },
    },
    methods: {
        // toggle full screen method
        toggleFullScreen() {
            if (screenfull.enabled) {
                screenfull.toggle()
            }
        },
        changeWeek(change) {
            const actionOffsetType =
                this.offsetType.substr(0, 2).toUpperCase() + this.offsetType.substr(2, this.offsetType.length)
            const action = `change${actionOffsetType}Offset`
            this.$store.dispatch(action, change)
            const dashboard = this.$breadcrumbs[0].meta.breadcrumb.split('/')[1].trim()
            const direction = change > 0 ? 'forward' : 'backward'
            this.$store.dispatch('dateRangeChanged', {
                dashboard,
                direction,
            })
        },
        showLeft() {
            const type = this.offsetType
            return this.$store.getters[`${type}Offset`] > -4
        },
        showRight() {
            const type = this.offsetType
            if (type === 'wplanner') {
                return this.$store.getters.wplannerOffset < 1
            } else {
                return this.$store.getters[`${type}Offset`] < -1
            }
        },
    },
    components: {
        appSidebar: Sidebar,
        MobileWeekForm,
    },
}
</script>

<style lang="scss" scoped>
.mobile-week {
    & > div {
        margin-top: 6px;
        display: inline-block;
        & > small {
            display: block;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: #9b9b9b;
        }
    }
}
.op {
    opacity: 0.3;
}
</style>
