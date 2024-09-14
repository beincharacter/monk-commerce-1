import { useState } from 'react'
import './App.css'
import { HomePage } from './Pages/HomePage'
import { ModalProvider } from './utils/ModalContext'
import { ProductProvider } from './utils/ProductContext'

function App() {

  return (
    <>
    <ProductProvider>
      <ModalProvider>
        <div className="flex justify-center items-center w-screen h-screen p-4">
          <HomePage />
        </div>
      </ModalProvider>
    </ProductProvider>
    </>
  )
}

export default App
