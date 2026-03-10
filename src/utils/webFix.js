// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import { Platform } from 'react-native';

export function applyWebFix() {
  if (Platform.OS !== 'web') return;

  const style = document.createElement('style');
  style.innerHTML = `
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    #root {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /* Propagar altura por los wrappers de React Navigation */
    #root > div,
    #root > div > div,
    #root > div > div > div,
    #root > div > div > div > div,
    #root > div > div > div > div > div {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    /* ScrollView de RN en web: div con overflow:scroll inline */
    div[style*="overflow: scroll"],
    div[style*="overflow:scroll"] {
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch;
      flex: 1;
      min-height: 0;
    }
    * { box-sizing: border-box; }
  `;
  document.head.appendChild(style);
}
