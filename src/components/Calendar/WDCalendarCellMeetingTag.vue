<template>
    <span>
        <v-chip color="rgb(142, 204, 240)" small selected :title="title" v-if="collapsed">
            ...
        </v-chip>
        <span v-else>
            <v-chip color="rgb(142, 204, 240)" small selected :title="title">
                <v-icon left>fa fa-user{{ type === TAG_CRITICAL ? 's' : '' }}</v-icon>
                {{ tagMark }}
            </v-chip>
        </span>
    </span>
</template>

<script>
import AppConfig from '@/constants/AppConfig'

export default {
    props: {
        collapsed: Boolean,
        title: String,
        type: String,
    },
    data() {
        return {
            TAG_CRITICAL: AppConfig.meetingTag.critical,
            TAG_PERSONAL: AppConfig.meetingTag.personal,
        }
    },
    computed: {
        tagMark() {
            if (this.type === this.TAG_CRITICAL) {
                return 'w:c m'
            }
            if (this.type === this.TAG_PERSONAL) {
                return 'w:p m'
            }
            return '--'
        },
    },
}
</script>

<style lang="scss" scoped>
.v-chip {
    height: 20px;
    font-size: 13px;
    margin: 0 1px;
}
.v-icon {
    font-size: 14px;
}
.v-icon--left {
    margin-left: -5px;
    margin-right: 3px;
}
</style>
