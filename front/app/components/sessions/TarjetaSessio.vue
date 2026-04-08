<template>
  <div>
    <p>TarjetaSessio funciona</p>
  </div>
</template>

<script setup>
defineProps({
  sessions: {
    type: Array,
    required: true
  },
  tipus: {
    type: String,
    required: true
  }
});

defineEmits(['seleccioSessio']);
</script>

<style scoped>
</style>
