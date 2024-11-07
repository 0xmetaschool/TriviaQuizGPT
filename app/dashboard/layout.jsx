import React from 'react'
import Header from './_components/Header'

// DashboardLayout component that wraps the main content with a Header
function DashboardLayout({children}) {
  return (
    <div>
        <Header/>
        {children}
    </ div>
  )
}

export default DashboardLayout