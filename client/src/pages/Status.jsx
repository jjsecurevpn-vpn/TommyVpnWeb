import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import GlassCard from '../components/GlassCard';
import { CheckCircle, Clock, Server, Activity, Zap, Shield, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Status = () => {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/data`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark p-6 text-center">
      <div className="text-red-500 mb-4 font-black tracking-widest text-xs uppercase">{t('common.error')}</div>
      <p className="text-gray-500 text-sm max-w-xs">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest">{t('common.retry')}</button>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center h-screen bg-dark">
      <div className="w-12 h-12 rounded-full border-t-2 border-accent animate-spin"></div>
    </div>
  );

  const activeDomain = data.domains.find(d => d.type === 'principal');

  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto space-y-12 relative">
      {/* Glow effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full h-64 bg-accent/5 blur-[120px] -z-10"></div>

      <header className="space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full glass border-accent/20 text-accent text-[10px] font-bold tracking-[0.3em] uppercase">
          <Activity size={12} className="animate-pulse" />
          <span>{t('hero.active_infra')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Estado de la <span className="text-accent">Red Nexus</span></h1>
        <p className="text-gray-400 max-w-md mx-auto">Monitoreo en tiempo real de nodos globales y latencia de borde.</p>
      </header>

      <GlassCard className="glow-cyan border-accent/20 bg-accent/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 space-y-8 md:space-y-0 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse rounded-full"></div>
              <div className="relative p-4 sm:p-6 bg-accent/10 rounded-2xl sm:rounded-[2rem] border border-accent/20 text-accent">
                <Server size={32} className="sm:w-12 sm:h-12" />
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('hero.main_node')}</div>
              <div className="flex flex-col md:flex-row items-center md:space-x-3 space-y-2 md:space-y-0">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-mono font-bold text-white tracking-tighter break-all">
                  {activeDomain ? activeDomain.url : 'SIN NODO ACTIVO'}
                </h2>
                <button 
                  onClick={() => copyToClipboard(activeDomain?.url)}
                  className="p-2 glass rounded-xl text-gray-400 hover:text-accent hover:border-accent/30 transition-all group"
                  title="Copiar Dominio"
                >
                  {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} className="group-hover:scale-110 transition-transform" />}
                </button>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${activeDomain ? 'bg-emerald animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                <span className={`${activeDomain ? 'text-emerald' : 'text-red-500'} font-bold tracking-widest uppercase text-[10px]`}>
                  {activeDomain ? t('hero.operational') : t('hero.disconnected')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-mono">
              <Clock size={14} />
              <span>Sincronizado: {new Date(data.status.lastCheck).toLocaleTimeString()}</span>
            </div>
            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Proveedor: {data.status.provider}</div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('stats.uptime'), value: '99.9%', icon: <Activity size={18} /> },
          { label: t('stats.latency'), value: '1.2ms', icon: <Zap size={18} /> },
          { label: t('stats.redundancy'), value: 'Nivel 3', icon: <Shield size={18} /> }
        ].map((stat, i) => (
          <GlassCard key={i} className="text-center p-8 space-y-2 border-white/5" hover={true}>
            <div className="mx-auto w-10 h-10 flex items-center justify-center glass rounded-xl text-accent mb-2">
              {stat.icon}
            </div>
            <div className="text-white text-3xl font-black">{stat.value}</div>
            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Status;
