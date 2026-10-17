import { Location } from 'react-router-dom';

export default interface HeaderContentProps {
    location: Location;
    logo: string;
    isBackActive: boolean;
    isEmptyAlive: boolean;
    currentControl: string | null;
    setIsBackActive: (value: boolean) => void;
    setCurrentControl: (value: string | null) => void;
    clickBack: () => void;
}