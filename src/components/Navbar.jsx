import React from 'react';
import { NavLink } from 'react-router-dom';
import { Gavel } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gavel size={22} color="var(--accent-primary)" />
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            LabourLawGPT
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.95rem'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/chat"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.95rem'
            })}
          >
            Chatbot
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
