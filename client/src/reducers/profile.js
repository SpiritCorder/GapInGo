

export const profileOwner = (state={owner: null}, action) => {
    switch(action.type) {
        case 'PROFILE_OWNER_REQUEST':
            return {...state, loading: true};
        case 'PROFILE_OWNER_SUCCESS':
            return {loading: false, owner: action.payload};
        case 'PROFILE_OWNER_FAIL':
            return {...state, loading: false, error: action.payload};
        case 'PROFILE_OWNER_UPDATE_SUCCESS':
            return {loading: false, owner: action.payload, isUpdated: true};
        case 'PROFILE_OWNER_UPDATE_SUCCESS_RESET':
            return {...state, isUpdated: false}
        default: 
            return state;
    }
}