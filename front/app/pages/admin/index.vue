<template>
  <div>
    <div class="admin-panel">
      <h2>Zona de Administración</h2>

    </div>
  </div>
</template>

<script setup>
// Cal implementar la validació de permisos administratius des del middleware.
</script>

<style scoped>
.admin-panel {
  background: #fff;
  border-left: 6px solid #111;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.admin-panel h2 {
  margin-top: 0;
  color: #111;
  font-size: 1.8rem;
}

.panells-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card-admin {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.card-admin h3 {
  margin-top: 0;
  color: #333;
}

.card-admin p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.btn-dark {
  background: #111;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
  width: 100%;
  transition: opacity 0.2s;
}

.btn-dark:hover {
  opacity: 0.8;
}
</style>
