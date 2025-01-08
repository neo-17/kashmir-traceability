// // Enhanced Location Section with Map
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// const LocationSection = () => {
//     const kashmirLocation = [34.083656, 74.797371];
  
//     return (
//       <div className="relative py-24 bg-black/5 backdrop-blur-md">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-600">
//               From Kashmir's Saffron Fields
//             </h2>
//             <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10 h-[400px]">
//               <MapContainer 
//                 center={kashmirLocation} 
//                 zoom={13} 
//                 className="w-full h-full"
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <Marker position={kashmirLocation}>
//                   <Popup>
//                     Pampore Saffron Fields
//                   </Popup>
//                 </Marker>
//               </MapContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default LocationSection;

import React from 'react'

const LocationSection = () => {
  return (
    <div>LocationSection</div>
  )
}

export default LocationSection