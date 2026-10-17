
export default interface HeadingsConfig {
    headingOne: string;   // Weather card number (e.g., 24)
    headingTwo: string;   // Message
    headingThree: string; // Sub message
    headingFour: string;  // Date text
    headingFive: string;  // WiFi card title
    headingSix: string;   // Menu item card title
    headingSeven: string; // Weather card place name (e.g., Rome, Italy)
    headingEight: string; // WiFi card texts
    headingNine: string;  // Weather card celsius values at bottom
    paragraphOne: string; // For app
    paragraphTwo: string; // Weather card week names
    appFontFamily: string; // app font family
    color: string; // all heading color
    activeColor: string; // active heading color buttonBackgroundColor: '',
    buttonBackgroundColor: string; // button background color
    buttonTextColor: string; // button text color
    cardTextColor: string; // card text color
    dateTextColor: string; // date text color
    menuItemTextColor: string; // menu item text color
    messagesTextColor: string; // messages text color
    screenTextColor: string; // screen text color
    buttonHoveredColor: string; // button hovered color
    secondaryButtonTextColor: string; // secondary button text color
    secondaryButtonBackgroundColor: string; // secondary button background color
    secondaryButtonHoveredColor: string; // secondary button hovered color
    headingTextColor: string; // heading text color
    roomControlCardBackground: string; // room control card background color
    paragraphFont: string; // paragraph font
    headingFont: string; // heading font
}

export interface Branding {
    appFontFamily: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    cardTextColor: string;
    dateTextColor: string;
    menuItemTextColor: string;
    messagesTextColor: string;
    screenTextColor: string;
    activeColor: string;
    buttonHoveredColor: string;
    secondaryButtonTextColor: string;
    secondaryButtonBackgroundColor: string;
    secondaryButtonHoveredColor: string;
    headingTextColor: string;
    roomControlCardBackground: string;
    paragraphFont: string;
    headingFont: string;
    headings: {
      weatherCardNumber: string;
      message: string;
      subMessage: string;
      dateText: string;
      wifiCardTitle: string;
      menuItemCardTitle: string;
      weatherCardPlaceName: string;
      wifiCardTexts: string;
      weatherCardCelsiusValues: string;
      color: string;
      activeColor: string;
    };
    paragraphs: {
      app: string;
      weatherCardWeeks: string;
      color: string;
      activeColor: string;
    };
  }
  
  