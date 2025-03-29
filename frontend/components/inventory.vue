<script setup>
defineProps({
  popupToggle: {
    type: Function,
    required: true,
  },
  isPopupOpen: {
    type: Boolean,
    required: true
  }
})

let selectItem = ref({})

const actionSelectItem = (targetItem, haha) => {
  selectItem.value = targetItem
  console.log(haha)
}

onMounted(() => {
  fetchData()
})

let items = ref([]);
const fetchData = async () => {
  const name = useCookie('token')
  const queryParams = new URLSearchParams();
  queryParams.append("username", name.value);
  const response = await fetch(`http://localhost:3002/user/getinventory?${queryParams.toString()}`);
  if (response.status < 400) {
    const data = await response.json()
    items.value = data
    console.log(items)
  } else {
    throw new Error()
  }
}


</script>

<template>

  <div class="flex w-full h-screen  justify-center items-center ">
    <div class="bg-white/80 rounded-lg w-full max-w-[1000px] m-7 relative transition-transform"
      :class="{ 'scale-80': !isPopupOpen, 'scale-100': isPopupOpen }">
      <button class=" transition-all hover:scale-90 absolute -top-[55px] right-0 cursor-pointer bg-white rounded-md px-4 py-2
      drop-shadow-[0_0px_5px_rgba(255,255,255,1)]" @click="popupToggle">Close</button>
      <p class="absolute text-white lg:-top-[60px] -top-[50px] left-0 cursor-default lg:text-5xl text-3xl">Inventory
      </p>
      <div
        class="flex bg-linear-to-r from-black/80 to-black/80 w-full rounded-md p-9 lg:flex-row flex-col h-[500px] lg:h-[400px] lg:justify-between lg:items-start items-center">
        <div class=" w-full max-w-[400px] rounded-tl-md rounded-bl-md flex flex-col items-center justify-center mb-4">
          <img :src="selectItem.url"
            class="w-[200px] h-[150px] lg:h-[200px] border-white border-[2px] rounded-md drop-shadow-[0_0px_5px_rgba(255,255,255,1)] object-cover">
          <div>
            <p class=" text-xl mt-6 mb-3 text-blue-500 text-center">{{ selectItem.itemName }}
            </p>
            <p class="lg:text-sm text-sm text-white text-center
            "> {{ selectItem.itemDescription }}</p>
          </div>
        </div>
        <div
          class=" grid grid-cols-[repeat(5,_50px)] grid-rows-[repeat(2,_50px)] sm:grid-cols-[repeat(5,_60px)] sm:grid-rows-[repeat(2,_60px)] lg:grid-cols-[repeat(5,_80px)] lg:grid-rows-[80px] max-w-[500px] gap-x-2 gap-y-2 rounded-tr-md rounded-br-md overflow-y-auto overflow-x-hidden  max-h-[325px]">

          <img :src="item.url" v-for="(item, index) in items" :key="index" @click="actionSelectItem(item, item.url)"
            class="  border-white border-[2px] rounded-md cursor-pointer hover:scale-90 transition-transform lg:h-[80px] sm:h-[60px] h-[50px]">
        </div>
      </div>
    </div>

  </div>

</template>