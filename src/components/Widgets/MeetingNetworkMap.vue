<template>
    <div>
        <v-container fluid grid-list-xl class="meeting-network-map">
            <v-layout column justify-center class="map-container">
                <network ref="network" :nodes="nodes" :edges="calculatedEdges" :options="options"></network>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { Network } from 'vue2vis'
import { generateUUID } from '@/helpers/helpers'

export default {
    name: 'MeetingNetworkMap',
    components: {
        Network,
    },
    props: ['period', 'stats'],
    data() {
        return {
            options: {
                interaction: {
                    hover: true,
                    zoomView: false,
                },
                nodes: {
                    color: {
                        highlight: '#2695AD',
                        border: '#2695AD',
                        hover: '#5DC8E0',
                    },
                },
                edges: {
                    color: {
                        color: '#2695AD',
                        highlight: '#2695AD',
                        hover: '#5DC8E0',
                    },
                    hoverWidth: 0,
                },
            },
        }
    },
    computed: {
        nodes() {
            if (!this.$store.getters.user) return []
            const { picture, email } = this.$store.getters.user
            const { peers = [], sharedMap = {} } = this.stats || {}
            const res = []
            res.push({
                id: 0,
                shape: 'circularImage',
                image: picture || '/static/logos/logo.png',
                size: 40,
            })

            for (const peer of peers) {
                if (peer.email === email) continue
                res.push({
                    id: generateUUID(),
                    shape: 'circularImage',
                    image: peer.picture || '/static/logos/logo.png',
                    data: {
                        name: peer.name || peer.email,
                        shared_meetings: sharedMap[peer.email].meetings,
                        meeting_hours: Math.ceil(sharedMap[peer.email].duration / 60),
                    },
                })
            }

            return res
        },
        edges() {
            const nodes = this.nodes
            const res = []

            for (const node of nodes) {
                if (node.id === 0) continue
                res.push({
                    from: 0,
                    to: node.id,
                })
            }

            return res
        },
        calculatedEdges() {
            const maxWidth = 5
            let maxHours = Math.max(...this.nodes.map(node => (node.data ? node.data.meeting_hours : 1)))
            return this.edges.map((edge, index) => {
                return {
                    ...edge,
                    width: (this.nodes[index + 1].data.meeting_hours * maxWidth) / maxHours,
                }
            })
        },
    },
    mounted() {
        this.$refs.network.network.on('hoverNode', params => {
            if (params.node) {
                const nodeData = this.nodes.find(el => el.id === params.node).data
                $('.meeting-network-map').qtip({
                    content: {
                        title: `<strong>${nodeData.name}</strong>`,
                        text: `Shared Meetings: <strong>${
                            nodeData.shared_meetings
                        }</strong> <br /> Meeting Hours: <strong>${nodeData.meeting_hours}</strong>`,
                    },
                    show: {
                        event: event.type,
                    },
                    position: {
                        at: 'top center',
                        target: 'mouse',
                        adjust: {
                            x: 10,
                            y: 10,
                        },
                    },
                    style: {
                        classes: 'meeting-network-class',
                    },
                })
            }
        })

        this.$refs.network.network.on('blurNode', params => {
            if (params.node) {
                $('.meeting-network-map').qtip('destroy')
            }
        })
    },
}
</script>

<style lang="scss" scoped>
.map-container {
    position: relative;
    height: 350px;
    background: $gray-lighter;
    border-left: 2px solid $gray;
    border-bottom: 2px solid $gray;
    overflow: hidden;
    > div {
        flex: 1;
        width: 100%;
        height: 100%;
    }
}
</style>

<style lang="scss">
.meeting-network-class {
    font-family: $font-family-base;
    font-size: 0.75rem;
    line-height: 1rem;
    border-color: $secondary;
    background-color: $base;

    .qtip-titlebar {
        text-align: center;
        background-color: $primary3;
    }
    .qtip-content {
        font-size: 0.7rem;
        line-height: 1.25rem;
        strong {
            font-size: 0.75rem;
        }
    }
}
</style>
