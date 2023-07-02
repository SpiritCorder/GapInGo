

export const getSingleUserDetails = id => async (dispatch, getState) => {
    dispatch({type: 'SINGLE_USER_DETAILS_REQUEST'});

    const {auth: {token}} = getState();

    try {
        const res = await fetch(`/api/admin/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if(!data.message) {

            const ordersRes = await fetch(`/api/orders?admin=true&user=${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const ordersData = await ordersRes.json();
         
            if(!ordersData.message) {
                dispatch({type: 'SINGLE_USER_DETAILS_SUCCESS', payload: {user: data, orders: ordersData}});
            } else {
                dispatch({type: 'SINGLE_USER_DETAILS_FAIL', payload: ordersData.message});
            }
        } else {
            dispatch({type: 'SINGLE_USER_DETAILS_FAIL', payload: data.message});
        }
    } catch (err) {
        dispatch({type: 'SINGLE_USER_DETAILS_FAIL', payload: 'Internal Server Error'});
    }
}