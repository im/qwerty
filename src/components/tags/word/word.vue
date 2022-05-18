<!--
* Word
* @author tangxiaomi <81195314@qq.com>
* @date 2022-05-16 16:02:44
* @since 0.1.0
-->

<template>
    <div class="word-box">
        <ul
            class="words"
            :class="{ wrong: isShowWrong }">
            <li
                v-for="(w, i) in words"
                :key="w + i"
                :class="classs(w, i)"><span>{{ isBlank(w) ? '␣' : w }}</span></li>
            <li
                v-if="config.sound === 'y'"
                class="sound"><SoundIcon></SoundIcon></li>
        </ul>

        <div
            v-if="config.phonetic === 'y'"
            class="phonetic">
            <span v-if="usphone">/{{ usphone }}/</span>
            <span v-if="ukphone">/{{ ukphone }}/</span>
        </div>
        <ul
            v-if="config.paraphrase === 'y'"
            class="trans">
            <li
                v-for="item in trans"
                :key="item">{{ item }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SoundIcon from 'components/tags/soundIcon/soundIcon.vue'

@Component({
    components: {
        SoundIcon
    }
})

export default class Word extends Vue {
    @Prop() word:any
    @Prop() value:any
    @Prop() config:any

    isShowWrong = false

    get isShowWord () {
        return this.config.showWord === 'y'
    }

    get words () {
        return this.word.name.split('')
    }

    get values () {
        return this.value.split('')
    }

    get trans () {
        return this.word.trans
    }

    get usphone () {
        return this.word.usphone
    }

    get ukphone () {
        return this.word.ukphone
    }

    @Watch('value')
    changVal () {

        if (this.word.name === this.value) {
            this.handleSuccess()
        }

        if (!this.checkResult) {
            this.handleError()
        }
    }

    get checkResult () {
        const checkArr:any = []
        this.words.forEach((w:any, i:any) => {
            checkArr.push(this.check(w,i))
        })
        return !~checkArr.indexOf(1)
    }

    classs (w:any, i:any) {
        return {
            error: this.check(w, i) === 1,
            success: this.check(w, i) === 2,
            hide: !this.isShowWord && this.check(w, i) === 0,
            blank: this.isBlank(w)
        }
    }

    check (w:any, i:any) {
        if (!this.values.length || i >= this.values.length) return 0
        return this.values[i] === w ? 2 : 1
    }

    isBlank (w:any) {
        return w === ' '
    }

    handleSuccess () {
        const timer1 = setTimeout(() => {
            this.$emit('input', '')
            this.$emit('success', this.word.name)
            clearTimeout(timer1)
        }, 400)
    }

    handleError () {
        const timer1 = setTimeout(() => {
            this.isShowWrong = true
            this.$emit('error')
            clearTimeout(timer1)
        }, 200)

        const timer2 = setTimeout(() => {
            this.isShowWrong = false
            clearTimeout(timer2)
            this.$emit('input', '')
        }, 1000)
    }

}
</script>

<style src="./word.styl" lang="stylus" scoped></style>
