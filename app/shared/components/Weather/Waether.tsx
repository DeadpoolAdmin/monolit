import { useGetWeatherForThreeDaysQuery, useGetWeatherQuery } from '@/services/Settings/SettingsApi';
import React, { useEffect, useState } from 'react'
import { useTranslate } from '@shared/hooks/languages/useI18';

import '@shared/styles/Loader/loader.scss'
import { getLocale } from '@/shared/functions/getLocale';

const Weather = () => {
    const { language } = useTranslate();
    const deviceInfo = JSON.parse(localStorage.getItem('deviceInfo') as string);

    const city = deviceInfo?.organization?.city

    const { data: weatherData } = useGetWeatherQuery(city ?? 'Yerevan')
    const { data: threeDaysWeather } = useGetWeatherForThreeDaysQuery(city ?? 'Yerevan')

    const [liveWeather, setLiveWeather] = useState<any>(null);
    const [otherDaysWeather, setOtherDaysWeather] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!threeDaysWeather) return

        const forecast = threeDaysWeather.forecast

        if (!forecast) return;

        const mapedForecast = forecast.map((fcast: any) => {
            return {
                temp_c: fcast.avgtemp_c,
                date: fcast.date,
                icon: fcast.condition?.icon
            }
        })

        setOtherDaysWeather(mapedForecast)

    }, [threeDaysWeather])

    useEffect(() => {
        setLoading(true);

        if (!weatherData) return;

        const weather = weatherData

        const city_name = weather.location.name;

        const mappedData = {
            city_name,
            temp_c: weather.current.temp_c,
        }

        setLiveWeather(mappedData)

        setLoading(false);
    }, [weatherData])


    return (
        <div className='content__weather'>
            {
                loading || !liveWeather || !otherDaysWeather ? (
                    <></>
                )
                    :
                    <>
                        <div className="weather__celsius">
                            <p style={{
                                fontSize: '11rem',
                            }}>

                                {Math.floor(liveWeather?.temp_c)}
                                <sup style={{
                                    fontSize: '4rem',
                                }}>°C</sup>
                            </p>
                        </div>

                        <div className="weather__timezone">
                            <p style={{
                                fontSize: "3rem"
                            }}>
                                {liveWeather?.city_name}
                            </p>
                        </div>

                        <div className="weather__otherdays">
                            {
                                otherDaysWeather?.map((item: any, index: number) => (
                                <div className="weather__otherday" key={index}>
                                    <div className="weather__day">
                                        <p>
                                            {
                                                new Date(item.date).toLocaleDateString(getLocale(language), {
                                                    weekday: 'short',
                                                })
                                            }
                                        </p>
                                    </div>

                                    <div className='weather__dayicon'>
                                        <img src={item.icon} alt="" />
                                    </div>

                                    <p>
                                        {Math.floor(item.temp_c)}
                                        <sup>°C</sup>
                                    </p>
                                </div>
                                ))
                            }
                        </div>
                    </>
            }

        </div>
    )
}

export default Weather