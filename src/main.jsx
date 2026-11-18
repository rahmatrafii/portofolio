import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioRouter from './components/PortfolioRouter.jsx';
import 'lenis/dist/lenis.css';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioRouter />
  </StrictMode>,
);
