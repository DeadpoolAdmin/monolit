import React from 'react'

import empty from '@assets/basket.png'
import { useTranslate } from '@/shared/hooks/languages/useI18';

const EmptyComponent = React.memo(() => {

    const { t } = useTranslate();

    return (
        <div className='empty__basket'>
            <div className="basket__image">
                <img src={empty} alt="" />
            </div>

            <div className="basket__emptytext">
                <span>{t('yourCartIsEmpty')}</span>
            </div>
        </div>
    )
})

EmptyComponent.displayName = 'EmptyComponent'

export default EmptyComponent