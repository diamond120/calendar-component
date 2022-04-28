<template>
    <v-layout row wrap class="planner-header" v-if="showProfile">
        <v-flex grow class="d-custom-flex profile-section">
            <v-img :src="profile.picture" max-width="40" max-height="40"></v-img>
            <div class="ml-3">
                <h4 class="font-lg ma-0">{{ profile.name }}</h4>
                <p class="font-xxs ma-1">Workbetter-Duhs Member Since: 06/01/2019</p>
            </div>
        </v-flex>
        <v-spacer />
    </v-layout>
</template>

<script>
export default {
    name: 'PlannerHeader',
    data() {
        return {
            showProfile: true,
        }
    },
    computed: {
        profile() {
            return this.$store.getters.user
        },
    },
}
</script>

<style lang="scss" scoped></style>
