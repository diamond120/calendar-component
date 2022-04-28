<template>
    <v-layout align-start justify-center fill-height class="container-404">
        <v-flex md6 text-center>
            <h1>404</h1>
            <hr />
            <h2 class="mb-3 mt-4">{{ $t('message.pageNotFound') }}</h2>
            <div>
                <v-btn color="rgb(93, 200, 224)" class="white--text" href="/">
                    {{ $t('message.backToWork') }}
                </v-btn>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import AppConfig from '@/constants/AppConfig'

export default {
    data() {
        return {
            appLogo: AppConfig.appLogo3,
            brand: AppConfig.brand,
        }
    },
}
</script>

<style lang="scss" scoped>
.container-404 {
    h1 {
        font-size: 800%;
        font-weight: 100;
    }
    h2 {
        text-transform: uppercase;
    }
    hr {
        width: 50%;
        border-color: #555;
        margin: 10px auto;
    }
    padding-top: 20%;
    background: url('/static/img/page-not-found-bg.jpg') center/cover no-repeat;
    color: #fff;
}
</style>
