import background from '@/assets/background.png'

const setCssProperty = (property: string, value: string) => {
    document.body.style.setProperty(property, value);
}


type Branding = {
    activeColor: string;
    cardTextColor: string;
    dateTextColor: string;
    menuItemTextColor: string;
    messagesTextColor: string;
    screenTextColor: string;
    buttonActiveColor: string;
    secondaryButtonTextColor: string;
    secondaryButtonBackgroundColor: string;
    secondaryButtonActiveColor: string;
    headingTextColor: string;
    roomControlCardBackground: string;
    screenTextFont: string;
    headingTextFont: string;
    primaryButtonActiveColor: string;
    primaryButtonBackgroundColor: string;
    primaryButtonTextColor: string;
    background: string;
    paragraphTextColor: string
    
};

export function applyBrandingStyles(branding: Branding) {
    const cssMap: Record<string, string> = {
        '--app-background': `url('${branding.background ? branding.background : background}')`,
        '--active-color': branding.activeColor,
        '--card-text-color': branding.cardTextColor,
        '--secondary-button-text-color': branding.secondaryButtonTextColor,
        '--secondary-button-bg-color': branding.secondaryButtonBackgroundColor,
        '--heading-text-color': branding.headingTextColor,
        '--room-control-card-bg': branding.roomControlCardBackground,
        '--paragraph-font-family': branding.screenTextFont,
        '--heading-font-family': branding.headingTextFont,
        '--primary-button-bg-color': branding.primaryButtonBackgroundColor,
        '--primary-button-text-color': branding.primaryButtonTextColor,
        '--paragraph-text-color': branding.paragraphTextColor,
    };

    for (const [cssVar, value] of Object.entries(cssMap)) {
        setCssProperty(cssVar, value);
    }
}
