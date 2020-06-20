<template>
  <p v-show="true" aria-disabled title="Hello World!">{{ greeting }} World!</p>
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
  width: 100px;
  height: 100px;
  font-size: 2em;
  text-align: center;
}
</style>
