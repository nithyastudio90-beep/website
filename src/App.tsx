import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudioProvider } from './context/StudioContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WeddingPhotographyPage } from './pages/WeddingPhotographyPage';
import { WeddingVideographyPage } from './pages/WeddingVideographyPage';
import { PreWeddingPhotographyPage } from './pages/PreWeddingPhotographyPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper that conditionally renders Header, Footer, and Floating WhatsApp
function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminDashboard = location.pathname === '/admin/dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-studio-black text-studio-light">
      <ScrollToTop />

      {/* Main Header (Shown on public pages and admin login) */}
      {!isAdminDashboard && (
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
      )}

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/wedding-photography" element={<WeddingPhotographyPage />} />
          <Route path="/wedding-videography" element={<WeddingVideographyPage />} />
          <Route path="/pre-wedding-photography" element={<PreWeddingPhotographyPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Floating WhatsApp button on public pages */}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* Footer on public pages and admin login */}
      {!isAdminDashboard && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <StudioProvider>
        <Router>
          <AppLayout />
        </Router>
      </StudioProvider>
    </AuthProvider>
  );
}

export default App;
