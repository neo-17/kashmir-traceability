import React from 'react';

const AnimatedBackground = () => {
  // Function to generate random initial positions and delays
  const generateElements = (count, options = {}) => {
    const {
      baseSize = 16,
      opacityRange = [0.2, 0.4],
      speedMultiplier = 1
    } = options;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: baseSize + Math.random() * (baseSize / 2),
      rotation: Math.random() * 360,
      delay: -(Math.random() * 20),
      opacity: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
      duration: (15 + Math.random() * 10) / speedMultiplier
    }));
  };

  const layers = [
    // Back layer - small elements
    {
      elements: generateElements(30, {
        baseSize: 8,
        opacityRange: [0.1, 0.2],
        speedMultiplier: 0.7
      }),
      className: 'animate-drift-slow'
    },
    // Middle layer - medium elements
    {
      elements: generateElements(20, {
        baseSize: 12,
        opacityRange: [0.2, 0.3],
        speedMultiplier: 1
      }),
      className: 'animate-drift'
    },
    // Front layer - large elements
    {
      elements: generateElements(15, {
        baseSize: 16,
        opacityRange: [0.3, 0.4],
        speedMultiplier: 1.3
      }),
      className: 'animate-drift-fast'
    }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {layers.map((layer, layerIndex) => (
        <div key={layerIndex} className="absolute inset-0">
          {layer.elements.map((element) => (
            <div
              key={element.id}
              className={`absolute ${layer.className}`}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.delay}s`,
                opacity: element.opacity,
              }}
            >
              <div
                className="relative"
                style={{
                  width: element.size,
                  height: element.size * 3,
                }}
              >
                {/* Saffron strand shape */}
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-orange-400 to-purple-500 blur-[2px]"
                  style={{
                    transform: `rotate(${element.rotation}deg)`,
                  }}
                />
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-full bg-white/20 blur-md"
                  style={{
                    transform: `rotate(${element.rotation}deg) scale(1.2)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;