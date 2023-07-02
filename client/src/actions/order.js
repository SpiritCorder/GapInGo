
export const getOrderState = id => async (dispatch, getState) => {
    dispatch({type: 'ORDER_STATE_REQUEST'});

    const {auth: {token}} = getState();

    try {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if(!data.message) {
            // success
            dispatch({type: 'ORDER_STATE_SUCCESS', payload: data});
        } else {
            // fail
            dispatch({type: 'ORDER_STATE_FAIL', payload: data.message});
        }
    } catch (err) {
        dispatch({type: 'ORDER_STATE_FAIL', payload: 'Internel Server Error'});
    }
}

export const updateOrderPayment = (id, paymentResult) => async (dispatch, getState) => {
    dispatch({type: 'ORDER_PAYMENT_REQUEST'});
    const {auth: {token}} = getState();

    try {
        const res = await fetch(`/api/orders/${id}/pay`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentResult)
        });

        const data = await res.json();
        if(!data.message) {
            // success
            dispatch({type: 'ORDER_PAYMENT_SUCCESS', payload: data});
        } else {
            // fail
            dispatch({type: 'ORDER_PAYMENT_FAIL', payload: data.message});
        }
    } catch (err) {
        dispatch({type: 'ORDER_PAYMENT_FAIL', payload: 'Internal Server Error'});
    }
}

export const getMyOrders = () => async (dispatch, getState) => {
    dispatch({type: 'MY_ORDERS_REQUEST'});

    const {auth: {token}} = getState();

    try {
        const res = await fetch('/api/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if(!data.message) {
            dispatch({type: 'MY_ORDERS_SUCCESS', payload: data});
        } else {
            dispatch({type: 'MY_ORDERS_FAIL', payload: data.message});
        }
    } catch (err) {
        dispatch({type: 'MY_ORDERS_FAIL', payload: 'Internal Server Error'});
    }
}

export const stripeCheckout = (orderId) => async (useDispatch, getState) => {

    const {auth: {token}} = getState();

    try {
        const res = await fetch('/api/checkout/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({orderId})
        });

        const data = await res.json();

        window.location.href = data.url;
    } catch (err) {
        console.log(err);
    }
}