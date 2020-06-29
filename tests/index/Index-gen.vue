<template>
  <div>
    <p v-show="true" aria-disabled title="Hello World!">
      {{ greeting }} World!
    </p>
    <br />
    <h1></h1>
  </div>
</template>
<script>
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0
var _default = {
  data() {
    return {
      greeting: 'Hello',
    }
  },
}
exports.default = _default
</script>
<style>
p {
  width: 1rem;
  height: 1rem;
  font-size: 2em;
  text-align: center;
}
</style>
