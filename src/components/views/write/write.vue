<!--
* Write
* @author tangxiaomi <81195314@qq.com>
* @date 2022-05-16 16:03:38
* @since 0.1.0
-->

<template>
    <div
        class="write-box"
        :class="{ start: !action }">
        <div>
            <Word
                v-if="word"
                v-model="value"
                :word="word"
                :config="config"
                @error="error"
                @success="success"></Word>
            <Result
                v-if="config.panel === 'y'"
                :time="curTime"
                :inputCount="inputCount"
                :correctCount="correctCount"></Result>
        </div>
        <div
            v-if="dict && dict.name"
            class="dict"> {{ dict.name }} ({{ dict.length }})</div>

        <div
            class="foot-bar"
            :class="{ open : isShowFootBar }">
            <div class="bar">
                <select
                    v-model="chapter"
                    class="select"
                    @change="chapterChange">
                    <option
                        v-for="chapter in chapters"
                        :key="chapter"
                        :value="chapter">
                        Chapter-{{ chapter }}</option>
                </select>
                <select
                    v-model="config.order"
                    class="select"
                    :class="[config.order]">
                    <option value="n">正序[O]</option>
                    <option value="y">乱序[O]</option>
                </select>

                <select
                    v-model="config.showWord"
                    class="select"
                    :class="[config.showWord]">
                    <option value="y">英文显示[D]</option>
                    <option value="n">英文隐藏[D]</option>
                </select>

                <select
                    v-model="config.phonetic"
                    class="select"
                    :class="[config.phonetic]">
                    <option value="y">音标显示[P]</option>
                    <option value="n">音标隐藏[P]</option>
                </select>

                <select
                    v-model="config.paraphrase"
                    class="select"
                    :class="[config.paraphrase]">
                    <option
                        value="y">释义显示[Y]</option>
                    <option value="n">释义隐藏[Y]</option>
                </select>

                <select
                    v-model="config.sound"
                    class="select"
                    :class="[config.sound]">
                    <option
                        value="y">发音打开[S]</option>
                    <option value="n">发音关闭[S]</option>
                </select>
                <select
                    v-model="config.voice"
                    class="select">
                    <option value="us">美音[V]</option>
                    <option value="uk">英音[V]</option>
                </select>
                <select
                    v-model="config.panel"
                    class="select">
                    <option value="y">面板显示[E]</option>
                    <option value="n">面板隐藏[E]</option>
                </select>
                <select
                    v-model="config.pageSize"
                    class="select"
                    @change="index = 0">
                    <option value="5">分页(5)</option>
                    <option value="10">分页(10)</option>
                    <option value="20">分页(20)</option>
                    <option value="30">分页(30)</option>
                </select>
            </div>

            <i
                class=" iconfont"
                :class="[isShowFootBar ? 'icon-guanbi': 'icon-tianjia']"
                @click="isShowFootBar = !isShowFootBar"></i>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue,Watch } from 'vue-property-decorator'
import Word from 'components/tags/word/word.vue'
import Result from 'components/tags/result/result.vue'
import { playSound, wordPlaySound } from '@/utils/sounds'
import { storage } from '@/utils'
import context from '@/context'

@Component({
    components: {
        Word,
        Result
    }
})

export default class Write extends Vue {

    @Prop() dict: any
    @Prop() action: any

    list = []

    chapter = 1
    index = 0
    value = ''
    clickAudio:any = null
    hintAudio: any = null
    beepAudio:any = null

    isShowFootBar = false
    startNow = 0
    startTimer:any = null
    curTime = 0
    recordTime = 0
    inputCount = 0
    correctCount = 0

    config = {
        showWord: 'y',
        order: 'n',
        paraphrase: 'y',
        phonetic: 'y',
        sound: 'n',
        voice: 'us',
        pageSize: 20,
        panel: 'n'
    }

    @Watch('dictId')
    changeId () {
        this.getData()
    }

    @Watch('config', {
        deep: true
    })
    changeConfig () {
        storage.set('qwertyConfig', JSON.stringify(this.config))
    }

    @Watch('action', {
        immediate: true,
        deep: true
    })
    changeAction () {
        if (!this.action) {
            this.startNow = Date.now()
            this.recordTime = this.curTime
            this.startTimeWatch()
        } else {
            this.stopTimeWatch()
        }
    }

    startTimeWatch () {
        this.startTimer = setInterval(() => {
            const curTime = Date.now()
            this.curTime = (curTime - this.startNow) + this.recordTime
        }, 1000)
    }

    stopTimeWatch () {
        clearInterval(this.startTimer)
    }

    get pageSize () {
        return Number(this.config.pageSize)
    }

    get words () {
        let chapter = this.chapter - 1
        const start = chapter * this.pageSize
        const end = start + this.pageSize - 1
        const arr = this.list.slice(start , end)
        if (this.config.order === 'y') {
            arr.sort(() => Math.random() - 0.5)
        }
        return arr
    }

    get word () {
        return this.words[this.index] || null
    }

    get dictId () {
        return this.dict.id
    }

    async getData () {
        this.list = await fetch(`${context}dicts/${this.dictId}.json`).then(res => res.json())
        this.index = 0
    }

    get chapters () {
        return Math.ceil(this.list.length / this.pageSize)
    }
    isLegal = (val: string): boolean => /^[a-z_A-Z_._(_)_0-9'!,='?\-;[\]\\/]$/.test(val)
    isChineseSymbol = (val: string): boolean =>
        /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/.test(
            val,
        )

    eventStop (e:any) {
        e.preventDefault()
        e.returnValue = false
    }

    updateConfig (e:any) {
        const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
        const { metaKey, ctrlKey, key } = e

        if (isMac && metaKey || !isMac && ctrlKey) {
            switch (key) {
                case 'o':
                    this.config.order = this.config.order === 'y' ? 'n' : 'y'
                    this.eventStop(e)
                    this.eventStop(e)
                    break
                case 'd':
                    this.config.showWord = this.config.showWord === 'y' ? 'n' : 'y'
                    this.eventStop(e)
                    break
                case 'p':
                    this.config.phonetic = this.config.phonetic === 'y' ? 'n' : 'y'
                    this.eventStop(e)
                    break
                case 's':
                    this.config.sound = this.config.sound === 'y' ? 'n' : 'y'
                    this.eventStop(e)
                    break
                case 'y':
                    this.config.paraphrase = this.config.paraphrase === 'y' ? 'n' : 'y'
                    this.eventStop(e)
                    break
                case 'v':
                    this.config.voice = this.config.voice === 'us' ? 'uk' : 'us'
                    this.eventStop(e)
                    break
                case 'e':
                    this.config.panel = this.config.panel === 'y' ? 'n' : 'y'
                    this.eventStop(e)
                    break
                default:
            }

        }
    }

    onKeydown (e:any) {
        const char = e.key

        this.updateConfig(e)

        if (char === 'Tab') {
            this.isShowFootBar = !this.isShowFootBar
            return
        }
        if (char === ' ') {
            e.preventDefault()
            this.value = this.value + ' '
            this.inputCount++
        }

        if (this.isChineseSymbol(char)) {
            alert('您正在使用中文输入法输入，请关闭输入法')
        }

        if (this.isLegal(char) && !e.altKey && !e.ctrlKey && !e.metaKey) {
            this.value = this.value + char
            this.inputCount++
        } else if (char === 'Backspace') {
            this.value = this.value.substr(0, this.value.length - 1)
            this.inputCount++
        }
    }

    chapterChange () {
        this.index = 0
    }

    next () {
        this.index = this.index + 1
        if (this.index >= this.words.length) {
            this.index = 0
        }
    }

    success (word:string) {
        this.next()
        if (this.config.sound === 'y') {
            wordPlaySound(word, this.config.voice).play()
        } else {
            this.beepAudio.play()
        }
        this.correctCount = this.correctCount + word.length
    }

    error () {
        this.hintAudio.play()
    }

    async mounted () {
        if (storage.get('qwertyConfig')) {
            this.config = storage.get('qwertyConfig')
        }
        if (this.dictId) {
            this.getData()
        }
        this.clickAudio = playSound('click')
        this.hintAudio = playSound('hint')
        this.beepAudio = playSound('beep')
        window.addEventListener('keydown', this.onKeydown)
    }

    beforeDestroy () {
        window.removeEventListener('keydown', this.onKeydown)
    }
}
</script>

<style src="./write.styl" lang="stylus" scoped></style>
