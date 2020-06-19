<template>
  <p>{{ greeting }} World!</p>
</template>

<script lang="ts">
export default {
  data() {
    return {
      greeting: 'Hello',
    }
  },
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
