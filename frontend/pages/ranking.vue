<script setup>
import BaseBlockList from '~/components/BaseBlockList.vue';

const queryParams = new URLSearchParams();
const response = await fetch('http://localhost:3002/user/topscore');
const data = await response.json()
const arr = ref(['1','2','3','4']);
arr.value = data;

const isHovered = ref(false);

const handleMouseOver = () => {
  isHovered.value = true;
}

const handleMouseOut = () => {
  isHovered.value = false;
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-black ">
    <!-- Header Section -->
    <section :class="[
      'w-full flex justify-between items-center px-5 transition-all duration-1000',
      'shadow-[0_8px_16px_-4px_rgba(0,0,1,0.5)] relative z-10',
      isHovered ? 'h-35' : 'h-20'
    ]">
      <div class="text-white text-2xl font-bold">
        Ranking Board
      </div>
      <div>
        <NuxtLink to="/home" 
          class="bg-white text-black px-4 py-2 rounded font-bold
          shadow-[0_0_5px_rgba(255,255,255,0.2)] 
          hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] 
          transition-all duration-300">
          Back to Home
        </NuxtLink>
      </div>
    </section>

    <!-- Main Content -->
    <div class="flex-grow h-[calc(100vh-10rem)]">
      <BaseBlockList :items="arr"/>
    </div>

    <!-- Footer Section -->
    <section :class="[
      'w-full flex justify-between items-center px-5 transition-all duration-800',
      'shadow-[0_-8px_16px_-4px_rgba(0,0,1,0.5)] relative z-10',
      isHovered ? 'h-35' : 'h-20',
    ]">
      <div class="text-white text-center w-full">
        © 2024 Phoeng Game
      </div>
    </section>
  </div>
</template>