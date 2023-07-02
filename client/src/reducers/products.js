export const productList = (state={products: []}, action) => {
    switch(action.type) {
        case 'PRODUCT_LIST_REQUEST':
            return {loading: true, products: []}
        case 'PRODUCT_LIST_SUCCESS':
            return {loading: false, products: action.payload}
        case 'PRODUCT_LIST_FAIL':
            return {loading: false, error: action.payload}
        default: 
            return state;
    }
}

export const singleProduct = (state={product: {}}, action) => {

    switch(action.type) {
        case 'SINGLE_PRODUCT_REQUEST':
            return {loading: true, product: {}}
        case 'SINGLE_PRODUCT_SUCCESS':
            return {loading: false, product: action.payload}
        case 'SINGLE_PRODUCT_FAIL':
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}

export const topratedProducts = (state={loading: true, products: []}, action) => {

    switch(action.type) {
        case "TOP_RATED_PRODUCT_SUCCESS":
            return {...state, loading: false, products: action.payload};
        case "TOP_RATED_PRODUCT_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}