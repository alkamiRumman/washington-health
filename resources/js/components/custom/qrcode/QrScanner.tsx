import { Eye, EyeOff, QrCode } from 'lucide-react';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const QrScanner: React.FC = () => {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getCartByQrCode } = useCart();
    const navigate = useNavigate();

    const handleScan = (data: any) => {
        if (data) {
            const qrCode = data.text;

            // Find cart by QR code
            const cart = getCartByQrCode(qrCode);

            if (cart) {
                // Navigate to cart detail page
                navigate(`/carts/${cart.id}`);
                setScanning(false);
            } else {
                setError('Cart not found for this QR code. Please try again.');
                setTimeout(() => setError(null), 3000);
            }
        }
    };

    const handleError = (err: any) => {
        console.error('QR scan error:', err);
        setError('Error scanning QR code. Please try again.');
        setTimeout(() => setError(null), 3000);
    };

    const toggleScanner = () => {
        setScanning(!scanning);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
                <h2 className="mb-2 text-xl font-medium text-gray-900">QR Code Scanner</h2>
                <p className="text-gray-600">Scan a cart's QR code to quickly access its details and update equipment</p>
            </div>

            {error && (
                <div className="bg-warning-50 border-warning-200 text-warning-700 animate-fade-in mb-4 w-full max-w-lg rounded border px-4 py-3">
                    {error}
                </div>
            )}

            <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-md">
                <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                    <div className="flex items-center">
                        <QrCode size={20} className="mr-2 text-gray-500" />
                        <span className="font-medium">Scanner</span>
                    </div>
                    <button
                        onClick={toggleScanner}
                        className={`flex items-center rounded-md px-3 py-1.5 ${
                            scanning ? 'bg-warning-50 text-warning-600' : 'bg-primary-50 text-primary-600'
                        }`}
                    >
                        {scanning ? (
                            <>
                                <EyeOff size={16} className="mr-1.5" />
                                <span>Stop Scanning</span>
                            </>
                        ) : (
                            <>
                                <Eye size={16} className="mr-1.5" />
                                <span>Start Scanning</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="p-6">
                    {scanning ? (
                        <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                            <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />

                            <div className="bg-opacity-50 bg-black py-2 text-center text-white">Position QR code in the center</div>
                        </div>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                            <QrCode size={48} className="mb-3 text-gray-400" />
                            <p className="text-center text-gray-500">Press "Start Scanning" to activate the camera</p>
                            <button onClick={toggleScanner} className="bg-primary-600 mt-4 rounded-md px-4 py-2 text-white">
                                Start Scanning
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 w-full max-w-lg text-center">
                <h3 className="mb-2 text-lg font-medium">Testing Instructions</h3>
                <p className="mb-4 text-gray-600">For testing purposes, you can manually enter a cart's QR code:</p>
                <div className="flex justify-center">
                    <input type="text" placeholder="Enter QR Code" className="w-64 rounded-l-md border border-gray-300 p-2" />
                    <button className="bg-primary-600 rounded-r-md px-4 py-2 text-white">Look Up</button>
                </div>
            </div>
        </div>
    );
};

export default QrScanner;
