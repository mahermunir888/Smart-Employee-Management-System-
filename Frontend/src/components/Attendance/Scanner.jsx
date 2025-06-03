import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axiosInstance from '../../utils/axios';
import AttendanceConfirmation from './AttendanceConfirmation';

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scannerRef.current = scanner;
      scanner.render(onScanSuccess, onScanError);

      // Cleanup
      return () => {
        scanner.clear().catch(error => {
          console.error('Failed to clear scanner', error);
        });
      };
    }
  }, [isScanning]);

  const onScanSuccess = async (decodedText) => {
    if (!isScanning) return; // Prevent multiple scans

    try {
      console.log('Scanned QR code value:', decodedText);
      
      const response = await axiosInstance.post('/api/attendance/mark', { 
        employeeId: decodedText 
      });

      // Get employee data
      const employeeResponse = await axiosInstance.get(`/api/employee/${decodedText}`);
      
      if (response.data.success) {
        setEmployeeData(employeeResponse.data.employee);
        setIsAlreadyMarked(false);
        setShowConfirmation(true);
        setError(null);
        // Disable scanning temporarily
        setIsScanning(false);
        // Re-enable scanning after 3 seconds
        setTimeout(() => {
          setIsScanning(true);
        }, 2000);
      }
      setScanResult(decodedText);
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error);
      if (error.response?.data?.error === "Attendance already marked for today") {
        // Get employee data even for already marked case
        try {
          const employeeResponse = await axiosInstance.get(`/api/employee/${decodedText}`);
          setEmployeeData(employeeResponse.data.employee);
          setIsAlreadyMarked(true);
          setShowConfirmation(true);
          setError(null);
          // Disable scanning temporarily
          setIsScanning(false);
          // Re-enable scanning after 3 seconds
          setTimeout(() => {
            setIsScanning(true);
          }, 3000);
        } catch (employeeError) {
          setError(employeeError.response?.data?.error || 'Failed to get employee data');
        }
      } else {
        setError(error.response?.data?.error || 'Failed to mark attendance');
      }
    }
  };

  const onScanError = (error) => {
    console.warn('QR Code scan error:', error);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setEmployeeData(null);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Scan Attendance QR Code
      </h2>
      
      <div id="reader" className="mb-6"></div>

      {error && !showConfirmation && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {showConfirmation && employeeData && (
        <AttendanceConfirmation
          employee={employeeData}
          isAlreadyMarked={isAlreadyMarked}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

export default Scanner; 