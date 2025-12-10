/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const root = document.getElementById('root');

render(() => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
), root);
