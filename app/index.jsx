import AppNavigator from '../src/navigation/AppNavigator';
import { applyWebFix } from '../src/utils/webFix';
applyWebFix();

export default function App() {
  return <AppNavigator />;
}