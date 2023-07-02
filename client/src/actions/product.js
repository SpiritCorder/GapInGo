export const loadProductList = (keyword='') => async (dispatch) => {
    dispatch({type: 'PRODUCT_LIST_REQUEST'});
    try {
        const res =await fetch(`/api/products?keyword=${keyword}`);
        const data = await res.json();
        if(data.message) {
            dispatch({type: 'PRODUCT_LIST_FAIL', payload: data.message});
        } else {
            dispatch({type: 'PRODUCT_LIST_SUCCESS', payload: data});
        }   
    } catch (err) {
        dispatch({type: 'PRODUCT_LIST_FAIL', payload: err.message});
    }
}

export const loadSingleProduct = (id) => async dispatch => {
    dispatch({type: 'SINGLE_PRODUCT_REQUEST'});

    console.log('Action creator');
    try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        dispatch({type: 'SINGLE_PRODUCT_SUCCESS', payload: data});
    } catch (err) {
        dispatch({type: 'SINGLE_PRODUCT_FAIL', payload: err.message});
    }
}

export const loadTopRatedProducts = () => async dispatch => {


    try {
        const res = await fetch('/api/products/top-rated');
        const data = await res.json();
        
        dispatch({
            type: "TOP_RATED_PRODUCT_SUCCESS",
            payload: data
        });
    } catch (err) {
        
        dispatch({
            type: "TOP_RATED_PRODUCT_FAIL",
            payload: "Internel server error"
        });
    }
}