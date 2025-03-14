import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { constants } from './data/constants.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InsertQuestionsHelper from './screens/insertQuestionsHelper/InsertQuestionsHelper.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/insert-questions-helper-81n271bf1023ut',
    element: <InsertQuestionsHelper />
  }
])

// Get language code from localStorage or query param
const languageCode = localStorage.getItem('languageCode');
const languageCodeFromQueryParam = new URLSearchParams(window.location.search).get('lc');
const validLangaugeCodeFromQueryParam = constants.languages.includes(languageCodeFromQueryParam) ? languageCodeFromQueryParam : null;
const selectedLanguage = languageCode || validLangaugeCodeFromQueryParam || 'en';

// Get local ID from localStorage or generate a new one
const localId = localStorage.getItem('localId');
if (!localId) {
  localStorage.setItem('localId', Math.random().toString(36).substring(2, 15));
}

// Set language code in localStorage
localStorage.setItem('languageCode', selectedLanguage);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
