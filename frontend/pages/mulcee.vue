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
              <div class="bg-gray-800 text-white px-6 py-3 rounded-lg mb-6 text-3xl font-mono shadow-md">
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


let interval = null;

onMounted(() => {
    updateTime(); // อัปเดตครั้งแรกทันที
    interval = setInterval(updateTime, 1000); // เริ่มจับเวลาเฉพาะฝั่งไคลเอนต์
});

onUnmounted(() => {
    clearInterval(interval); // ล้าง interval เมื่อ component ถูกถอดออก
});
</script>

<script>

export default {
    data() {
        return {
            word: '',
            maskedWord: [],
            usedLetters: [],
            initialMaskedWord: [],
            usedword: [],
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            wrongLetter: null,
            showTip: false,
            tipText: '',
        };
    },

    async created() {
        await this.fetchWord();
    },
    methods: {
        async fetchWord() {
            try {
                const wordresponse = await fetch('http://localhost:3002/word/randomword');
                const wordData = await wordresponse.json();
                this.word = wordData.word.toUpperCase();
                this.tipText = wordData.meaning;

                // กำหนดจำนวนตัวอักษรที่จะเปิดเผย (เช่น เปิดเผย 3 ตัว)
                const numberOfRevealedLetters = 3;

                // สุ่มเลือกตำแหน่งของตัวอักษรที่จะเปิด
                const revealedIndexes = new Set();
                const letterCounts = {}; // ใช้ในการเก็บจำนวนการเกิดขึ้นของแต่ละตัวอักษร

                // นับจำนวนตัวอักษรที่ซ้ำกัน
                this.word.split('').forEach(char => {
                    letterCounts[char] = (letterCounts[char] || 0) + 1;
                });

                // สุ่มเลือกตัวอักษรเพื่อเปิด
                while (revealedIndexes.size < numberOfRevealedLetters) {
                    const randomIndex = Math.floor(Math.random() * this.word.length);
                    const charAtRandomIndex = this.word[randomIndex];

                    // เช็คว่าตัวอักษรนั้นซ้ำเกินไปหรือไม่
                    if (letterCounts[charAtRandomIndex] > 1 && !revealedIndexes.has(randomIndex)) {
                        revealedIndexes.add(randomIndex);
                    }
                }

                // สร้าง maskedWord โดยให้บางตำแหน่งเป็นตัวจริงและที่เหลือเป็น '_'
                this.maskedWord = this.word.split('').map((char, index) =>
                    revealedIndexes.has(index) ? char : '_'
                );

                // รีเซ็ตตัวอักษรที่เคยเลือก
                this.usedLetters = [];
                revealedIndexes.forEach(index => {
                    this.usedLetters.push(this.word[index]); // เพิ่มตัวอักษรที่เปิดไปแล้วใน usedLetters
                });

                // ตรวจสอบว่าตัวอักษรที่เปิดมีอยู่ที่ตำแหน่งอื่นหรือไม่
                revealedIndexes.forEach(index => {
                    const letter = this.word[index];
                    this.word.split('').forEach((char, i) => {
                        if (char === letter && i !== index && !revealedIndexes.has(i)) {
                            revealedIndexes.add(i); // เพิ่มตำแหน่งที่มีตัวอักษรเดียวกัน
                            this.usedLetters.push(letter); // เพิ่มตัวอักษรที่เปิดไปแล้วใน usedLetters
                        }
                    });
                });

                // อัปเดต maskedWord ให้แสดงผลทุกตำแหน่งที่พบตัวอักษรเดียวกัน
                this.maskedWord = this.word.split('').map((char, index) =>
                    revealedIndexes.has(index) ? char : '_'
                );

            } catch (error) {
                console.error('Error fetching word:', error);
            }
        },
        selectLetter(letter) {
            if (this.word.includes(letter)) {
                // เปิดเผยทุกตำแหน่งของตัวอักษรที่ถูกต้อง
                this.maskedWord = this.word.split('').map((char, index) =>
                    (char === letter || this.maskedWord[index] !== '_') ? char : '_'
                );

                // เช็คว่าคำทั้งหมดถูกเปิดหรือยัง
                if (!this.maskedWord.includes('_')) {
                    this.enemyHp -= 10;
                    setTimeout(() => {
                        this.nextWord();
                    }, 1000);
                }
            } else {
                // ถ้าตัวอักษรผิด ลด HP ผู้เล่น และทำให้ปุ่มสั่น
                this.wrongLetter = letter;
                this.playerHp -= 10;
                setTimeout(() => (this.wrongLetter = null), 500);
            }

            // เพิ่มตัวอักษรลงในรายการที่เลือกไปแล้ว
            this.usedLetters.push(letter);
        },
        async nextWord() {
            await this.fetchWord(); // ดึงคำศัพท์ใหม่
        },
        async useTip() {
            this.showTip = true;
            this.playerHp -= 10;
        },
        async skipWord() {
            this.playerHp -= 20;
            this.usedLetters = [];
            await this.fetchWord();
        }
    }
};
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