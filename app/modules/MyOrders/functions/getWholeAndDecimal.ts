export const getWholeAndDecimal = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const [whole, decimal] = numValue.toString().split('.');

    return {
        whole: parseInt(whole, 10),
        decimal: decimal ? parseInt(decimal, 10) : 0,
    }
}