import React from 'react'
import { useOnHideNotify } from '../hooks/useHideOnNotify';
import { usePromotionClose } from '../hooks/usePromotionClose';
import { useTranslate } from '@/shared/hooks/languages/useI18';


const PromotionCloseButton = ({active} : { active : boolean }) => {
  useOnHideNotify()

  const { closePromotion } = usePromotionClose();

  const { t } = useTranslate();

  return (
    <div className={`promotion__close__button ${active ? 'active' : ''}`} onClick={closePromotion}>
      <div className='promotion__close'>
        <span>{t('close')}</span>
      </div>
    </div>
  )
}

export default PromotionCloseButton