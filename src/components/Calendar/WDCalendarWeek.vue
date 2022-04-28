<template>
    <div class="calendar-wrap" :style="`--space-between-cols: ${colsSpace}`">
        <div class="sticky-top">
            <calendar-quick-stats-week :days="days"></calendar-quick-stats-week>
            <ul class="days">
                <li class="day-indicator" v-for="{ date } in days || []" :key="date.date">
                    <span class="number-date primary--text">
                        {{ formatDate(date, 'D') }}
                    </span>
                    <span class="letters-date">
                        {{ formatDate(date, 'ddd') }}
                    </span>
                </li>
            </ul>
        </div>
        <div class="blocks">
            <div class="calendar-blocks">
                <!-- Time Label -->
                <ul class="hours">
                    <li
                        class="hour-row-identifier"
                        :key="formatDate(hour, 'HH-A')"
                        v-for="hour in hours || []"
                        :style="`height:${hourHeight}px`"
                    >
                        <span>{{ formatDate(hour, 'h A') }}</span>
                    </li>
                </ul>
                <!-- Calendar Day View -->
                <w-d-calendar-day
                    :key="day.date"
                    :day="day"
                    class="building-blocks"
                    v-for="day in days"
                ></w-d-calendar-day>
            </div>
        </div>
    </div>
</template>

<script>
import format from 'date-fns/format'
import CalendarQuickStatsWeek from './CalendarQuickStatsWeek'
import WDCalendarDay from './WDCalendarDay'

export default {
    name: 'WDCalendarWeek',
    components: {
        CalendarQuickStatsWeek,
        WDCalendarDay,
    },
    props: ['days', 'hours'],
    inject: ['calendarOptions'],
    computed: {
        colsSpace() {
            return '0px'
        },
        hourHeight() {
            return this.calendarOptions.cell_height * (60 / this.calendarOptions.split_value)
        },
    },
    methods: {
        formatDate(_format, how) {
            return format(_format, how)
        },
    },
}
</script>

<style lang="scss">
$blue: #5fb3f2;
$lblue: #d6eefc;
$dblue: #3d79b4;
$lightgrey: #c7c9d5; //$lightgrey: #F5F4F5;
$grey: #c7c9d5; //#C1C4C8;
$a-grey: #b7babd;
$border-color: transparent;

.calendar-wrap {
    display: flex;
    flex-direction: column;
    ul {
        list-style: none;
        padding: 0px;
        > li {
            display: flex;
        }
    }
}

.sticky-top {
    position: sticky;
    top: 0;
    // z-index: 10;
    background-color: white;
    .days {
        margin: 0px;
        display: flex;
        margin-left: 80px;
        li {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            margin-right: var(--space-between-cols);
            font-size: $font-size-xxl;
            font-weight: 200;
            color: $a-grey;
            text-transform: uppercase;
            // border-top: solid 1px #e5e5e5;
            border-bottom: solid 1px #e5e5e5;
            border-right: solid 1px #e5e5e5;
            &:first-child {
                border-left: solid 1px #e5e5e5;
            }
            span {
                &.letters-date {
                    margin-left: 0.1rem;
                }
            }
        }
    }
    .all-day {
        display: flex;
        flex-direction: row;
        margin: 0;

        > span {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: -15px;
        }
        li {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: var(--space-between-cols);

            > div {
                max-width: 150px;
                overflow: visible !important;
            }
        }
    }
}

.blocks {
    display: flex;
    position: relative;
    height: 100%;
    ul {
        margin-top: 0px;
    }
    .building-blocks {
        flex: 1;
        margin-right: var(--space-between-cols);
        margin-bottom: 0px;
        display: flex;
        flex-direction: column;
    }
    .calendar-blocks {
        width: 100%;
        display: flex;
        position: relative;
    }
}

.hours {
    display: flex;
    flex-direction: column;
    color: darken($grey, 5);
    font-weight: 500;
    font-size: 0.85rem;
    width: 80px;
    height: 100%;
    margin-bottom: 0px;
    li {
        align-items: center;
        justify-content: center;
        font-size: $font-size-xs;
        font-weight: $font-weight-semi-bold;
        color: $light-dark;
        border-bottom: solid 1.2px $dark-border-color;
        border-right: solid 2px $dark-border-color;
        box-shadow: 5px 0 5px -5px $gray-dark;
    }
}
</style>
