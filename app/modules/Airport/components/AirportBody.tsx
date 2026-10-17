import React from 'react'
import AirportList from './AirportList'
import { useTranslate } from '@/shared/hooks/languages/useI18';

const AirportBody = () => {


  const { t } = useTranslate();

  return (
    <div className='airport__body'>
      <div className="body__title" style={{
        position: 'relative',
        top: '-5rem'
      }}>
        <span>{t('chooseAirport')}</span>
      </div>

      <AirportList />
    </div>
  )
}

export default AirportBody