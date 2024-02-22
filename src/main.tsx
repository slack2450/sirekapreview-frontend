import React from 'react'
import ReactDOM from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from "i18next-browser-languagedetector"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from './App.tsx'

import axios from 'axios'

// Translations
import translationEN from './translations/en.json'
import translationID from './translations/id.json'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactGA from 'react-ga4';

const theme = createTheme({});

axios.defaults.baseURL = 'https://sirekapreview.rakagunarto.com/';

i18n
.use(initReactI18next)
.use(LanguageDetector)
.init({
  resources: {
    en: {
      translation: translationEN,
    },
    id: {
      translation: translationID,
    },
  },
  fallbackLng: 'id',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

ReactGA.initialize('G-22K3NQG4CL')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <App />
      </ThemeProvider>
  </React.StrictMode>,
)
