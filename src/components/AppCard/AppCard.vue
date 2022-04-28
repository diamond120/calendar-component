<template>
    <div
        :class="[
            colClasses,
            {
                flex: colClasses,
            },
        ]"
    >
        <fullscreen ref="fullscreen">
            <div
                class="app-card"
                :class="[
                    customClasses,
                    {
                        'd-none': close,
                    },
                ]"
            >
                <app-card-heading
                    :heading="heading"
                    :extraClass="[headingCustomClass]"
                    :closeable="closeable"
                    :reloadable="reloadable"
                    :feedbackable="feedbackable"
                    :fullScreen="fullScreen"
                    :withTabs="withTabs"
                    :tabs="tabs"
                    @onChangeTabCallback="onChangeTab"
                    @onCollapse="onCollapse"
                    @onReload="onReload"
                    @onFeedback="onFeedback"
                    @onClose="onClose"
                >
                    <slot name="header"></slot>
                </app-card-heading>
                <app-card-content :extraClass="[contentCustomClass]" :fullBlock="fullBlock">
                    <slot></slot>
                </app-card-content>
                <app-card-footer v-if="footer">
                    <slot name="footer"></slot>
                </app-card-footer>
                <app-section-loader :status="reload"></app-section-loader>
            </div>
        </fullscreen>
    </div>
</template>

<script>
import AppCardHeading from './AppCardHeading'
import AppCardFooter from './AppCardFooter'
import AppCardContent from './AppCardContent'
import AppSectionLoader from '../AppSectionLoader/AppSectionLoader'

export default {
    props: [
        'heading',
        'colClasses',
        'customClasses',
        'fullBlock',
        'headingCustomClass',
        'contentCustomClass',
        'closeable',
        'reloadable',
        'feedbackable',
        'fullScreen',
        'footer',
        'withTabs',
        'tabs',
        'onChangeTabCallback',
    ],
    data() {
        return {
            reload: false,
            close: false,
        }
    },
    components: {
        AppCardHeading,
        AppCardFooter,
        AppCardContent,
        AppSectionLoader,
    },
    methods: {
        onCollapse() {
            this.$refs['fullscreen'].toggle()
        },
        onReload() {
            this.reload = true
            let self = this
            setTimeout(() => {
                self.reload = false
            }, 1500)
        },
        onFeedback() {
            // TODO Should be replaced with the feedback dialog
            this.reload = true
            let self = this
            setTimeout(() => {
                self.reload = false
            }, 1500)
        },
        onClose() {
            this.close = true
        },
        onChangeTab(value) {
            this.$emit('onChangeTabCallback', value)
        },
    },
}
</script>
