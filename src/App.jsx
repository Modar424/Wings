import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServesSection from "./components/ServesSection";
import TopDestination from "./components/TopDestination";
import WingsAi from './pages/WingsAi';
import Destination from './pages/Destination';
import Booking from './pages/Booking';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer'
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BehindWings from './components/BehindWings';

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
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wingsai" element={<WingsAi />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path='/blog' element={<Blog/>} />
        </Routes>
      </Layout>
    </Router>
  );
}