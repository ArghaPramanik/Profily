import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";

function Layout({ children, darkMode, setDarkMode }) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[linear-gradient(112.1deg,rgb(32,38,57)_11.4%,rgb(63,76,119)_70.2%)]' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} transition-colors duration-300`}>
      <nav className={`${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-80'} backdrop-blur-md shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center text-2xl font-bold text-purple-600 dark:text-purple-400">
                <MapPin className="mr-2" aria-hidden="true" /> 
                <span>BynryHub</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-bold transition-colors duration-200">
                Admin Dashboard
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-700 dark:text-gray-300"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;