<!--
* Dict
* @author tangxiaomi <81195314@qq.com>
* @date 2022-05-16 14:27:37
* @since 0.1.0
-->

<template>
    <div
        class="wrap"
        :class="{ open: isOpen }">
        <div
            class="handle"
            :class="{ open: isOpen }"
            @click="isOpen = !isOpen">
            <i
                class="iconfont icon-xiayiye"></i>
        </div>
        <div class="content">
            <div class="nav">
                <div
                    v-for="(category, key) in categorys"
                    :key="key"
                    class="btn"
                    :class="{ active: isActive(key) }"
                    @click="handleCate(key)">
                    {{ key }} {{ category.length }}
                </div>
            </div>
            <div class="list">
                <div
                    v-for="item in list"
                    :key="item.id"
                    class="item"
                    @click="handleDict(item)">
                    <p class="name">{{ item.name }}</p>
                    <p class="desc">{{ item.description }}</p>
                    <p class="length">{{ item.length }}词</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DictData from '@/dict'
import { storage } from '@/utils'

@Component({
    components: {}
})

export default class Dict extends Vue {

    isOpen = false
    ignores = ['en2en', '日语学习', '人教版英语', '外研版英语', '北师大版英语', '英语学习']

    get list () {
        return DictData.filter(v => {
            if (!this.category) {
                return true
            }
            return v.category === this.category
        })
    }
    category = ''

    get categorys () {
        return DictData.reduce((map:any, item:any) => {
            const category = item.category
            if (!~this.ignores.indexOf(category)) {
                if (map[category]) {
                    map[category].push(item)
                } else {
                    map[category] = [item]
                }
                return map
            }
            return map
        }, {})
    }

    handleCate (category:any) {
        this.category = category
    }

    isActive (category:any) {
        return this.category === category
    }

    handleDict (dict:any) {
        storage.set('qwertyDict', JSON.stringify(dict))
        this.$emit('change', dict)
    }

}
</script>

<style src="./dict.styl" lang="stylus" scoped></style>
