<!--
* Result
* @author tangxiaomi <81195314@qq.com>
* @date 2022-05-18 16:22:41
* @since 0.1.0
-->

<template>
    <div class="result">
        <div class="box">
            <div class="number">{{ seconds }}s</div>
            <div class="text">时间</div>
        </div>
        <div class="box">
            <div class="number">{{ inputCount }}</div>
            <div class="text">输入数</div>
        </div>
        <div class="box">
            <div class="number">{{ speed }}/分</div>
            <div class="text">速度</div>
        </div>
        <div class="box">
            <div class="number">{{ correctCount }}</div>
            <div class="text">正确数</div>
        </div>
        <div class="box">
            <div class="number">{{ correctRate }}</div>
            <div class="text">正确率</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: {}
})

export default class Result extends Vue {
    @Prop() time:any
    @Prop() inputCount:any
    @Prop() correctCount:any

    get seconds () {
        return Number((this.time / 1000).toFixed(0))
    }

    get speed () {
        return (this.correctCount / (this.seconds / 60) || 0).toFixed(0)
    }

    get correctRate () {
        return (this.correctCount / (this.inputCount === 0 ? 1 : this.inputCount)).toFixed(2)
    }

}
</script>

<style src="./result.styl" lang="stylus" scoped></style>
