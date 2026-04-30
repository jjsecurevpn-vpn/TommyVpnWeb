import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import GlassCard from '../components/GlassCard';
import { Shield, Zap, Copy, ExternalLink, Activity, Cpu, Globe, Server, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-full border-t-2 border-accent"
      ></motion.div>
    </div>
  );

  const activeDomain = data.domains.find(d => d.type === 'principal');
  const backupDomains = data.domains.filter(d => d.type !== 'principal');

  return (
    <div className="relative pt-32 pb-24 px-6 max-w-5xl mx-auto z-10 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 neo-blur rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-secondary/5 neo-blur rounded-full -z-10 animate-pulse delay-1000"></div>

      {/* Hero Section */}
      <header className="mb-12 space-y-4 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass border-accent/20 text-accent text-[10px] font-bold tracking-[0.3em] uppercase"
        >
          <Activity size={12} className="animate-pulse" />
          <span>{t('hero.active_infra')}</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white leading-tight"
        >
          Tommy <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">{t('hero.cloudfront')}</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Connection Core (Styled like Status Page) */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="glow-cyan border-accent/20 bg-accent/5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 space-y-8 md:space-y-0 relative z-10 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse rounded-full"></div>
                  <div className="relative p-5 sm:p-8 bg-accent/10 rounded-[2rem] border border-accent/20 text-accent">
                    <Server size={40} className="sm:w-16 sm:h-16" />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('hero.main_node')}</div>
                  <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-3 md:space-y-0">
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-mono font-bold text-white tracking-tighter break-all">
                      {activeDomain?.url || 'Tommy CDN'}
                    </h2>
                    <button 
                      onClick={() => copyToClipboard(activeDomain?.url, 'active')}
                      className="p-3 glass rounded-2xl text-accent hover:bg-accent/10 transition-all group shrink-0"
                    >
                      {copiedId === 'active' ? <Check size={20} className="text-emerald" /> : <Copy size={20} className="group-hover:scale-110 transition-transform" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <div className="w-2 h-2 bg-emerald rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-emerald font-bold tracking-widest uppercase text-[10px]">{t('hero.operational')}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Infrastructure Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: t('stats.latency'), value: '1.2ms', icon: <Zap className="text-accent" /> },
              { label: t('stats.stability'), value: '100%', icon: <Shield className="text-emerald" /> },
              { label: t('stats.nodes'), value: '24/24', icon: <Globe className="text-secondary" /> }
            ].map((stat, i) => (
              <GlassCard key={i} className="py-6 px-6 flex items-center space-x-4 border-white/5" hover={true}>
                <div className="p-3 glass rounded-xl">{stat.icon}</div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Secondary Nodes Orbital Menu */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-gray-400 tracking-[0.4em] uppercase px-2">{t('hero.secondary_nodes')}</h3>
          <div className="space-y-4">
            {data.domains.filter(d => d.type === 'backup').length > 0 ? (
              data.domains.filter(d => d.type === 'backup').map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-secondary transition-colors">
                      <Server size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{domain.url}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{domain.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-dark/40 px-3 py-1.5 rounded-lg border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full ${domain.status === 'ACTIVO' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      <span className={`text-[10px] font-black tracking-widest ${domain.status === 'ACTIVO' ? 'text-emerald-500' : 'text-amber-500'}`}>{domain.status}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(domain.url, domain.id)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
                    >
                      {copiedId === domain.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                <Globe size={32} className="mx-auto text-white/5 mb-3" />
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{t('common.no_secondary')}</p>
              </div>
            )}
          </div>
          
          <GlassCard className="bg-secondary/5 border-secondary/20 p-6">
            <p className="text-gray-400 text-[10px] leading-relaxed italic">
              "Redundancia inteligente: Los nodos de backup se activan de forma automática para garantizar disponibilidad total."
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
