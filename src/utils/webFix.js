import { Platform } from 'react-native';

export function applyWebFix() {
  if (Platform.OS !== 'web') return;
  
  const style = document.createElement('style');
  style.innerHTML = `
    html, body, #root {
      height: 100%;
      overflow: hidden;
    }
    body > div {
      height: 100%;
    }
  `;
  document.head.appendChild(style);
}