import {useEffect} from 'react';
import {axiosPrivate} from '../config/axios';
import {useSelector} from 'react-redux';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {

    const accessToken = useSelector(state => state.auth.accessToken);
    const refresh = useRefreshToken();

    useEffect(() => {

        // axios request interceptor
        const requestInterceptor = axiosPrivate.interceptors.request.use(config => {
            if(!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
        )

        // axios response interceptor
        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
            const prevRequest = error?.config;
            if(error?.response?.status === 403 && !prevRequest.sent) {
                // hit the refresh endpoint to get a new access token
                prevRequest.sent= true;
                const accessToken = await refresh();
                return axiosPrivate({
                    ...prevRequest,
                    headers: {...prevRequest.headers, Authorization: `Bearer ${accessToken}`}
                })
            }
            return Promise.reject(error);
        })


        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }
    }, [accessToken, refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;