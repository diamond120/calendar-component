/**
 * Settings Module
 */
import { languages, sidebarBackgroundImages, sidebarFilters, routerAnimations, themes, headerFilters } from './data'

const state = {
    darkMode: false, // dark mode
    collapseSidebar: true, // mini sidevar
    rtlLayout: false, // rtl layout
    backgroundImage: true, // enable sidebar background image
    horizontalLayoutSidebar: false, // horizontal layout sidebar
    languages, // languages
    selectedLocale: languages[0], // selected locale
    sidebarBackgroundImages, // sidebar backgorund images
    selectedSidebarBgImage: sidebarBackgroundImages[0], // selected sidebar background image
    sidebarFilters, // sidebar filters
    sidebarSelectedFilter: sidebarFilters[3], // selected sidebar filter
    routerAnimations, // router animations
    selectedRouterAnimation: routerAnimations[1], // selected router animation
    themes, // themes
    selectedTheme: themes[0], // selected theme
    headerFilters, // header filters
    activeHeaderFilter: headerFilters[1], // selected header filter
    wanalyzerOffset: -1,
    wplannerOffset: 0,
    manalyzerOffset: -1,
}

// getters
const getters = {
    darkMode: state => {
        return state.darkMode
    },
    collapseSidebar: state => {
        return state.collapseSidebar
    },
    boxLayout: state => {
        return state.boxLayout
    },
    rtlLayout: state => {
        return state.rtlLayout
    },
    backgroundImage: state => {
        return state.backgroundImage
    },
    selectedLocale: state => {
        return state.selectedLocale
    },
    languages: state => {
        return state.languages
    },
    sidebarBackgroundImages: state => {
        return state.sidebarBackgroundImages
    },
    selectedSidebarBgImage: state => {
        return state.selectedSidebarBgImage
    },
    sidebarFilters: state => {
        return state.sidebarFilters
    },
    sidebarSelectedFilter: state => {
        return state.sidebarSelectedFilter
    },
    selectedRouterAnimation: state => {
        return state.selectedRouterAnimation
    },
    routerAnimations: state => {
        return state.routerAnimations
    },
    themes: state => {
        return state.themes
    },
    selectedTheme: state => {
        return state.selectedTheme
    },
    headerFilters: state => {
        return state.headerFilters
    },
    activeHeaderFilter: state => {
        return state.activeHeaderFilter
    },
    horizontalLayoutSidebar: state => {
        return state.horizontalLayoutSidebar
    },
    wanalyzerOffset: state => {
        return state.wanalyzerOffset
    },
    wplannerOffset: state => {
        return state.wplannerOffset
    },
    manalyzerOffset: state => {
        return state.manalyzerOffset
    },
}

// actions
const actions = {
    darkModeHandler(context) {
        context.commit('darkModeHandler')
    },
    collapseSidebar(context) {
        context.commit('collapseSidebarHandler')
    },
    boxLayout(context) {
        context.commit('boxLayoutHandler')
    },
    rtlLayout(context) {
        context.commit('rtlLayoutHandler')
    },
    backgroundImage(context) {
        context.commit('sidebarBgImageHanlder')
    },
    changeLanguage(context, payload) {
        context.commit('changeLanguageHandler', payload)
    },
    changeBackgroundImage(context, payload) {
        context.commit('changeBackgroundImageHandler', payload)
    },
    changeSidebarFilter(context, payload) {
        context.commit('changeSidebarFilterHandler', payload)
    },
    changeRouterAnimation(context, payload) {
        context.commit('changeRouterAnimationHandler', payload)
    },
    changeTheme(context, payload) {
        context.commit('changeThemeHandler', payload)
    },
    changeHeaderFilter(context, payload) {
        context.commit('changeHeaderFilterHandler', payload)
    },
    setMiniSidebarLayout(context, payload) {
        context.commit('setMiniSidebarLayoutHandler', payload)
    },
    toggleHorizontalLayoutSidebar(context, payload) {
        context.commit('toggleHorizontalLayoutSidebarHandler', payload)
    },
    changeWAnalyzerOffset(context, change) {
        if (!parseInt(change)) return
        const offset = context.state.wanalyzerOffset + parseInt(change)
        context.commit('wanalyzerOffset', offset)
        context.dispatch('loadWAnalyzer', offset)
    },
    changeWPlannerOffset(context, change) {
        if (!parseInt(change)) return
        const offset = context.state.wplannerOffset + parseInt(change)
        context.commit('wplannerOffset', offset)
        context.dispatch('loadWPlanner', offset)
    },
    changeMAnalyzerOffset(context, change) {
        if (!parseInt(change)) return
        const offset = context.state.manalyzerOffset + parseInt(change)
        context.commit('manalyzerOffset', offset)
        // context.dispatch('loadMAnalyzer', offset)
    },
}

// mutations
const mutations = {
    darkModeHandler(state) {
        state.darkMode = !state.darkMode
    },
    collapseSidebarHandler(state) {
        state.collapseSidebar = !state.collapseSidebar
    },
    boxLayoutHandler(state) {
        state.boxLayout = !state.boxLayout
    },
    rtlLayoutHandler(state) {
        state.rtlLayout = !state.rtlLayout
    },
    sidebarBgImageHanlder(state) {
        state.backgroundImage = !state.backgroundImage
    },
    changeLanguageHandler(state, language) {
        state.selectedLocale = language
        if (language.locale === 'he' || language.locale === 'ar') {
            state.rtlLayout = true
        } else {
            state.rtlLayout = false
        }
    },
    changeBackgroundImageHandler(state, image) {
        state.selectedSidebarBgImage = image
    },
    changeSidebarFilterHandler(state, filter) {
        state.sidebarSelectedFilter = filter
    },
    changeRouterAnimationHandler(state, animation) {
        state.selectedRouterAnimation = animation
    },
    changeThemeHandler(state, theme) {
        state.selectedTheme = theme
    },
    changeHeaderFilterHandler(state, filter) {
        state.activeHeaderFilter = filter
    },
    setMiniSidebarLayoutHandler(state, isSet) {
        state.collapseSidebar = isSet
    },
    toggleHorizontalLayoutSidebarHandler(state, value) {
        state.horizontalLayoutSidebar = value
    },
    wanalyzerOffset(state, value) {
        state.wanalyzerOffset = value
    },
    wplannerOffset(state, value) {
        state.wplannerOffset = value
    },
    manalyzerOffset(state, value) {
        state.manalyzerOffset = value
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
