import { setFontSize } from "@/shared/functions/setFontSize"
import { useGuestDetails } from "@/shared/hooks/mutations/useGuestDetails"
import { useText } from "@/shared/hooks/useGetText"
import React from "react"

import { FC } from "react"

type PNavigationText = {
  introText: string
  subIntroText: string
  introTextFontSize: string;
  subIntroTextFontSize: string;
  guestName: string;
}

const NavigationText: FC<PNavigationText> = ({ introText, subIntroText, introTextFontSize, subIntroTextFontSize, guestName }) => {


  const { getText } = useText();


  const welcomeText = introText.replace(`{{guest.name}}`, !guestName || guestName?.includes('undefined') ? 'John Doe' : guestName)



  const lang = localStorage.getItem('lang') as string;

  return (
    <div className='nav__text'>

      <div className="nav__intro">
        <span style={{
          fontSize: introTextFontSize ? setFontSize(introTextFontSize) : '4rem',

        }}>
          {getText(welcomeText, lang)}
        </span>
        <br />
        <span style={
          {
            fontSize: subIntroTextFontSize ? setFontSize(subIntroTextFontSize) : '4rem',
          }}>
          {getText(subIntroText, lang)}
        </span>
      </div>
    </div>
  )
}

export default NavigationText