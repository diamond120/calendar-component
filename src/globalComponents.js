/*
 * File: globalComponents.js
 * Project: workbetter-duhs
 * Created Date: Monday Apr 1 2019
 * Author: Calvin Flood
 * Copyright (c) 2019 Calvin Flood
 */

/**
 * Workbetter-Duhs Global Components
 */
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import AppSectionLoader from '@/components/AppSectionLoader/AppSectionLoader'
import { RotateSquare2 } from 'vue-loading-spinner'
import { SkeletonList, SkeletonTitle, SkeletonPage } from 'vue-skeleton-element'

// page title bar
import PageTitleBar from '@/components/PageTitleBar/PageTitleBar'

// App Card component
import AppCard from '@/components/AppCard/AppCard'

// section tooltip
import SectionTooltip from '@/components/SectionTooltip/SectionTooltip'

const GlobalComponents = {
    install(Vue) {
        Vue.component('appCard', AppCard)
        Vue.component('sectionTooltip', SectionTooltip)
        Vue.component('vuePerfectScrollbar', VuePerfectScrollbar)
        Vue.component('appSectionLoader', AppSectionLoader)
        Vue.component('pageTitleBar', PageTitleBar)
        Vue.component('rotateSquare2', RotateSquare2)
        Vue.component('skeletonList', SkeletonList)
        Vue.component('skeletonTitle', SkeletonTitle)
        Vue.component('skeletonPage', SkeletonPage)
    },
}

export default GlobalComponents
