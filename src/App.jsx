import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import Layout from "./components/Layout";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServesSection from "./components/ServesSection";
import TopDestination from "./components/TopDestination";
import WingsAi from "./pages/WingsAi";
import Destination from "./pages/Destination";
import Booking from "./pages/Booking";
import ContactUs from "./components/ContactUs";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BehindWings from "./components/BehindWings";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./Hooks/useAuth";


import Footer from "./components/Footer";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Home() {
  return (
    <>
      <div id="home">
        <Header />
        <HeroSection />
      </div>
      <div id="behind wings">
        <BehindWings />
      </div>
      <div id="service">
        <ServesSection />
      </div>
      <div id="top destination">
        <TopDestination />
      </div>
      <div id="contact">
        <ContactUs />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wingsai" element={<WingsAi />} />
              <Route
                path="/destination"
                element={
                  <ProtectedRoute>
                    <Destination />
                  </ProtectedRoute>
                }
              />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />

              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
