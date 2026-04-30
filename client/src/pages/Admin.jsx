import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import GlassCard from '../components/GlassCard';
import { Power, Terminal, Plus, Trash2, Database, Activity, RefreshCw, ShoppingBag, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('nodes'); // 'nodes' or 'plans'
  const [data, setData] = useState({ domains: [], plans: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const endpoint = activeTab === 'nodes' ? '/api/domains' : '/api/plans';
      const payload = activeTab === 'nodes' ? { domains: data.domains } : { plans: data.plans };
      
      await axios.post(`${API_URL}${endpoint}`, payload);
      setMessage(`${activeTab === 'nodes' ? 'INFRAESTRUCTURA' : 'PLANES'} SINCRONIZADOS`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('ERROR DE SINCRONIZACIÓN');
    }
  };

  // Domain handlers
  const handleDomainChange = (id, field, value) => {
    setData({
      ...data,
      domains: data.domains.map(d => d.id === id ? { ...d, [field]: value } : d)
    });
  };

  const addDomain = () => {
    const newId = data.domains.length > 0 ? Math.max(...data.domains.map(d => d.id)) + 1 : 1;
    setData({
      ...data,
      domains: [...data.domains, { 
        id: newId, url: 'nodo-x.tommycdn.cloud', status: 'ACTIVO', type: 'backup', provider: 'AWS CloudFront', description: 'Nodo de borde secundario' 
      }]
    });
  };

  // Plan handlers
  const handlePlanChange = (id, field, value) => {
    setData({
      ...data,
      plans: data.plans.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const handleFeatureChange = (planId, index, value) => {
    setData({
      ...data,
      plans: data.plans.map(p => {
        if (p.id === planId) {
          const newFeatures = [...p.features];
          newFeatures[index] = value;
          return { ...p, features: newFeatures };
        }
        return p;
      })
    });
  };

  const addFeature = (planId) => {
    setData({
      ...data,
      plans: data.plans.map(p => p.id === planId ? { ...p, features: [...p.features, 'Nueva característica'] } : p)
    });
  };

  const addPlan = () => {
    const newId = data.plans.length > 0 ? Math.max(...data.plans.map(p => p.id)) + 1 : 1;
    setData({
      ...data,
      plans: [...data.plans, { 
        id: newId, name: 'Nuevo Plan', price: '10', currency: 'USD', features: ['Característica 1'], recommended: false 
      }]
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Terminal size={40} className="text-accent animate-pulse" />
      <span className="text-[10px] font-bold tracking-[0.5em] text-accent">ESTABLECIENDO CONEXIÓN SEGURA</span>
    </div>
  );

  return (
    <div className="relative pt-40 pb-24 px-6 max-w-4xl mx-auto z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-secondary">
            <Terminal size={20} />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Centro de Control</span>
          </div>
          <h1 className="text-4xl font-black text-white">TommyCDN <span className="text-accent">OS</span></h1>
        </div>
        
        <button 
          onClick={handleUpdate}
          className="group relative flex items-center space-x-3 bg-white/5 border border-white/10 hover:border-accent/50 px-8 py-4 rounded-2xl transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <RefreshCw size={20} className="relative text-accent group-hover:rotate-180 transition-transform duration-700" />
          <span className="relative text-white font-bold tracking-widest text-xs">SINCRONIZAR CAMBIOS</span>
        </button>
      </header>

      {/* Admin Sub-Tabs */}
      <div className="flex space-x-4 mb-8">
        {[
          { id: 'nodes', label: 'Nodos CDN', icon: <Database size={16} /> },
          { id: 'plans', label: 'Planes de Venta', icon: <ShoppingBag size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-accent text-dark' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded-2xl text-accent text-center text-xs font-black tracking-[0.3em]"
        >
          {message}
        </motion.div>
      )}

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'nodes' ? (
            <motion.div
              key="nodes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {data.domains.map((domain) => (
                <GlassCard key={domain.id} className="p-8 border-white/5 bg-white/[0.01]" hover={false}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Endpoint del Nodo</label>
                        <input 
                          type="text" 
                          value={domain.url}
                          onChange={(e) => handleDomainChange(domain.id, 'url', e.target.value)}
                          className="w-full bg-dark/50 border border-white/10 rounded-xl px-5 py-3 text-white font-mono text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rol del Sistema</label>
                        <div className="flex gap-2">
                          {['principal', 'backup'].map((role) => (
                            <button
                              key={role}
                              onClick={() => handleDomainChange(domain.id, 'type', role)}
                              className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${domain.type === role ? 'bg-secondary text-dark' : 'bg-white/5 text-gray-500'}`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Estado</label>
                        <div className="flex gap-2">
                          {['ACTIVO', 'BACKUP'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleDomainChange(domain.id, 'status', status)}
                              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${domain.status === status ? (status === 'ACTIVO' ? 'bg-accent text-dark' : 'bg-amber-500 text-dark') : 'bg-white/5 text-gray-500'}`}
                            >
                              <Power size={12} />
                              <span>{status}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setData({...data, domains: data.domains.filter(d => d.id !== domain.id)})} className="mt-6 text-red-500/50 hover:text-red-500 text-[10px] font-bold uppercase">Eliminar Nodo</button>
                </GlassCard>
              ))}
              <button onClick={addDomain} className="w-full border-2 border-dashed border-white/5 rounded-3xl p-8 text-gray-600 hover:text-accent hover:bg-accent/5 transition-all text-xs font-bold uppercase">Provisionar Nuevo Nodo</button>
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {data.plans.map((plan) => (
                <GlassCard key={plan.id} className="p-8 border-white/5 bg-white/[0.01]" hover={false}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Nombre del Plan</label>
                        <input 
                          type="text" 
                          value={plan.name}
                          onChange={(e) => handlePlanChange(plan.id, 'name', e.target.value)}
                          className="w-full bg-dark/50 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Precio</label>
                          <input 
                            type="text" 
                            value={plan.price}
                            onChange={(e) => handlePlanChange(plan.id, 'price', e.target.value)}
                            className="w-full bg-dark/50 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Moneda</label>
                          <input 
                            type="text" 
                            value={plan.currency}
                            onChange={(e) => handlePlanChange(plan.id, 'currency', e.target.value)}
                            className="w-full bg-dark/50 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Características</label>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex space-x-2">
                          <input 
                            type="text" 
                            value={feature}
                            onChange={(e) => handleFeatureChange(plan.id, idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-gray-300"
                          />
                          <button onClick={() => {
                            const newFeatures = plan.features.filter((_, i) => i !== idx);
                            handlePlanChange(plan.id, 'features', newFeatures);
                          }} className="text-red-500/50 hover:text-red-500 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addFeature(plan.id)} className="text-[10px] text-accent font-bold uppercase flex items-center space-x-1">
                        <Plus size={12} />
                        <span>Añadir Característica</span>
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setData({...data, plans: data.plans.filter(p => p.id !== plan.id)})} className="mt-6 text-red-500/50 hover:text-red-500 text-[10px] font-bold uppercase">Eliminar Plan</button>
                </GlassCard>
              ))}
              <button onClick={addPlan} className="w-full border-2 border-dashed border-white/5 rounded-3xl p-8 text-gray-600 hover:text-accent hover:bg-accent/5 transition-all text-xs font-bold uppercase">Crear Nuevo Plan de Venta</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
