<template>
  <div class="BackButton">
    <button @click="back">{{ text }}</button>
  </div>
</template>

<script>
  export default {
    name: 'BackButton',
    props: [
      'buttonText'
    ],
    methods: {
      back() {
        this.$router.back();
      }
    },
    computed: {
      text() {
        if (this.buttonText == null) {
          return 'Back';
        } else {
          return this.buttonText;
        }
      }
    }
  }
</script>

