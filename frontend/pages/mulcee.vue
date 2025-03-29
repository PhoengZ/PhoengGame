<template>
    
    <div class=" fixed inset-0 overflow-hidden">
        <h2 class="text-6xl font-bold text-white w-full bg-black text-center py-5">MULCEE GAME</h2>
        <div class="flex flex-row  justify-between h-screen bg-gradient-to-b bg-black p-6 gap-3">
            <!-- Player Section (Moved to the left) -->
            <div class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md w-40 h-8/12 mb-6 self-start flex-col">
                <img src="/picture/player.jpg" alt="Player" class="w-20 h-20 rounded-full border-4 border-gray-300" />
                <div class="flex-1">
                    <div class="text-xl font-semibold text-gray-800">{{ user }}</div>
                    <div class="text-xl font-semibold text-gray-800">{{ time }}</div>
                </div>
            </div>
            <!-- Word Display -->
            <section>
              <div class="bg-gray-800 text-white px-6 py-3 rounded-lg mb-6 text-3xl font-mono shadow-md text-center">
                <span v-for="(char, index) in maskedWord" :key="index">
                    {{ char === '_' ? ' _ ' : char }}
                </span>
              </div>

            <!-- Keyboard -->
              <div class="grid grid-cols-6 gap-3">
                  <button v-for="(letter, index) in alphabet" :key="index" @click="selectLetter(letter)"
                      :disabled="usedLetters.includes(letter)" class="shadow-[0_0_5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 w-12 h-12 bg-gray-300 rounded-lg text-lg font-semibold
                     hover:bg-gray-400 disabled:bg-gray-500 disabled:text-gray-600"
                      :class="{ 'animate-shake': wrongLetter === letter }">
                      {{ letter }}
                  </button>
              </div>

              <div class="mt-6 flex space-x-4 justify-center">
                  <button @click="useTip"
                      class="shadow-[0_0_5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 px-4 py-2 bg-yellow-500 text-white rounded-lg  hover:scale-90 cursor-pointer">Tips</button>
                  <button @click="skipWord"
                      class=" shadow-[0_0_5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 px-4 py-2 bg-red-500 text-white rounded-lg   hover:scale-90  cursor-pointer">Skip</button>
              </div>
              <div v-if="showTip" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                      <h3 class="text-lg font-bold mb-2">Tip</h3>
                      <p class="text-gray-700">{{ tipText }}</p>
                      <button @click="showTip = false"
                          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">OK</button>
                  </div>
              </div>
              <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" v-if="showItem">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                      <h3 class="text-lg font-bold mb-2">Treasure</h3>
                      <p class="text-gray-700">{{ treasure.itemName }}</p>
                      <img :src="treasure.url" alt="" class=" w-6/12 h-6/12">
                      <button @click="showItem = false"
                          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">OK</button>
                  </div>
                </div>
            </section>
            <div class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md w-40 h-8/12 mb-6 self-start justify-self-end flex-col">
                <div class="flex-1 relative overflow-hidden">
                    <div class="text-xl font-semibold text-gray-800">{{ en }}</div>
                </div>
                <img src="/picture/tiger.jpg" alt="Tiger" class="w-20 h-20 rounded-full border-4 border-gray-300" />
            </div>
        </div>
    </div>
    
</template>

<script setup>

const enemy = await fetch('http://localhost:3002/enemy/spawnMonster');
const enemyData = await enemy.json();  // Resolve JSON response
const user = ref("");
const en = ref("");
en.value = enemyData.name;
const token = useCookie('token');
const queryParams = new URLSearchParams();
queryParams.append("username", token.value);
const response = await fetch(`http://localhost:3002/user/getuser?${queryParams.toString()}`);
const playerData = await response.json();
user.value = playerData.username;


const time = ref("");
time.value = playerData.countdown_time;
function updateTime() {
    const now = new Date(); // เวลาปัจจุบัน (Local Time)
    const targetTime = new Date(playerData.countdown_time); // แปลงจาก ISO 8601 เป็น Date object

    let remainingTime = Math.floor((targetTime - now) / 1000); // เวลาที่เหลือ (วินาที)

    if (remainingTime <= 0) {
        time.value = "00:00:00"; // หมดเวลา
        return;
    }

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    time.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

let word = ref('');
let maskedWord = ref([]);
let usedLetters= ref([]);
let alphabet = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
let wrongLetter = ref(null);
let showTip = ref(false);
let tipText = ref('');
let interval = ref(null);
let showItem = ref(false);
let treasure = ref({});
async function test() {
    const wordresponse = await fetch('http://localhost:3002/word/randomword');
    const wordData = await wordresponse.json();
    word.value = wordData.word.toUpperCase();
    tipText = wordData.meaning;

    const numberOfRevealedLetters = 3;
    const letterCounts = {}; 
    const revealedIndexes = new Set();

    const letterPositions = {};
    word.value.split('').forEach((char, index) => {
        letterCounts[char] = (letterCounts[char] || 0) + 1;
        if (!letterPositions[char]) letterPositions[char] = [];
        letterPositions[char].push(index);
    });

    const uniqueLetters = Object.keys(letterCounts).filter(c => letterCounts[c] > 1);
    const lettersToReveal = uniqueLetters.length >= numberOfRevealedLetters 
        ? uniqueLetters.sort(() => Math.random() - 0.5).slice(0, numberOfRevealedLetters)
        : Object.keys(letterCounts).sort(() => Math.random() - 0.5).slice(0, numberOfRevealedLetters);

    lettersToReveal.forEach(letter => {
        letterPositions[letter].forEach(index => revealedIndexes.add(index));
    });
    maskedWord.value = word.value.split('').map((char, index) =>
        revealedIndexes.has(index) ? char : '_'
    );
    usedLetters.value = Array.from(revealedIndexes).map(index => word.value[index]);
}

async function selectLetter(letter) {
    if (word.value.includes(letter)) {
        maskedWord.value = word.value.split('').map((char, index) =>
            (char === letter || maskedWord.value[index] !== '_') ? char : '_'
        )
        if (!maskedWord.value.includes('_')) {
            setTimeout(() => {
                nextWord();
            }, 1000);
        }
    } else {
        wrongLetter.value = letter;
        setTimeout(() => (wrongLetter.value = null), 500);
    }
    usedLetters.value.push(letter);
}
async function nextWord() {
    randomItem();
    showItem.value = true;
    await test(); // ดึงคำศัพท์ใหม่
}
async function useTip() {
    showTip.value = true;
}
async function skipWord() {
    usedLetters.value = [];
    await test();
}
async function randomItem() {
    const item = await fetch('http://localhost:3002/item/randomitem');
    const itemData = await item.json();
    treasure.value = itemData;
}
onMounted(() => {
    updateTime(); // อัปเดตครั้งแรกทันที
    interval = setInterval(updateTime, 1000); // เริ่มจับเวลาเฉพาะฝั่งไคลเอนต์
});
await skipWord();
onUnmounted(() => {
    clearInterval(interval); // ล้าง interval เมื่อ component ถูกถอดออก
});
</script>


<style>
@keyframes shake {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(5px);
    }

    75% {
        transform: translateX(-5px);
    }

    100% {
        transform: translateX(0);
    }
}

.animate-shake {
    animation: shake 0.3s;
}
</style>