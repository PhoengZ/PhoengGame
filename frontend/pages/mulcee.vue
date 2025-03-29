<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-200 to-gray-100 p-6">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">MULCEE GAME</h2>
      
      <!-- Enemy Section -->
      <div class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md w-2/4 mb-6">
        <img src="/picture/tiger.jpg" alt="Tiger" class="w-20 h-20 rounded-full border-4 border-gray-300" />
        <div class="flex-1">
          <div class="text-xl font-semibold text-gray-800" id = "enemyName"></div>
          <div class="w-full bg-gray-300 h-3 rounded-full mt-2">
            <div class="h-full bg-red-500 rounded-full transition-all duration-500" :style="{ width: enemyData.health + '%' }"></div>
          </div>
        </div>
      </div>
  
      <!-- Word Display -->
      <div class="bg-gray-800 text-white px-6 py-3 rounded-lg mb-6 text-3xl font-mono shadow-md">
        <span v-for="(char, index) in maskedWord" :key="index">
          {{ char === '_' ? ' _ ' : char }}
        </span>
      </div>
  
      <!-- Keyboard -->
      <div class="grid grid-cols-6 gap-3">
        <button
          v-for="(letter, index) in alphabet"
          :key="index"
          @click="selectLetter(letter)"
          :disabled="usedLetters.includes(letter)"
          class="w-12 h-12 bg-gray-300 rounded-lg text-lg font-semibold
                 hover:bg-gray-400 disabled:bg-gray-500 disabled:text-gray-600 shadow-md"
          :class="{ 'animate-shake': wrongLetter === letter }"
        >
          {{ letter }}
        </button>
      </div>
  
      <!-- Actions -->
      <div class="mt-6 flex space-x-4">
        <button @click="useTip" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md">Tips</button>
        <button @click="skipWord" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md">Skip</button>
      </div>
  
      <!-- Player Section -->
      <div class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md w-2/4 mt-6">
        <div class="flex-1">
          <div class="text-xl font-semibold text-gray-800" id = "playerName"></div>
          <div class="w-full bg-gray-300 h-3 rounded-full mt-2">
            <div class="h-full bg-green-500 rounded-full transition-all duration-500" :style="{ width: playerData.health + '%' }"></div>
          </div>
        </div>
        <img src="/picture/player.jpg" alt="Player" class="w-20 h-20 rounded-full border-4 border-gray-300" />
      </div>
  
      <!-- Tips Popup -->
      <div v-if="showTip" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-lg font-bold mb-2">Tip</h3>
          <p class="text-gray-700">{{ tipText }}</p>
          <button @click="showTip = false" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">OK</button>
        </div>
      </div>
    </div>
  </template>
  
<script setup>

    const enemy = await fetch('http://localhost:3002/enemy/spawnMonster');
    const enemyData = await enemy.json();  // Resolve JSON response
        console.log(enemyData.health);  // Access the health property

    const token = useCookie('token');
        const queryParams = new URLSearchParams();
        queryParams.append("username", token.value);
        const response = await fetch(`http://localhost:3002/user/getuser?${queryParams.toString()}`);
        const playerData = await response.json();
        console.log(playerData.health);
</script>

  <script>
    
  export default {
    data() {
      return {
        word: '',
        maskedWord: [],
        usedLetters: [],
        initialMaskedWord: [],
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        wrongLetter: null,
        showTip: false,
        tipText: '',
        playerName : playerData.name,
        enemyName : enemyData.enemy
      };
    },

    async created() {
      await this.fetchWord();
    },
    methods: {
      async fetchWord() {
        try {
          const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
          const data = await response.json();
          this.word = data[0].toUpperCase();
  
          // สุ่มตำแหน่งของตัวอักษรที่จะเปิดเผย
          const revealedIndexes = new Set();
          while (revealedIndexes.size < Math.ceil(this.word.length * 0.5)) {
            revealedIndexes.add(Math.floor(Math.random() * this.word.length));
          }
  
          // สร้าง maskedWord โดยให้บางตำแหน่งเป็นตัวจริง
          this.maskedWord = this.word.split('').map((char, index) => (revealedIndexes.has(index) ? char : '_'));
          this.initialMaskedWord = [...this.maskedWord];
          // รีเซ็ตตัวอักษรที่เคยเลือก
          this.usedLetters = [];
        } catch (error) {
          console.error('Error fetching word:', error);
        }
      },
      async fetchTip() {
        try {
          const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word.toLowerCase()}`);
          const data = await response.json();
          this.tipText = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition found';
        } catch (error) {
          this.tipText = 'Error fetching tip';
        }
      },
      selectLetter(letter) {
        if (this.word.includes(letter)) {
            this.maskedWord = this.word.split('').map((char, index) => {
          if (this.initialMaskedWord[index] !== '_') {
            return this.initialMaskedWord[index]; // แสดงตัวอักษรเริ่มต้น
          } else if (this.usedLetters.includes(char) || char === letter) {
            return char; // แสดงตัวอักษรที่เลือกถูก
          } else {
            return '_'; // แสดงช่องว่าง
          }
        });
  
          // ทำ damage กับ tiger เมื่อเดาคำถูกต้อง
          if (!this.maskedWord.includes('_')) {
            this.enemyHp -= 10;
            setTimeout(() => { // เพิ่ม setTimeout เพื่อหน่วงเวลา
                this.nextWord();
            }, 1000); // หน่วงเวลา 1 วินาที (1000 มิลลิวินาที)
          }
        } else {
          this.wrongLetter = letter;
          this.playerHp -= 10;
          setTimeout(() => (this.wrongLetter = null), 500);
        }
        this.usedLetters.push(letter);
      },
      async nextWord() {
      await this.fetchWord(); // ดึงคำศัพท์ใหม่
    },
      async useTip() {
        await this.fetchTip();
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
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
  .animate-shake {
    animation: shake 0.3s;
  }
  </style>
  