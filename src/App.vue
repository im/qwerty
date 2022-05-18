<template>
    <div id="app">
        <img
            v-if="bg"
            :src="bg"
            class="bg" />
        <div
            v-else
            class="bg"></div>
        <div
            v-if="isStart"
            class="home">
            <div
                class="start">
                <div
                    class="btn"
                    @click="isStart = false">START</div>
            </div>
        </div>

        <Dict
            v-if="!isStart"
            @change="setDict"></Dict>

        <Write
            v-if="dict.id && !isStart"
            :dict="dict"></Write>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Mixins } from 'vue-property-decorator'
import { formatTime, formatNumber, storage } from '@/utils'
import Dict from 'components/views/dict/dict.vue'
import Write from 'components/views/write/write.vue'

@Component({
    components: {
        Dict,
        Write
    }
})
export default class App extends Vue {

    isStart = true

    dict:any = {}

    get bg () {
        // const { bg } = this.$route.query as any
        // if (bg) {
        //     return `${process.env.BASE_URL}images/bg/${formatNumber(
        //         Number(bg)
        //     )}.svg`
        // }
        return false
    }

    setDict (dict:any) {
        this.dict = dict
    }

    mounted () {
        const dict = storage.get('qwertyDict')
        if (dict) {
            this.setDict(dict)
        }
        document.title = 'Qwery'
    }
}
</script>

<style lang="stylus">
@import '~style/base';
#app
    font-family  Andale Mono
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    width 100vw
    height 100vh
    position relative
    overflow hidden
    .bg
        width 100%
        height 100%
        position absolute
        left 0
        top 0
        filter blur(20px)
        background #ccc
        z-index -1
        object-fit cover
    .home
        width 100%
        height 100%
        .start
            width 100%
            height 100%
            display flex
            align-items center
            justify-content center
            .btn
                width 200px
                color #2c3e50
                background rgba(255, 255, 255, 0.7)
                text-align center
                line-height 50px
                font-weight bold
                transition 0.3s
                cursor pointer
                border-radius 4px
                &:hover
                    opacity 0.8

</style>
