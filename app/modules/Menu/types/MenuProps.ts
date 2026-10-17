import { Branding } from "@/shared/types/branding/branding";

export interface IConfig {
    title: Record<string, string> | string;
    date : string,
    logo: string;
    background: string;
    organizationId: string;
    activationScreen: {
        message: Record<string, string> | string;
        background: string;
    };
    welcomeScreen: {
        message: Record<string, string> | string
        subMessage: Record<string, string> | string;
        background: string;
        dateColor: string;
        dateFont : string;
        messageFont : string; 
        submessageFont : string;
        color : string;
        screenTextColor : string;
        screenTextFont : string;
        headingTextColor : string;
        headingTextFont : string;
        wifi: {
            ssid: string;
            password: string;
        }
    };
    menuItems: IMenuItem[];
    menuScreen: {
        submessageFont: string;
        message: Record<string, string> | string;
        subMessage: Record<string, string> | string;
        background : string;
        dateColor: string;
        dateFont : string;
        messageFont : string; 
        subMessageFont : string;
        color : string;
        cardColor : string;
        fontSize : string;
        screenTextColor : string;
        screenTextFont : string;
        headingTextColor : string;
        headingTextFont : string;
    };
}

export interface IMenuItem {
    title: Record<string, string> | string;
    icon: string;
    isVisible: boolean;
    isApplication: boolean;
    applicationId: string;
    customBranding: any;
    type : string;
    color : string;
    fontSize : string;
    activeColor : string;
    fontFamily : string;
}

export interface IMenuList {
    id? : number
    createdAt? : string
    updatedAt? : string
    enable? : boolean
    title : string
    icon : string
    organization_id? : number
    position? : number
    type? : string;
    color : string;
    fontSize : string;
    activeColor : string;
    fontFamily : string;
}



type PMenu = {
    menuItems : IMenuItem[]
    title? : string | Record<string, string>
    background? : string;
    subTitle? : string | Record<string, string>
    branding? : Branding
    // media? : MusicItem | null;
    // setMedia : React.Dispatch<React.SetStateAction<MusicItem | null>>
    subTitleFontSize? : string
    titleFontSize? : string
}

export default PMenu

