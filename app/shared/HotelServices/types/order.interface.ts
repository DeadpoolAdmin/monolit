interface Order {
    departmentUnitId : number | null;
    items : Array<{
        inventoryId : number;
        quantity : number;
    }>
}

export default Order;