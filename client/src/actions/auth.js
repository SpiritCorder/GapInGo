
export const login = (email, password) => async (dispatch) => {
    dispatch({type: 'AUTH_USER_REQUEST'});

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await res.json();
        if(data.message) {
            dispatch({type: 'LOGIN_FAIL', payload: data.message});
            setTimeout(() => {
                dispatch({type: 'LOGIN_ERROR_RESET'});
            }, 3000)
        } else {
            const {token, user} = data;
            dispatch({type: 'LOGIN_SUCCESS', payload: {token, user}});
        }   
    } catch (err) {
        dispatch({type: 'LOGIN_FAIL', payload: 'Login failed'})
    }
}

export const logout = () => (dispatch) => {
    dispatch({type: 'LOGOUT'});
}

export const getAuthUser = () => async (dispatch, getState) => {
    const {auth: {token}} = getState();

    if(!token) {
        dispatch({type: 'LOADING_STATE_RESET'});
        return;
    };

    //dispatch({type: 'AUTH_USER_REQUEST'});

    try {
        const res = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json();
        if(data.user) {
            dispatch({type: 'AUTH_USER_SUCCESS', payload: data.user});
        } else {
            dispatch({type: 'AUTH_USER_FAIL'});
        }
    } catch (err) {
        dispatch({type: 'AUTH_USER_FAIL'});
    }
}

export const register = (name, email, password) => async (dispatch) => {
    dispatch({type: 'AUTH_USER_REQUEST'});

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
        });

        const data = await res.json();
        if(data.user) {
            dispatch({type: 'REGISTRATION_SUCCESS'});

            setTimeout(() => {
                const {token, user} = data;
                dispatch({type: 'LOGIN_SUCCESS', payload: {token, user}});
            }, 6000)
            
        } else {
            dispatch({type: 'LOGIN_FAIL', payload: data.message});
            setTimeout(() => {
                dispatch({type: 'LOGIN_ERROR_RESET'});
            }, 3000)
        }
    } catch (err) {
        dispatch({type: 'LOGIN_FAIL', payload: 'Register Failed'});
    }
}