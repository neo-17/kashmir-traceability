/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const QRScannerModal = ({ isOpen, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5173"; // Base URL for development

  useEffect(() => {
    let scanner = null;

    if (isOpen && !scanning) {
      setScanning(true);
      scanner = new Html5Qrcode("qr-reader");

      const qrConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      scanner
        .start(
          { facingMode: "environment" },
          qrConfig,
          handleQRCodeSuccess,
          handleQRCodeError
        )
        .catch((err) => {
          console.error("Error starting scanner:", err);
          setScanning(false);
        });
    }

    return () => {
      if (scanner) {
        scanner
          .stop()
          .then(() => {
            setScanning(false);
          })
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, [isOpen]);

  const handleQRCodeSuccess = (decodedText) => {
    try {
      // Parse the URL
      const url = new URL(decodedText);
      
      // Check if it's our localhost URL
      if (url.origin === baseUrl) {
        // Extract the QR code from the URL path
        const pathParts = url.pathname.split('/');
        const qrCode = pathParts[pathParts.length - 1];
        
        // Close the scanner
        onClose();
        
        // Navigate to the product page with the QR code
        navigate(`/p/${qrCode}`);
      } else {
        throw new Error("Invalid URL domain");
      }
    } catch (e) {
      console.error("Invalid QR code URL:", decodedText);
      alert("Please scan a valid Kesar product QR code");
    }
  };

  const handleQRCodeError = (error: any) => {
    if (error?.message?.includes("NotFoundError")) {
      console.error("Camera access error:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl max-w-lg w-full mx-4 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Scan QR Code</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Scanner Container */}
          <div className="relative">
            {/* QR Scanner */}
            <div className="aspect-square rounded-xl overflow-hidden bg-black">
              <div 
                id="qr-reader" 
                className="w-full h-full [&>div]:!border-0 [&_video]:!object-cover [&_video]:!w-full [&_video]:!h-full [&_img]:hidden"
              />
            </div>

            {/* Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Scanner Frame */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-amber-500 rounded-2xl">
                {/* Corner Markers */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />
              </div>

              {/* Scanning Line Animation */}
              <div className="absolute left-1/2 -translate-x-1/2 w-48 h-px bg-amber-500 animate-scan" />
            </div>

            {/* Loading State */}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-2" />
                  <p>Accessing camera...</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Position the QR code within the frame to scan
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default QRScannerModal;