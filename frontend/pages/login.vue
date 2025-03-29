<script setup>
const name = ref("")
const password = ref("")
const errors = ref({})
const login = async () => {
  if (validateForm()) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("username", name);
      queryParams.append("password", password);
      const response = await fetch(`http://localhost:3002/user/login?${queryParams.toString()}`);
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

}

const validateForm = () => {
  errors.value = {}

  let check = true;

  if (!name.value.trim()) {
    errors.value.name = "Please enter your name."
    check = false;
  }
  if (!password.value.trim()) {
    errors.value.password = "Please enter your password."
    check = false;
  }
  return check
}
</script>

<template>
  <form class="flex w-full h-screen justify-center max-w-[500px] flex-col mx-auto" @submit.prevent="login">
    <p class=" text-[100px] mb-4 text-center">
      Login
    </p>
    <input class=" border-gray-400 border-2 rounded-md outline-none p-4 w-full max-w-[500px]" v-model="name"
      placeholder="Username" />
    <p v-if="errors.name" class=" text-red-400">{{ errors.name }}</p>
    <input class=" border-gray-400 border-2 rounded-md outline-none p-4 w-full max-w-[500px] mt-5"
      placeholder="Password" v-model="password" />
    <p v-if="errors.password" class=" text-red-400">{{ errors.password }}</p>
    <div class="flex justify-center">
      <button
        class=" bg-gray-400 rounded-md px-3 py-2 mt-[20px] w-[200px] hover:scale-90 transition-all cursor-pointer active:bg-gray-500"
        type="submit">เข้าสู่เกม</button>
    </div>
  </form>
</template>