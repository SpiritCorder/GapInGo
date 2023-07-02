

export const getUserList = () => async (dispatch, getState) => {
    dispatch({type: 'USER_LIST_REQUEST'});

    const {auth: {token}} = getState();

    try {
        const res = await fetch('/api/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if(!data.message) {
            dispatch({type: 'USER_LIST_SUCCESS', payload: data});
        } else {
            dispatch({type: 'USER_LIST_FAIL', payload: data.message});
        }
    } catch (err) {
        dispatch({type: 'USER_LIST_FAIL', payload: 'Internal Server Error'});
    }
}