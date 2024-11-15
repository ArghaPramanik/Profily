
'use client'

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './component/Layout'
import ProfileList from './component/ProfileList'
import ProfileDetails from './component/ProfileDetails'
import AdminDashboard from './component/AdminDashboard'
import { initialProfiles } from './data/initialProfiles'

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [profiles, setProfiles] = useState(initialProfiles);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <Routes>
          <Route path="/" element={<ProfileList darkMode={darkMode} profiles={profiles} />} />
          <Route path="/profile/:id" element={<ProfileDetails darkMode={darkMode} profiles={profiles} />} />
          <Route path="/admin" element={<AdminDashboard darkMode={darkMode} profiles={profiles} setProfiles={setProfiles} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
