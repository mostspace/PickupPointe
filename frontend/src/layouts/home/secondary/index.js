import React from 'react'
import Header from './header'
import Footer from './footer'
import FloatingActionButtons from 'src/components/floating-action-button'

export default function SecondaryLayout({ children }) {

  return (
    <div>
      <Header />
      {children}
      <Footer />
      <FloatingActionButtons />
    </div>
  )
}

