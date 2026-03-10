// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import AppNavigator from '../src/navigation/AppNavigator';
import { applyWebFix } from '../src/utils/webFix';
applyWebFix();

export default function App() {
  return <AppNavigator />;
}