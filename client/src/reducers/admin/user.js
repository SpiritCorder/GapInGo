

export const singleUser = (state={loading: true}, action) => {
    switch(action.type) {
        case 'SINGLE_USER_DETAILS_REQUEST':
            return {loading: true};
        case 'SINGLE_USER_DETAILS_SUCCESS':
            return {loading: false, userDetails: action.payload.user, userOrders: action.payload.orders};
        case 'SINGLE_USER_DETAILS_FAIL':
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}
