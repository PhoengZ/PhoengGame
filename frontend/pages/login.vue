<script setup>
const name = ref("")
const password = ref("")
const errors = ref({})

const goToSignIn = () => {
  const router = useRouter()
  console.log("test")
  router.push("/register")
}

const login = async () => {
  if (validateForm()) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("username", name.value);
      queryParams.append("password", password.value);
      const response = await fetch(`http://localhost:3002/user/login?${queryParams.toString()}`);
      if (response.status < 400) {
        const data = await response.json()
        const cookie = useCookie('token')
        cookie.value = data["username"]

        const router = useRouter()
        router.push('/home')
      } else {
        throw new Error()
      }
    } catch (error) {
      errors.value.login = "Login failed. The username or password you entered is incorrect. Please double-check your credentials and try again."
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
  <div class=" bg-black relative">

    <p class=" text-white top-0 right-3 fixed text-[40px] cursor-default">The Deep</p>
    <form class="flex w-full h-screen justify-center max-w-[500px] flex-col mx-auto font-title "
      @submit.prevent="login">
      <p class=" text-[100px] mb-4 text-center font-doto text-white cursor-default">
        LOGIN
      </p>
      <input class=" border-white border-2 rounded-md outline-none p-4 w-full max-w-[500px] text-white" v-model="name"
        placeholder="Username" />
      <p v-if="errors.name" class=" text-red-400">{{ errors.name }}</p>
      <input class=" border-white border-2 rounded-md outline-none p-4 w-full max-w-[500px] mt-5 text-white"
        placeholder="Password" v-model="password" type="password" />
      <p v-if="errors.password" class=" text-red-400">{{ errors.password }}</p>
      <p v-if="errors.login" class=" text-red-400">{{ errors.login }}</p>
      <div class="flex justify-center gap-4">
        <button
          class=" bg-white rounded-md px-3 py-2 mt-[20px] w-[200px] hover:scale-90 transition-all cursor-pointer active:bg-gray-500"
          type="submit">Login</button>
        <button
          class=" bg-white rounded-md px-3 py-2 mt-[20px] w-[200px] hover:scale-90 transition-all cursor-pointer active:bg-gray-500"
          type="button" @click="goToSignIn">Sign
          in</button>
      </div>
    </form>
  </div>
</template>