import React from 'react';
import QRCode from 'qrcode.react';
import { useAuth } from '../../context/authcontext';

const QRCodeComponent = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Attendance QR Code</h2>
      <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-gray-100">
        <QRCode
          value={user._id}
          size={256}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Show this QR code to your administrator to mark your attendance
      </p>
    </div>
  );
};

export default QRCodeComponent; 