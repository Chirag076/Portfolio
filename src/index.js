import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><PortfolioProvider><App /></PortfolioProvider></BrowserRouter>);
