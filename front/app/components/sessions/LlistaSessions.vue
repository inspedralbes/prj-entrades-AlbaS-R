<template>
  <div class="contenidor-sessions" :class="{ 'layout-graella': useGrid }">
    <div v-if="!sessions || sessions.length === 0" class="avís-buit">
      No hi ha sessions disponibles.
    </div>
    
    <ul v-else class="llista-sessions">
      <li 
        v-for="session in sessions" 
        :key="session.id" 
        class="fila-sessio"
        :class="{ 'seleccionada': modelValue === session.id, [tipus]: true }"
        @click="$emit('update:modelValue', session.id)"
      >
        <div class="info-sessio">
          <p v-if="tipus !== 'vip' && session.sala" class="nom-sala">{{ session.sala.nom }}</p>
          <p class="data-hora">{{ formatarData(session.data_hora) }}</p>
          <p class="preu">{{ session.preu }} €</p>
        </div>
        <div class="indicador-seleccio">
           <span v-if="modelValue === session.id">✔ SELECCIONADA</span>
           <span v-else>SELECCIONAR</span>
        </div>
      </li>
    </ul>
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
  },
  modelValue: [Number, String], // ID de la sessió seleccionada
  useGrid: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);

function formatarData(dataHora) {
  if (!dataHora) return "Data pendent";
  try {
    // Posem la T per si a la base de dades ve amb espais (format ISO)
    const strData = dataHora.includes('T') ? dataHora : dataHora.replace(' ', 'T');
    const data = new Date(strData);
    if (isNaN(data.getTime())) return dataHora;

    const dia = data.getDate();
    const mes = data.toLocaleString('ca-ES', { month: 'long' });
    const hora = dataHora.slice(11, 16);
    // Ho deixem bonic perquè s'entengui bé
    return `${dia} de ${mes} · ${hora}`;
  } catch (e) {
    return dataHora;
  }
}
</script>

<style scoped>
@font-face {
  font-family: "NormalFont";
  src: url("/fonts/tt-directors-demo.bl-regular.ttf") format("truetype");
}
@font-face {
  font-family: "MovingFont";
  src: url("/fonts/moving.regular.otf") format("truetype");
}

.contenidor-sessions {
  width: 100%;
}

.avís-buit {
  color: #ffea00;
  text-align: center;
  padding: 30px;
  font-family: "NormalFont";
  font-size: 1.2rem;
  border: 2px dashed rgba(255, 234, 0, 0.3);
  border-radius: 12px;
}

.llista-sessions {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

/* Suport per a 2 columnes */
.layout-graella .llista-sessions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.fila-sessio {
  background: rgba(5, 5, 10, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  gap: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.fila-sessio:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: scale(1.02);
}

/* Estils de selecció segons tipus */
.fila-sessio.normal.seleccionada {
  border-color: #00f3ff;
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.2);
  background: rgba(0, 243, 255, 0.05);
}

.fila-sessio.vip.seleccionada {
  border-color: #ff00aa;
  box-shadow: 0 0 15px rgba(255, 0, 170, 0.4), inset 0 0 10px rgba(255, 0, 170, 0.2);
  background: rgba(255, 0, 170, 0.05);
}

.info-sessio {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nom-sala {
  color: #ffea00;
  font-family: "MovingFont";
  font-size: 1rem;
  margin: 0;
  letter-spacing: 1px;
}

.data-hora {
  color: #ffffff;
  font-family: "MovingFont";
  font-size: 1.3rem;
  margin: 0;
}

.preu {
  color: #aaa;
  font-family: "MovingFont";
  font-size: 1rem;
  margin: 0;
}

.indicador-seleccio {
  font-family: "NormalFont";
  font-size: 0.85rem;
  letter-spacing: 1px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s;
}

.seleccionada .indicador-seleccio {
  background: #ffea00;
  color: #000;
  font-weight: bold;
}
</style>
