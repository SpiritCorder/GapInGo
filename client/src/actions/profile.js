

export const getProfileOwner = () => async (dispatch, getState) => {

    dispatch({type: 'PROFILE_OWNER_REQUEST'});

    const {auth: {token}} = getState();

    try {
        const res = await fetch('/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if(data.message) {
            dispatch({type: 'PROFILE_OWNER_FAIL'});
        } else {
            dispatch({type: 'PROFILE_OWNER_SUCCESS', payload: data});
        }
    } catch (err) {
        dispatch({type: 'PROFILE_OWNER_FAIL'});
    }
}


export const updateProfileOwner = (values) => async (dispatch, getState) => {

    dispatch({type: 'PROFILE_OWNER_REQUEST'});
    const {auth: {token}} = getState();

    try {
        const res = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values)
        });

        const data = await res.json();
        dispatch({type: 'PROFILE_OWNER_UPDATE_SUCCESS', payload: data});

        setTimeout(() => {
            dispatch({type: 'PROFILE_OWNER_UPDATE_SUCCESS_RESET'});
        }, 5000)
    } catch (err) {
        
    }
}