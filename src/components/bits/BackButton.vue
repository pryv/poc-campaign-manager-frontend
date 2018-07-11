<template>
  <div class="BackButton">
    <v-btn depressed small color="primary" @click="back">
      {{ text }}
    </v-btn>
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

