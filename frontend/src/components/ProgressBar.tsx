// // Progress bar component
// const ProgressBar = ({ currentScreen, screens }) => {
//   const screenOrder = Object.values(screens);
//   const progress = ((screenOrder.indexOf(currentScreen) + 1) / screenOrder.length) * 100;
  
//   return (
//     <div className="fixed top-0 left-0 w-full z-50">
//       <div className="h-1 bg-white/20 backdrop-blur-sm">
//         <div 
//           className="h-full bg-white transition-all duration-500 ease-out"
//           style={{ width: `${progress}%` }}
//         />
//       </div>
//       <div className="flex justify-center mt-2">
//         {screenOrder.map((screen, index) => (
//           <div 
//             key={screen}
//             className={`
//               w-2 h-2 rounded-full mx-1 transition-all duration-300
//               ${index <= screenOrder.indexOf(currentScreen) ? 'bg-white' : 'bg-white/20'}
//             `}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProgressBar;

// Version 2

const ProgressBar = ({ currentScreen, screens }) => {
    const screenOrder = Object.values(screens);
    const progress = ((screenOrder.indexOf(currentScreen) + 1) / screenOrder.length) * 100;
    
    return (
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 bg-white/20 backdrop-blur-sm">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center mt-2">
          {screenOrder.map((screen, index) => (
            <div 
              key={screen}
              className={`
                w-2 h-2 rounded-full mx-1 transition-all duration-300
                ${index <= screenOrder.indexOf(currentScreen) ? 'bg-white' : 'bg-white/20'}
              `}
            />
          ))}
        </div>
      </div>
    );
  };

  export default ProgressBar;