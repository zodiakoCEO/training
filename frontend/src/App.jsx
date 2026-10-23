import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import WelcomeSplash from './components/WelcomeSplash.jsx';
import './styles.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowWelcome(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (showWelcome) {
    return <WelcomeSplash />;
  }

  return <Dashboard />;
}

export default App;
