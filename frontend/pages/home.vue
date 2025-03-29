<script setup>
const id = ref(1);
const point = ref(5);
const date = ref(new Date());
</script>
<template>
  <div class=" flex justify-center flex-col">
    <section class="w-full h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-xl flex justify-between items-center px-5">
      <div class="text-white font-semibold">
        <h1 class="text-2xl">Rank: {{ id }}</h1>
        <h2 class="text-xl">Point: {{ point }}</h2>
      </div>
      <div class="text-white text-center">
        <h1 class="text-xl">{{ date.toLocaleString() }}</h1>
        <h2 class="text-md mt-2">Username</h2>
      </div>
    </section>
  </div>
</template>