<template>
  <Register />
</template>


<script>
import Register from "./register.vue"; // Import component

export default {
  components: {
    Register, // Register component
  },
};
definePageMeta({
  middleware: 'redirect',
});
</script>
