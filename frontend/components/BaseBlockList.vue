<script setup>
import BaseBlockItem from './BaseBlockItem.vue';

defineProps({
    quote:{
        type:String
    },
    items:{
        type:Array,
    }
})
</script>
<template>
    <ul class="[&>li]:flex flex-col w-8/12 justify-center items-center">
        <li class=" my-2 mx-2 flex justify-center gap-3 "> 
            <BaseBlockItem class=" font-bold"> 
                Rank
            </BaseBlockItem>
            <BaseBlockItem>
                Username
            </BaseBlockItem>
            <BaseBlockItem>
                Score
            </BaseBlockItem>
        </li>
        <li class=" my-2 mx-2 flex justify-center gap-3 " v-for="(item, index) in items" :key="index">
            <BaseBlockItem class=" font-bold"> 
                Rank: {{index+1}} 
            </BaseBlockItem>
            <BaseBlockItem>
                {{item["username"]}}
            </BaseBlockItem>
            <BaseBlockItem>
                {{item["point"]}}
            </BaseBlockItem>
        </li>
    </ul>
</template>