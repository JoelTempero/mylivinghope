import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
