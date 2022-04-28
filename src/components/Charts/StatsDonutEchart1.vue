<template>
    <figure class="donutChart-container">
        <chart :options="pie" :init-options="initOptions" ref="pie" auto-resize />
    </figure>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'zrender/lib/svg/svg'

export default {
    components: {
        chart: ECharts,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        colors: {
            type: Array,
            default: null,
        },
        other: {
            type: String,
            default: 'Other',
        },
        showToolTip: {
            type: Boolean,
            default: false,
        },
        toolTipFormatter: {
            type: String,
            default: '{b}', // just name of data
        },
        showInfoLabel: {
            type: Boolean,
            default: false,
        },
        showPercentage: {
            type: Boolean,
            default: false,
        },
        startAngle: {
            type: Number,
            default: 150,
        },
        labelLight: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            initOptions: {
                renderer: 'canvas', // render as canvas, it does not support rich text for svg rendering
            },
        }
    },
    computed: {
        pie() {
            return {
                title: {
                    show: false,
                },
                color: this.colors,
                tooltip: {
                    show: this.showToolTip,
                    trigger: 'item',
                    formatter: this.toolTipFormatter,
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '80%'],
                        hoverOffset: 0,
                        hoverAnimation: false,
                        avoidLabelOverlap: false,
                        startAngle: this.startAngle,
                        itemStyle: {
                            // shadow size
                            shadowBlur: 20,
                            // horizontal offset of shadow
                            shadowOffsetX: 0,
                            // vertical offset of shadow
                            shadowOffsetY: 0,
                            // shadow color
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        data: this.pieData,
                    },
                ],
                textStyle: {
                    fontFamily: 'Roboto, sans-serif',
                },
            }
        },
        pieData() {
            // label formatter
            const labelFormatters = [this.showPercentage ? '{t|{d}%}' : '{t|{c}}']
            if (this.showInfoLabel) {
                labelFormatters.push('{h|{b}}')
            }
            // label styles
            const labelTop = {
                show: true,
                position: 'center',
                formatter: labelFormatters.join('\n'),
                rich: {
                    t: {
                        color: '#9b9b9b',
                        fontSize: this.labelLight ? 20 : 30,
                        lineHeight: 30,
                        fontWeight: this.labelLight ? 'normal' : 'bold',
                    },
                    h: {
                        color: '#9b9b9b',
                        fontSize: 12,
                    },
                },
            }
            const labelBottom = {
                show: false,
                position: 'center',
            }
            // series data
            const topData = {
                name: this.data.name,
                value: parseFloat(this.data.y).toFixed(2),
                label: labelTop,
            }

            const value2 = this.data.value === 0 ? 0 : (100 * this.data.y) / this.data.value - this.data.y
            const bottomData = {
                name: this.other,
                value: parseFloat(value2).toFixed(2),
                label: labelBottom,
            }
            return [topData, bottomData]
        },
    },
}
</script>

<style lang="scss" scoped>
.donutChart-container {
    position: relative;
    width: 100%;
    padding-top: 100%;

    .echarts {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        max-width: 100%;
        min-width: 0px;
        max-height: 100%;
        min-height: 0px;
        margin: auto;
    }
}
</style>
