
const initState = {
    token: localStorage.getItem('token') || null,
    user: null,
    mainLoading: true
}

export const auth = (state=initState, action) => {

    switch(action.type) {
        case 'LOADING_STATE_RESET':
            return {...state, mainLoading: false};
        case 'AUTH_USER_REQUEST':
            return {...state, loading: true, user: null};
        case 'AUTH_USER_SUCCESS':
            return {...state, mainLoading: false, user: action.payload};
        case 'AUTH_USER_FAIL':
            localStorage.removeItem('token');
            return {...state, mainLoading: false, token: null}
        case 'LOGIN_SUCCESS':
            const {token, user} = action.payload;
            localStorage.setItem('token', token);
            return {token, user: Object.assign({}, user), error: null, loading: false, isRegistrationSuccess: false};
        case 'LOGIN_FAIL':
            return {...state, error: action.payload, loading: false}
        case 'LOGIN_ERROR_RESET':
            return {...state, error: null}
        case 'REGISTRATION_SUCCESS':
            return {...state, loading: false, isRegistrationSuccess: true};
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {...state, token: null, user: null}
        default:
            return state;
    }
}