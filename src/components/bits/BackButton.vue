<template>
  <div class="BackButton">
    <button @click="back">Back</button>
  </div>
</template>

<script>
  export default {
    name: 'BackButton',
    methods: {
      back() {
        this.$router.back();
      }
    }
  }
</script>

