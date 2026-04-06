<template>
  <div>
    <div class="admin-panel">
      <h2>Zona Control d'Escenari</h2>
      <p>Benvingut, administrador loguejat i autoritzat de dades de StarMovie.</p>
      
      <div class="panells-grid">
         <div class="card-admin">
             <h3>Pelicules en Màster</h3>
             <p>Revisa les publicacions pendents i actives</p>
             <button class="btn-dark">Accedeix al CRUD</button>
         </div>
         <div class="card-admin">
             <h3>Monitoratge Sales</h3>
             <p>Estat dels seients presencials en les franges horàries.</p>
             <button class="btn-dark">Modifica Aforament</button>
         </div>
         <div class="card-admin" style="border-top: 4px solid #28a745;">
             <h3>Flux Financer</h3>
             <p>Entrades emeses globalment i facturació bruta.</p>
             <button class="btn-dark">Revisa Pagaments</button>
         </div>
      </div>
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
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
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
