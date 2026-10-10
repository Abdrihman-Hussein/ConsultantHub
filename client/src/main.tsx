import { ClerkProvider } from '@clerk/react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { AppProvider } from './context/AppContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { clerkAppearance } from './lib/clerkAppearance'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* ClerkProvider sits inside <body> (it is mounted here, not around the
          root element) and outside the router so route changes keep the session.
          LanguageProvider is above the router too: the language is a property of
          the document, not of a route, and a switch must not unmount the
          session or lose scroll position.

          The appearance is set here rather than on each component so every
          Clerk surface — the sign-in and sign-up forms, the navbar's user
          button, and anything added later — inherits the same palette. The
          forms override it locally with the two things that are specific to
          being embedded in a card. */}
      <ClerkProvider afterSignOutUrl="/" appearance={clerkAppearance}>
        <LanguageProvider>
          <BrowserRouter>
            <AppProvider>
              <App />
            </AppProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)