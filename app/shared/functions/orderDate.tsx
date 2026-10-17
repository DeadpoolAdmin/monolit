export function formatDate(date: Date, isShowHours : boolean = true, locale: string = 'en-GB'): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const datePart = date.toLocaleDateString(locale, options);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // keep 24h format but add AM/PM
    const timePart = isShowHours ? `${hours.toString().padStart(2, '0')}:${minutes}` : '';

    return `${datePart}, ${timePart}`;
}