import { useEffect } from 'react';
import { toast } from 'react-toastify';

const NetworkStatusNotifier = () => {
  useEffect(() => {
    
    const handleOnline = () => {
      toast.info('You are back online!', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
      });
    };

    
    const handleOffline = () => {
      toast.error('You have lost your internet connection!', {
        position: 'bottom-right',
        autoClose: false, 
        hideProgressBar: true,
      });
    };

    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    
    if (!navigator.onLine) {
      handleOffline();
    }

    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

export default NetworkStatusNotifier;