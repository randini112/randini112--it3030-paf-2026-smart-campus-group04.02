import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import TicketForm from './TicketForm';
import TicketList from './TicketList';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <div className="App" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}>
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<TicketForm />} />
            <Route path="/tickets" element={<TicketList />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;