<template>
  <div>
    <div class="admin-panel">
      <h2>Zona d'Administració</h2>
      <div>
        <NuxtLink to="/admin/pelicules/llistaPelicules" class="btn-dark"
          style="display: block; text-align: center; text-decoration: none; box-sizing: border-box;">
          Gestió de Pel·lícules
        </NuxtLink>
        <NuxtLink to="/admin/sales/llistaSales" class="btn-dark"
          style="display: block; text-align: center; text-decoration: none; box-sizing: border-box;">
          Gestionar Sales
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Apliquem el middleware per protegir la ruta només per administradors
definePageMeta({
  middleware: ['admin']
});
</script>

<style scoped>
@font-face {
  font-family: "VintageFont";
  src: url("/fonts/neon_light/NeonLight-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "NormalFont";
  src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.admin-panel {
  background: #08080c;
  border: 4px solid #ffea00;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 25px rgba(255, 234, 0, 0.4), inset 0 0 15px rgba(255, 234, 0, 0.2);
  color: #fff;
}

.admin-panel h2 {
  margin-top: 0;
  color: #00f3ff;
  font-family: "VintageFont";
  font-size: 2.8rem;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
  letter-spacing: 2px;
}

.btn-dark {
  font-family: "NormalFont";
  background: transparent;
  color: #ff00aa;
  border: 2px solid #ff00aa;
  padding: 15px 15px;
  border-radius: 30px;
  font-size: 1.6rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
  box-shadow: 0 0 10px rgba(255, 0, 170, 0.5), inset 0 0 10px rgba(255, 0, 170, 0.3);
}

.btn-dark:hover {
  background: #ff00aa;
  color: #08080c;
  box-shadow: 0 0 25px #ff00aa, inset 0 0 15px #ff00aa;
}
</style>
