import { useTranslate } from '@/shared/hooks/languages/useI18'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import React from 'react'
import { useSelector } from 'react-redux'

const Input = React.forwardRef<HTMLInputElement, { value: string, onChange: (value: string) => void, onClickInput: () => void }>(({ value, onChange, onClickInput }, ref) => {
    const isActive = useSelector((state: any) => state.rootControl?.rootControl === ROOT_CONTROL.LIVETV_SEARCH)

    const { t } = useTranslate();

    return (
        <div className='search__input'>
            <input ref={ref} placeholder={t('searchChannels')} type="text" className={isActive ? 'active' : ''} value={value} onChange={(e) => onChange(e.target.value)} tabIndex={-1} onClick={onClickInput} onFocus={(e) => e.target.blur()} />
        </div>
    )
})

export default Input