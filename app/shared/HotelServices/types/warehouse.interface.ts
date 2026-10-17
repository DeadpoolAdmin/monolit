export default interface IWarehouse {
    availableDays: string[]
    availableHours: {
        id?: string | number
        open: string
        close: string
    }[]
    floor: number
    image: string
    isActive: boolean
    name: string
    orgId: number
    sailPoint: boolean
    type: string
    id: number,
    departmentId: number,
}