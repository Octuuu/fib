import React from 'react';
import fondoImg from '../../assets/fondo.png';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section 
      className="relative text-white min-h-[91vh] flex items-end"
      style={{
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
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