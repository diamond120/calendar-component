<template>
    <v-layout justify-space-arround class="ma-0 cell-title" :style="astyle">
        <h4>
            {{ appointment.data.title }}
        </h4>
        <v-spacer></v-spacer>
        <calendar-actions class="calendar-action" :appointment="appointment"></calendar-actions>
    </v-layout>
</template>

<script>
import CalendarActions from './CalendarActions'

export default {
    components: {
        CalendarActions,
    },
    props: ['appointment', 'astyle'],
}
</script>

<style lang="scss" scoped>
.cell-title {
    h4,
    p,
    span {
        margin: 0;
    }
    h4 {
        padding: 5px;
        font-size: 0.75rem;
        font-weight: $font-weight-bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    &:hover h4 {
        white-space: normal;
    }
}
</style>
