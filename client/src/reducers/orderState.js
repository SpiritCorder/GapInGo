
export const orderState = (state = {order: null, loading: true}, action) => {
    switch(action.type) {
        case 'ORDER_STATE_REQUEST':
            return {loading: true};
        case 'ORDER_STATE_SUCCESS':
            return {loading: false, order: action.payload};
        case 'ORDER_STATE_FAIL':
            return {loading : false, error: action.payload};
        case 'ORDER_PAYMENT_REQUEST':
            return {...state, paymentLoading: true};
        case 'ORDER_PAYMENT_SUCCESS':
            return {...state, paymentLoading: false, order: action.payload, paymentSuccess: true};
        case 'ORDER_PAYMENT_FAIL':
            return {...state, paymentLoading: false, error: action.payload};
        default:
            return state;
    }
}