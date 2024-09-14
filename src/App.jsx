import { useState } from 'react'
import './App.css'
import { HomePage } from './Pages/HomePage'
import { ModalProvider } from './utils/ModalContext'

function App() {
  const [products, setProducts] = useState([])

  return (
    <>
    <ModalProvider>
      <div className="flex justify-center items-center w-screen h-screen p-4">
        <HomePage />
      </div>
    </ModalProvider>
    </>
  )
}

export default App
