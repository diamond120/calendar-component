<template>
    <div class="week-form-wrap">
        <v-btn fab dark small class="close-btn">
            <v-icon dark>close</v-icon>
        </v-btn>
        <div class="d-flex align-center justify-center centered white--text">
            <div class="text-center">
                <span class="font-xl fw-semi-bold">{{ $t(pageTitle) }}</span>
                <div class="secondary--text" id="change_week">
                    <v-btn class="week-navigation" @click="changeWeek(-1)" :disabled="!showLeft()">
                        <v-icon medium>chevron_left</v-icon>
                    </v-btn>
                    <div class="font-lg text-center mx-2">
                        {{ textOffset }}
                        <small>({{ currentWeek }})</small>
                    </div>
                    <v-btn class="week-navigation" @click="changeWeek(1)" :disabled="!showRight()">
                        <v-icon medium>chevron_right</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment-timezone'

export default {
    mounted() {
        $('.mobile-week-btn').click(e => {
            e.stopPropagation()
            $('.week-form-wrap').addClass('week-slide')
        })
        $('.close-btn').click(e => {
            e.stopPropagation()
            $('.week-form-wrap').removeClass('week-slide')
        })
        $('.week-form-wrap').click(e => {
            e.stopPropagation()
            $('.week-form-wrap').removeClass('week-slide')
        })
    },
    computed: {
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
}
</script>

<style lang="scss" scoped>
#change_week {
    margin-top: 20px;
    & > div {
        display: inline-block;
        & > small {
            display: block;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: #9b9b9b;
            margin-top: 3px;
        }
    }

    .week-navigation {
        min-width: 0;
        height: 28px;
        width: 28px;
        vertical-align: top;
        &:disabled {
            background: $gray-dark !important;
        }
    }
}
</style>
