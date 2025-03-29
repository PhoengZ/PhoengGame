<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCookie, useRuntimeConfig, navigateTo } from '#app'

const token = useCookie('token')
const username = ref(token.value || 'Guest')
const id = ref('1'); 
const point = ref('0'); 
const date = ref(new Date()); 

const fetchUserData = async () => {
  try {
    const response = await fetch(`http://localhost:3002/user/getuser?username=${username.value}`)
    const data = await response.json()
    if (data && data.length > 0) {
      point.value = data[0].point
      date.value = new Date(data[0].countdown_time)
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

let intervalId = null

onMounted(async () => {
  if (!token.value) {
    navigateTo('/login')
  } else {
    username.value = token.value
    await fetchUserData() // Fetch iniziale
    // Imposta l'intervallo per aggiornare i dati ogni secondo
    intervalId = setInterval(fetchUserData, 1000)
  }
})

onUnmounted(() => {
  // Pulisci l'intervallo quando il componente viene smontato
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Nuova funzione logout
const logout = () => {
  token.value = null
  navigateTo('/login')
}

const boxes = ref([
  { id: 1, text: 'Game 1', image: 'https://via.placeholder.com/300' },
  { id: 2, text: 'Game 2', image: 'https://via.placeholder.com/300/FF0000' }
]);

const currentIndex = ref(0);

const nextBox = () => {
  currentIndex.value = (currentIndex.value + 1) % boxes.value.length;
};

const prevBox = () => {
  currentIndex.value = (currentIndex.value - 1 + boxes.value.length) % boxes.value.length;
};
</script>
<template>
  <div class="flex justify-center flex-col">
    <section class="w-full h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-xl flex justify-between items-center px-5">
      <div class="text-white font-semibold">
        <h1 class="text-2xl">Rank: {{ id }}</h1>
        <h2 class="text-xl">Point: {{ point }}</h2>
      </div>
      <div class="text-white text-center">
        <h1 class="text-xl">{{ date.toLocaleString() }}</h1>
        <h2 class="text-md mt-2">{{ username }}</h2>
      </div>
      <!-- Pulsante per il logout -->
      <div>
        <button @click="logout" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
      </div>
    </section>
    <div class="relative flex justify-center items-center h-[500px] w-[1000px] bg-gray-200 border-2 border-gray-400 rounded-md mx-auto mt-10 overflow-hidden">
      <div
        v-for="(box, index) in boxes"
        :key="box.id"
        class="absolute inset-0 transition-transform duration-500"
        :style="{ transform: `translateX(${(index - currentIndex) * 100}%)` }"
      >
        <img :src="box.image" alt="Placeholder" class="absolute inset-0 w-full h-full object-cover rounded-md" />
        <p class="text-black text-xl font-bold z-10 relative text-center mt-[220px]">{{ box.text }}</p>
      </div>
    </div>
    <button
      @click="prevBox"
      class="absolute left-[calc(45%-550px)] top-[calc(50%+50px)] transform -translate-y-1/2 bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500"
    >
      ←
    </button>
    <button
      @click="nextBox"
      class="absolute right-[calc(45%-550px)] top-[calc(50%+50px)] transform -translate-y-1/2 bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500"
    >
      →
    </button>
  </div>
</template>