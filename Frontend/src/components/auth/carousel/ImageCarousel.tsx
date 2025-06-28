import { useState, useEffect, useCallback } from 'react';
import { CarouselImage } from './CarouselImage';
import { CarouselIndicator } from './CarouselIndicator';
import { motion } from 'framer-motion';

const images = [
  {
    src: "/Images/Brand Image 01.webp",
    alt: "Brand Image 1"
  },
  {
    src: "/Images/Brand Image 02.webp",
    alt: "Brand Image 2"
  },
  {
    src: "/Images/Brand Image 03.webp",
    alt: "Brand Image 3"
  }
];

const TRANSITION_DURATION = 1000;
const DISPLAY_DURATION = 3000;

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionToNext = useCallback((nextIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(nextIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, []);

  useEffect(() => {
    if (isTransitioning) return;

    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      transitionToNext(nextIndex);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, transitionToNext]);

  const handleIndicatorClick = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    transitionToNext(index);
  };

  return (
    <motion.div 
      className="relative w-[903px] h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {images.map((image, index) => (
        <CarouselImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          isActive={index === currentIndex}
          isTransitioning={isTransitioning}
        />
      ))}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        {images.map((_, index) => (
          <CarouselIndicator
            key={index}
            isActive={index === currentIndex}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </div>
    </motion.div>
  );
}
