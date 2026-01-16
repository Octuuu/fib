import React, { useEffect, useState } from 'react';
import fondoImg from '../../assets/fondo.webp';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [vh, setVh] = useState('100vh');

  useEffect(() => {
    // Función para calcular el vh real considerando las barras del navegador
    const setRealVh = () => {
      // Primero intentamos con window.innerHeight que es más preciso
      const realVh = window.innerHeight * 0.91;
      setVh(`${realVh}px`);
    };

    // Ejecutar al montar
    setRealVh();

    // Recalcular en eventos de redimensionamiento
    window.addEventListener('resize', setRealVh);
    window.addEventListener('orientationchange', setRealVh);

    return () => {
      window.removeEventListener('resize', setRealVh);
      window.removeEventListener('orientationchange', setRealVh);
    };
  }, []);

  return (
    <section 
      className="relative text-white flex items-end"
      style={{
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: vh,
        minHeight: vh,
      }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-1/4 sm:h-1/3"
        style={{
          background: 'linear-gradient(to bottom, rgba(249, 131, 1, 0.9) 0%, rgba(249, 131, 1, 0.4) 70%, transparent 100%)'
        }}
      />
      
      <div className="relative z-10 w-full pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-3xl">
          <motion.h1 
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="block whitespace-nowrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              LA CAPITAL DEL BASQUETBOL
            </motion.div>
            <motion.div
              className="block whitespace-nowrap mt-1 sm:mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              MISIONERO
            </motion.div>
          </motion.h1>
        </div>
      </div>
      
      <div 
        className="absolute bottom-0 left-0 w-full h-1/4 sm:h-1/3"
        style={{
          background: 'linear-gradient(to top, rgba(249, 131, 1, 0.9) 0%, rgba(249, 131, 1, 0.4) 70%, transparent 100%)'
        }}
      />
    </section>
  );
};

export default HeroSection;