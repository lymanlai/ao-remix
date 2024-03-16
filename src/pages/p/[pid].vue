<route lang="yaml">
meta:
  layout: ao
</route>

<script setup lang="ts">
const { wrapRef, terminalRef } = $(useXtermStore())
</script>

<template>
  <div ref="wrapRef" class="h-screen w-screen">
    <div id="terminal" ref="terminalRef" class="h-screen w-screen" />
  </div>
</template>
