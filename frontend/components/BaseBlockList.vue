<script setup>
import BaseBlockItem from './BaseBlockItem.vue';
import backgroundRank from '~/assets/image/backgroundrank.jpg'  // เพิ่ม import รูป

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
    <div class="relative flex w-full h-full overflow-hidden">
        <!-- Background with blur -->
        <div class="absolute inset-0 wave-animation" 
             :style="{ 
                backgroundImage: `url(${backgroundRank})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(5px)',
                transform: 'scale(1.1)'
             }">
        </div>
        <!-- Overlay for better contrast -->
        <div class="absolute inset-0 bg-black/30"></div>

        <!-- Content wrapper -->
        <div class="relative flex w-full z-10">
            <!-- ส่วนแสดงรูปด้านซ้าย -->
            <div class="w-2/4 p-4 flex flex-col items-center justify-center">
                <div class="w-[500px] h-[300px] bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <span class="text-white">Image</span>
                </div>
                <BaseBlockItem v-if="items && items.length > 0">
                    #1 | {{items[0]["username"]}} | {{items[0]["point"]}}pts
                </BaseBlockItem>
            </div>
            
            <!-- ส่วนแสดง list ด้านขวา -->
            <ul class="w-2/4 flex flex-col justify-start items-center text-white overflow-y-auto max-h-full py-4">
                <BaseBlockItem>
                    Rank | Username | Point
                </BaseBlockItem>
                <li class="my-2 mx-2" v-for="(item, index) in items.slice(1)" :key="index">
                    <BaseBlockItem>
                        #{{index+2}} | {{item["username"]}} | {{item["point"]}}pts
                    </BaseBlockItem>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.wave-animation {
    animation: waveEffect 15s ease-in-out infinite;
}

@keyframes waveEffect {
    0% { transform: scale(1.1) translate(0, 0) rotate(0deg); }
    25% { transform: scale(1.15) translate(15px, 15px) rotate(1deg); }
    50% { transform: scale(1.1) translate(0, 20px) rotate(0deg); }
    75% { transform: scale(1.15) translate(-15px, 15px) rotate(-1deg); }
    100% { transform: scale(1.1) translate(0, 0) rotate(0deg); }
}
</style>