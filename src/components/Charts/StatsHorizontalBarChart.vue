<template>
    <div>
        <v-container fluid grid-list-xl class="stats-horizontal-bar-chart">
            <v-layout column justify-center class="chart-container">
                <vue-perfect-scrollbar class="stats-horizontal-bar-chart-area" :settings="scrollSettings">
                    <div class="chart-area-inner">
                        <template v-for="(item, index) in sortedStats">
                            <div class="chart-bar" :key="`${item.name}-${index}-${item.hours}`">
                                <div class="chart-bar-container">
                                    <div
                                        class="chart-bar-item pl-2 pr-3"
                                        :style="getBarWidthStyle(index)"
                                        :class="[
                                            {
                                                highlight: item.highlight === true,
                                            },
                                            statsType,
                                        ]"
                                    >
                                        <v-chip
                                            disabled
                                            text-color="white"
                                            class="stats-chip fs-12 fw-semi-bold"
                                            v-if="item.picture"
                                        >
                                            <v-avatar v-if="item.picture" :size="avatarSize" class="mr-1">
                                                <img :src="item.picture" :alt="item.name" />
                                            </v-avatar>
                                            {{ item.name }}
                                        </v-chip>
                                        <div class="fs-12 fw-semi-bold" v-else>
                                            {{ item.name }}
                                        </div>
                                        <div class="d-custom-flex chart-bar-item-metric">
                                            <strong>{{ item.hours }}</strong>
                                            <span>Hours</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </vue-perfect-scrollbar>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'StatsHorizontalBarChart',
    props: {
        stats: {
            type: Array,
            required: true,
        },
        statsType: {
            type: String,
        },
    },
    data() {
        return {
            scrollSettings: {
                maxScrollbarLength: 350,
            },
            avatarSize: 24,
        }
    },
    computed: {
        sortedStats() {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            return this.stats.sort((a, b) => a.hours - b.hours).reverse()
        },
    },
    methods: {
        getBarWidthStyle(index) {
            const bars = this.sortedStats.map(x => x.hours)
            const barMaxWidth = Math.max(...bars)
            const barMinWidth = 40
            return {
                width: barMinWidth + (bars[index] * (99 - barMinWidth)) / barMaxWidth + '%',
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.stats-horizontal-bar-chart {
    .stats-horizontal-bar-chart-area {
        height: 350px;

        .chart-area-inner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 350px;
        }
    }
    .chart-container {
        background: $gray-lighter;
        border-left: 2px solid $gray;
        border-bottom: 2px solid $gray;

        .chart-bar {
            flex: 0 0 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 0.5rem 0;
            background: repeating-linear-gradient(
                -55deg,
                transparent,
                transparent 1px,
                lighten($color: $gray, $amount: 2%) 2px,
                lighten($color: $gray, $amount: 2%) 3px
            );

            .chart-bar-container {
                flex: 1 1 auto;
                position: relative;

                .chart-bar-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    color: $light;
                    background: linear-gradient(180deg, $primary1, $primary2);
                    @include border-radii(0, 10px 25px, 10px 25px, 0);
                    animation: expand-width 0.5s ease-out;
                    -moz-animation: expand-width 0.5s ease-out;
                    -webkit-animation: expand-width 0.5s ease-out;

                    &.highlight {
                        // background: linear-gradient(180deg, $primary2, $primary3);
                        opacity: 0.6;
                    }
                    &.focus {
                        background: $linear-focus-color;
                    }
                    &.transition {
                        background: $linear-transition-color;
                    }
                    &.meeting {
                        background: $linear-meeting-color;
                    }

                    .chart-bar-item-metric {
                        flex-direction: column;
                        align-items: center;
                        strong {
                            font-size: $font-size-xl;
                            font-weight: $font-weight-normal;
                            line-height: 35px;
                        }
                        span {
                            font-size: 0.5rem;
                            text-transform: uppercase;
                            line-height: 0.5rem;
                        }
                    }
                }
            }
        }
    }
}
@keyframes expand-width {
    0% {
        width: 30px;
    }
    100% {
        transform: 100%;
    }
}
@-moz-keyframes expand-width {
    0% {
        width: 30px;
    }
    100% {
        transform: 100%;
    }
}
@-webkit-keyframes expand-width {
    0% {
        width: 30px;
    }
    100% {
        transform: 100%;
    }
}
</style>
