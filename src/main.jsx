import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { constants } from './data/constants.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InsertQuestionsHelper from './screens/InsertQuestionsHelper.jsx';

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

// Set language code in localStorage
localStorage.setItem('languageCode', selectedLanguage);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
