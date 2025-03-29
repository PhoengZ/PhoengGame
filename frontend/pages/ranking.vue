<script setup>
import BaseBlockList from '~/components/BaseBlockList.vue';

const response = await fetch('http://localhost:3002/user/topscore');
const data = await response.json()
const arr = ref(['1','2','3','4']);
arr.value = data;
</script>
<template>
    <header class=" w-full bg-amber-100 h-15">

    </header>
    <div class=" w-full flex justify-center content-center">
        <BaseBlockList :items="arr"/>
    </div>
</template>