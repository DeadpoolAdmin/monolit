import React from 'react';
import { useToast } from '@/shared/hooks/toast/useToast';
import { useTranslate } from '@/shared/hooks/languages/useI18';
import { Button } from '@/shared/components/Button/Button';

/**
 * Test component to verify toast translations are working
 * 
 * Usage: Import this component in your app to test
 * <ToastTest />
 */
export const ToastTest: React.FC = () => {
  const { addToastFromType } = useToast();
  const { t, language } = useTranslate();

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      left: '20px', 
      background: 'white', 
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999
    }}>
      <h3 style={{ marginBottom: '10px' }}>Toast Translation Test</h3>
      <p style={{ marginBottom: '10px', fontSize: '14px' }}>
        Current Language: <strong>{language}</strong>
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button 
          onClick={() => addToastFromType('alarm')}
          style={{ padding: '10px', fontSize: '14px' }}
        >
          Test Alarm Toast
        </Button>
        
        <Button 
          onClick={() => addToastFromType('product')}
          style={{ padding: '10px', fontSize: '14px' }}
        >
          Test Product Toast
        </Button>
        
        <Button 
          onClick={() => addToastFromType('reservation')}
          style={{ padding: '10px', fontSize: '14px' }}
        >
          Test Reservation Toast
        </Button>
        
        <Button 
          onClick={() => addToastFromType('order', { status: 'READY' })}
          style={{ padding: '10px', fontSize: '14px' }}
        >
          Test Order Toast
        </Button>

        <Button 
          onClick={() => addToastFromType('order_rejected')}
          style={{ padding: '10px', fontSize: '14px' }}
        >
          Test Order Rejected Toast
        </Button>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p>✅ Each toast should appear in your selected language:</p>
        <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
          <li>EN: "Alarm is set successfully"</li>
          <li>FR: "L'alarme est définie avec succès"</li>
          <li>HY: "Զարթուցիչը հաջողությամբ տեղադրվել է"</li>
          <li>ES: "La alarma se ha configurado correctamente"</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastTest;

