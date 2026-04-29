import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import GlassCard from '../components/GlassCard';
import { CheckCircle, ShoppingCart, ShieldCheck, Zap, Globe, MessageCircle, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Buy = () => {
  const [plans, setPlans] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/data`);
        setPlans(response.data.plans || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const features = [
    { title: 'CDN Amazon AWS', desc: 'Red real de AWS con nodos globales.', icon: <Globe size={24} className="text-accent" /> },
    { title: 'Dominio propio', desc: 'Tu dominio configurado y apuntando.', icon: <Zap size={24} className="text-accent" /> },
    { title: 'SSL / HTTPS Gratis', desc: 'Certificado automático incluido.', icon: <ShieldCheck size={24} className="text-accent" /> },
    { title: 'Activación Instantánea', desc: 'Confirmado el pago, se activa en minutos.', icon: <CheckCircle size={24} className="text-accent" /> }
  ];

  const faqs = [
    { q: '¿Qué es un dominio CDN AWS?', a: 'Es un dominio propio con distribución de contenido en la red de Amazon Web Services. Permite servir tu contenido desde servidores cercanos al usuario final, con alta velocidad y disponibilidad.' },
    { q: '¿Cuánto tarda la activación?', a: 'En la mayoría de los casos el servicio se activa en menos de 15 minutos después de confirmar el pago. Nuestro bot gestiona el proceso automáticamente.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos exclusivamente Binance Pay (USDT). Es el método más rápido y seguro para procesar activaciones internacionales instantáneas.' },
    { q: '¿El pago es único o hay mensualidades?', a: 'Es un pago único de $20 USD. No hay suscripciones ni cargos recurrentes ocultos. Pagás una vez y el servicio queda activo.' },
    { q: '¿Qué pasa si el dominio principal cae?', a: 'Tenemos dominios de backup listos para activar. En la sección de dominios de la página podés ver el estado actual y copiar el alternativo. También podés contactarnos por Telegram o WhatsApp.' },
    { q: '¿Tienen soporte si tengo algún problema?', a: 'Sí, ofrecemos soporte 24/7 por Telegram y WhatsApp. Respondemos consultas técnicas y de activación en el menor tiempo posible.' }
  ];

  const paymentMethods = [
    { name: 'Binance / USDT (Pay)', color: 'bg-amber-500/20 text-amber-400' }
  ];

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark p-6 text-center">
      <div className="text-red-500 mb-4 font-black tracking-widest text-xs uppercase">Error de Conexión</div>
      <p className="text-gray-500 text-sm max-w-xs">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest">Reintentar</button>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-dark">
      <div className="w-12 h-12 rounded-full border-t-2 border-accent animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h2 className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase">Planes Disponibles</h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
          Infraestructura <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Sin Mensualidades</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">Activación inmediata tras el pago único. Soporte humano real 24/7.</p>
      </section>

      {/* Plans Section */}
      <div className="flex flex-wrap justify-center gap-8">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <GlassCard key={plan.id} className={`relative flex flex-col justify-between p-10 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm ${plan.recommended ? 'glow-cyan border-accent/30' : 'border-white/5'}`}>
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-dark px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                  Recomendado
                </div>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-accent">{plan.price}</span>
                    <span className="text-gray-500 font-bold text-xs uppercase">{plan.currency}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-sm text-gray-300">
                      <CheckCircle size={16} className="text-accent shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href="https://t.me/DOMINIOFRONT_BOT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-10 w-full bg-accent hover:bg-emerald-400 text-dark font-black py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center space-x-3 group"
              >
                <ShoppingCart size={20} className="group-hover:-translate-y-1 transition-transform" />
                <span>COMPRAR AHORA</span>
              </a>
            </GlassCard>
          ))
        ) : (
          <div className="w-full text-center py-20">
            <ShoppingCart size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">No hay planes disponibles en este momento</p>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-secondary text-[10px] font-bold tracking-[0.4em] uppercase">Beneficios</h2>
          <h3 className="text-3xl font-black text-white">Todo incluido en un solo pago</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <GlassCard key={i} className="text-center p-8 space-y-4 border-white/5" hover={true}>
              <div className="mx-auto w-12 h-12 flex items-center justify-center glass rounded-2xl mb-4">
                {f.icon}
              </div>
              <h4 className="text-white font-bold">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase">FAQ</h2>
          <h3 className="text-3xl font-black text-white">Preguntas frecuentes</h3>
          <p className="text-gray-500 text-sm">Todo lo que necesitás saber antes de comprar</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <GlassCard 
              key={i} 
              className={`p-0 border-white/5 overflow-hidden cursor-pointer transition-all duration-300 ${openFaq === i ? 'bg-white/[0.05] border-accent/20' : 'hover:bg-white/[0.02] hover:border-white/10'}`}
              hover={false}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="w-full flex items-center justify-between p-6 text-left">
                <span className={`font-bold text-sm pr-8 transition-colors ${openFaq === i ? 'text-accent' : 'text-white'}`}>
                  {faq.q}
                </span>
                <div className={`${openFaq === i ? 'text-accent' : 'text-gray-500'} shrink-0 transition-colors`}>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-secondary text-[10px] font-bold tracking-[0.4em] uppercase">Pagos</h2>
          <h3 className="text-3xl font-black text-white">Métodos disponibles</h3>
          <p className="text-gray-500 text-sm">Elegí el que más te convenga, todos son seguros</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {paymentMethods.map((m, i) => (
            <div key={i} className={`px-6 py-3 rounded-xl font-bold text-xs border border-white/5 ${m.color}`}>
              {m.name}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-12 bg-gradient-to-b from-accent/5 to-transparent p-12 rounded-[3rem] border border-accent/10">
        <div className="space-y-6">
          <h3 className="text-4xl font-black text-white leading-tight">¿Listo para empezar?</h3>
          <p className="text-gray-400 max-w-md mx-auto">Abrí el bot, pagá $20 USD y recibí tu CDN en minutos</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a 
            href="https://t.me/DOMINIOFRONT_BOT" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-accent text-dark font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-accent/20 hover:scale-105"
          >
            <MessageCircle size={24} />
            <span>Acceder al Bot</span>
          </a>
          <a 
            href="https://wa.me/5493854473812" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white/5 border border-white/10 text-emerald font-bold px-10 py-5 rounded-2xl transition-all hover:bg-emerald/5 hover:border-emerald/20"
          >
            <MessageCircle size={24} />
            <span>Soporte WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Buy;
