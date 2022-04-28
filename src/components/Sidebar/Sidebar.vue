<!-- Side Structure -->
<template>
    <div class="sidebar" :class="sidebarSelectedFilter.class">
        <vue-perfect-scrollbar class="scroll-area" :settings="settings">
            <v-toolbar flat class="transparent scroll-area navigation">
                <v-list>
                    <app-logo></app-logo>
                    <user-block></user-block>
                    <template v-for="(category, key) in menus">
                        <div :key="key">
                            <div class="sidebar-title px-3">
                                <span class="d-none">{{ $t(key) }}</span>
                            </div>
                            <template v-for="item in category">
                                <template v-if="!!item.items">
                                    <v-list-group
                                        :key="item.title"
                                        prepend-icon="arrow_right"
                                        append-icon=""
                                        no-action
                                        :value="item.active"
                                    >
                                        <v-list-tile slot="activator">
                                            <v-list-tile-content>
                                                <v-list-tile-title>
                                                    <i class="mr-2 zmdi" :class="item.action"></i>
                                                    <span>
                                                        {{ textTruncate($t(item.title)) }}
                                                    </span>
                                                </v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile
                                            v-for="subItem in item.items"
                                            v-bind:key="subItem.title"
                                            v-if="subItem !== null"
                                            :to="{ name: subItem.route }"
                                            active
                                        >
                                            <v-list-tile-content>
                                                <v-list-tile-title>
                                                    {{ textTruncate($t(subItem.title)) }}
                                                </v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list-group>
                                </template>
                                <template v-else>
                                    <v-list-tile :to="{ name: item.route }" :key="item.route">
                                        <v-list-tile-action>
                                            <i class="zmdi zmdi-caret-right"></i>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>
                                                <i class="mr-2 zmdi" :class="item.action"></i>
                                                <span>
                                                    {{ textTruncate($t(item.title)) }}
                                                </span>
                                            </v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                            </template>
                        </div>
                    </template>
                </v-list>
            </v-toolbar>
        </vue-perfect-scrollbar>
    </div>
</template>

<script>
import UserBlock from './UserBlock'
import { textTruncate } from '@/helpers/helpers'
import { mapGetters } from 'vuex'
import AppLogo from '@/components/AppLogo/AppLogo'

export default {
    data() {
        return {
            settings: {
                maxScrollbarLength: 160,
            },
        }
    },
    components: {
        UserBlock,
        AppLogo,
    },
    computed: {
        ...mapGetters(['sidebarSelectedFilter', 'menus']),
    },
    mounted() {
        this.$store.dispatch('setActiveMenuGroup', this.$route)
    },
    methods: {
        textTruncate(text) {
            return textTruncate(text, 28)
        },
    },
}
</script>
