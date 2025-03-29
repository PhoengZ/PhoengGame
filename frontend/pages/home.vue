<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCookie, useRuntimeConfig, navigateTo } from '#app'
import backgroundImage from '~/assets/image/background.jpg'

const token = useCookie('token')
const username = ref(token.value || 'Guest')
const id = ref('1');
const point = ref('0');
const date = ref(new Date());
const popupIsOpen = ref(false);


import Inventory from "@/components/inventory.vue"; // Import component

const togglePopup = () => {
  popupIsOpen.value = !popupIsOpen.value
  console.log(popupIsOpen.value)
}

const goToRanking = () => {
  const router = useRouter()
  router.push("/ranking")
}

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
let timeIntervalId = null;

onMounted(async () => {
  if (!token.value) {
    navigateTo('/login')
  } else {
    username.value = token.value
    await fetchUserData()
    intervalId = setInterval(fetchUserData, 1000)
    timeIntervalId = setInterval(() => {
      date.value = new Date()
    }, 1000)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (timeIntervalId) {
    clearInterval(timeIntervalId)
  }
})

const logout = () => {
  token.value = null
  navigateTo('/login')
}

const gameBox = ref({
  text: 'PLAY GAME',
  image: backgroundImage
});

const isHovered = ref(false);

const handleMouseOver = () => {
  isHovered.value = true;
}

const handleMouseOut = () => {
  isHovered.value = false;
}

</script>
<template>
  <div class="flex flex-col min-h-screen bg-black overflow-hidden relative">
    <div class=" transition-opacity fixed top-0 left-0 right-0 bottom-0 bg-black/0 z-30 backdrop-blur-sm "
      :class="{ 'opacity-0 pointer-events-none': !popupIsOpen, 'opacity-100': popupIsOpen }">
      <Inventory :popupToggle="togglePopup" :isPopupOpen="popupIsOpen" />
    </div>
    <section :class="[
      'w-full flex justify-between items-center px-5 transition-all duration-1000',
      'shadow-[0_8px_16px_-4px_rgba(0,0,0,1)] relative z-10',
      isHovered ? 'h-35' : 'h-20'
    ]">
      <div class="text-white font-semibold">
        <h1 class="text-2xl">Rank: {{ id }}</h1>
        <h2 class="text-xl">Point: {{ point }}</h2>
      </div>

      <div class="text-white text-center">
        <h1 class="text-xl">{{ date.toLocaleString() }}</h1>
        <h2 class="text-md mt-2">{{ username }}</h2>
      </div>

      <div>
        <button @click="logout" class="bg-white text-black px-3 py-1 rounded font-bold
          shadow-[0_0_5px_rgba(255,255,255,0.2)] 
          hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] 
          transition-all duration-300 hover:scale-90 cursor-pointer">
          Logout
        </button>
      </div>
    </section>

    <div class="flex-grow relative">
      <div class="absolute inset-0">
        <img :src="gameBox.image" alt="Placeholder" class="w-full h-full object-cover animate-shake" />
        <div class="absolute inset-0 flex justify-center items-center">
          <button class="text-white mr-4 cursor-pointer hover:scale-90 transition-transform"
            @click="togglePopup">Backpack</button>
          <button @mouseover="handleMouseOver" @mouseout="handleMouseOut" class="px-8 py-3 text-2xl font-bold text-black bg-white rounded-lg 
            shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] 
            transition-all duration-300 hover:bg-gray-100 transform hover:scale-105 z-20">
            {{ gameBox.text }}
          </button>
          <button class="text-white ml-4 cursor-pointer hover:scale-90 transition-transform"
            @click="goToRanking">Ranking</button>
        </div>
      </div>
    </div>

    <section :class="[
      'w-full flex justify-between items-center px-5 transition-all duration-800',
      'shadow-[0_-8px_16px_-4px_rgba(0,0,0,1)] relative z-10',
      isHovered ? 'h-35' : 'h-20'
    ]">
      <!-- Footer content -->
    </section>
  </div>
</template>

<style>
@keyframes shake {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(2px, 2px) rotate(0.5deg);
  }

  50% {
    transform: translate(0, -2px) rotate(-0.5deg);
  }

  75% {
    transform: translate(-2px, 2px) rotate(0.5deg);
  }
}

.animate-shake {
  animation: shake 6s ease-in-out infinite;
}
</style>