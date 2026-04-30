import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon, ShoppingCart, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navItems = [
    { name: t('navbar.home'), path: '/', icon: <Hexagon size={18} /> },
    { name: t('navbar.shop'), path: '/buy', icon: <ShoppingCart size={18} /> },
    { name: t('navbar.status'), path: '/status', icon: <Activity size={18} /> },
  ];

  const languages = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'pt', label: 'PT', flag: '🇧🇷' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
      <div 
        style={{
          backgroundColor: 'rgba(15, 15, 15, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
        className="max-w-7xl mx-auto flex items-center justify-between px-8 h-20 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-dark transform group-hover:rotate-180 transition-transform duration-500">
            <Hexagon size={20} fill="currentColor" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter">TommyCDN</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'text-accent' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl -z-10"
                />
              )}
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="hidden md:flex items-center ml-4 border-l border-white/10 pl-4 space-x-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                i18n.language === lang.code 
                  ? 'bg-accent text-dark' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-accent"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            style={{
              backgroundColor: 'rgba(15, 15, 15, 0.8)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            className="md:hidden mt-4 p-4 rounded-[2rem] space-y-2 overflow-hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest ${
                  location.pathname === item.path 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center pt-4 border-t border-white/5 space-x-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    i18n.language === lang.code 
                      ? 'text-accent' 
                      : 'text-gray-500'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
