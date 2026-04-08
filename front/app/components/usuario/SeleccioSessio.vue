<template>
  <div>
    <p>SeleccioSessio funciona</p>
  </div>
</template>

<script setup>
defineProps({
  peliculaActiva: Object
});

defineEmits(['tornar', 'seleccioSessio']);
</script>

<style scoped>
</style>
