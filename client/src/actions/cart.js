export const addToCart = (item) => (dispatch) => {
    dispatch({type: 'ADD_TO_CART', payload: item});
}

export const removeFromCart = (id) => (dispatch) => {
    dispatch({type: 'REMOVE_FROM_CART', payload: {removeId: id}});
}

export const updateCartQuantity = (id, qty) => (dispatch) => {
    dispatch({type: 'UPDATE_CART_QUANTITY', payload: {id, qty}});
}

export const loadtCartItems = () => async (dispatch, getState) => {
    const {cart: {cartItems}} = getState();
    
    if(cartItems.length === 0) {
        return;
    }
    
    dispatch({type: 'CART_ITEMS_REQUEST'})
    
    const ids = cartItems.map(item => item.id);
    
    try {
        const res = await fetch('/api/products/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({items: ids})
        })

        const data = await res.json();
        dispatch({type: 'CART_ITEMS_SUCCESS', payload: data});
    } catch (err) {
        
    }
}

export const addShippingAddress = (data) => (dispatch) => {
    dispatch({type: 'ADD_SHIPPING_ADDRESS', payload: data});
}

export const addPaymentMethod = method => (dispatch) => {
    dispatch({type: 'ADD_PAYMENT_METHOD', payload: method});
}