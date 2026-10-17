import React, { useEffect, useState } from 'react'


type PDateComponent = {
  options : Intl.DateTimeFormatOptions
  locale?: string
}

const dateStringLong = (date: Date, options: Intl.DateTimeFormatOptions, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale, options);
};

const DateComponent : React.FC<PDateComponent> = ({options, locale = 'en-US'}) => {

  const [date, setDate] = useState(dateStringLong(new Date(), options, locale))

  useEffect(() => {
    // Update date immediately when locale changes
    setDate(dateStringLong(new Date(), options, locale));
  }, [locale, options])

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(dateStringLong(new Date(), options, locale))
    }, 60000);
    
    return () => clearInterval(interval);
  }, [locale, options])

  return (
    <div className='date__component'>
      <div className="date" style={{ fontSize : '3rem'}}>
        {date}
      </div>
    </div>
  )
}

export default DateComponent