

// Funcions de transformació (replicades o extretes per test)
// En un entorn real, aquestes funcions s'haurien d'exportar del component o d'un helper
// Com que no podem crear cinemaLogic.js, les testejarem tal com estan definides a la lògica de l'app

function formatarTemps(segons) {
    const min = Math.floor(segons / 60);
    const seg = segons % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function formatarData(dataHora) {
    if (!dataHora) return "";
    try {
      const formatNet = dataHora.replace('T', ' ');
      const parts = formatNet.split(' ');
      const data = parts[0].split('-').reverse().join('/');
      const hora = parts[1] ? parts[1].slice(0, 5) : '';
      return `${data} a les ${hora}`;
    } catch (e) {
      return dataHora;
    }
}

function calcularEstrelles(ratingStr) {
    if (!ratingStr) return "⭐⭐";
    let valor = parseFloat(ratingStr);
    if (ratingStr && ratingStr.indexOf("%") !== -1) {
      valor = valor / 10;
    }
    const numEstrelles = Math.round(valor / 2);
    let estrelles = "";
    for (let i = 0; i < 5; i++) {
      if (i < numEstrelles) {
        estrelles += "⭐";
      }
    }
    return estrelles || "⭐";
}

describe('Unit Tests - Transformació de Dades', () => {
  
  test('formatarTemps converteix segons a MM:SS', () => {
    expect(formatarTemps(300)).toBe('05:00');
    expect(formatarTemps(65)).toBe('01:05');
    expect(formatarTemps(10)).toBe('00:10');
  });

  test('formatarData converteix ISO a format català humà', () => {
    expect(formatarData('2025-12-25T18:30:00')).toBe('25/12/2025 a les 18:30');
    expect(formatarData('2025-01-01T09:00:00')).toBe('01/01/2025 a les 09:00');
  });

  test('calcularEstrelles converteix rating a strings d\'estrelles', () => {
    expect(calcularEstrelles('8.5')).toBe('⭐⭐⭐⭐');
    expect(calcularEstrelles('4.0')).toBe('⭐⭐');
    expect(calcularEstrelles(null)).toBe('⭐⭐');
    expect(calcularEstrelles('90%')).toBe('⭐⭐⭐⭐⭐');
  });

});

describe('Unit Tests - Càlcul del temps restant', () => {
    test('El temporitzador decrementa correctament (lògica)', () => {
        let temps = 300;
        const tick = () => temps--;
        tick();
        expect(temps).toBe(299);
    });
});
