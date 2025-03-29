<script setup>
import { ref } from 'vue';
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const errors = ref({});

const createUser = async () => {
  let validate = validateForm();
  if (validate) {
    try {
      const response = await fetch('http://localhost:3002/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name.value,
          password: password.value
        })
      })
      if (response.status < 400) {
        const router = useRouter()
        router.push("/login")
      } else {
        throw new Error()
      }
    } catch (error) {
      errors.value.register = "The username you entered is already taken. Please choose a different one."
    }
  }
}

const validateForm = () => {
  errors.value = {};
  let check = true;

  if (!name.value.trim()) {
    errors.value.name = "Please enter your name."
    check = false;
  }
  if (!password.value.trim()) {
    errors.value.password = "Please enter your password."
    check = false;
  }
  if (!confirmPassword.value.trim()) {
    errors.value.confirmPassword = "Please enter your confirm password."
    check = false;
  }
  if (password.value != confirmPassword.value) {
    errors.value.confirmPassword = "Please enter the Confirm Password to match the Password."
    check = false;
  }

  return check;
}
</script>


<template>
  <div class="bg-black relative">

    <p class=" text-white top-0 right-3 fixed text-[20px] cursor-default md:text-[40px]">The Deep</p>
    <div class="flex w-full h-screen justify-center items-center flex-col">
      <p class=" text-[50px] mb-4 text-white cursor-default md:text-[100px] sm:text-[80px]">
        REGISTER
      </p>
      <form @submit.prevent="createUser" class="flex flex-col w-full max-w-[500px] p-3">
        <input class=" border-white border-2 rounded-md outline-none p-4 w-full max-w-[500px] text-white" v-model="name"
          placeholder="Username" />
        <p v-if="errors.name" class=" text-red-400">{{ errors.name }}</p>
        <input class=" border-white border-2 rounded-md outline-none p-4 w-full max-w-[500px] mt-5 text-white"
          type="password" v-model="password" placeholder="Password" />
        <p v-if="errors.password" class="text-red-400">{{ errors.password }}</p>
        <input class=" border-white border-2 rounded-md outline-none p-4 w-full max-w-[500px] mt-5 text-white"
          type="password" v-model="confirmPassword" placeholder="Confirm Password" />
        <p v-if="errors.confirmPassword" class="text-red-400">{{ errors.confirmPassword }}</p>
        <p v-if="errors.register" class="text-red-400">{{ errors.register }}</p>
        <div class="flex justify-center">

          <button
            class=" bg-white rounded-md px-3 py-2 mt-[20px] w-[200px] hover:scale-90 transition-all cursor-pointer active:bg-gray-500 drop-shadow-[0_0px_5px_rgba(255,255,255,1)]"
            @click="showName" type="submit">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>