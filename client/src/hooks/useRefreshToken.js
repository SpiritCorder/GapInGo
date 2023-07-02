import {axiosPublic} from '../config/axios';
import {useDispatch} from 'react-redux';
import {accessTokenRefreshSuccess, logoutAuthUser} from '../app/slices/authSlice';

const useRefreshToken = () => {

    const dispatch = useDispatch();

    const refresh = async () => {
        try {
            const response = await axiosPublic.get('/api/auth/refresh');
            // successfully receive a new access token, so update the auth state with the new access token
            dispatch(accessTokenRefreshSuccess({accessToken: response.data.accessToken, user: response.data.user}));
            return response.data.accessToken;
        } catch(err) {
            if(err.response.status === 403) {
                // refresh token has expired, so logout user
                dispatch(logoutAuthUser());
            }
        }
    }

    return refresh;

}

export default useRefreshToken;