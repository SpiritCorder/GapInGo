

export const myOrders = (state={loading: true}, action) => {
    switch(action.type) {
        case 'MY_ORDERS_REQUEST':
            return {loading: true};
        case 'MY_ORDERS_SUCCESS':
            return {loading: false, myOrders: action.payload};
        case 'MY_ORDERS_FAIL':
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}