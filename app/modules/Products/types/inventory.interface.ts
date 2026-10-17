interface IInventory {
    id : number;
    name : string;
    image : string;
    desription : string;
    departmentUnit: {
        availableHours: {
            id?: string | number
            open: string
            close: string
        }[]
    }
    departmentUnitId : number;
    price? : number;
    unitPrice? : number;
    isPublished : boolean;
    warehouse : {
        id : number;
        name : string;
        availableDays: string[];
        availableHours: Record<string, Record<string, string>[]>;
        floor : number;
        image : string;
        isActive : boolean;
        type : string
    }
}

export default IInventory