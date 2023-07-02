import {useState, useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAccessToken, selectAuthUser} from '../app/slices/authSlice';
import useRefreshToken from '../hooks/useRefreshToken';
import Loader from '../components/Loader';


const PersistAuth = () => {

    const refresh = useRefreshToken();
    const accessToken = useSelector(selectAccessToken);
    const authUser = useSelector(selectAuthUser);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAuth = async () => {
            try {
                await refresh();
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        !accessToken && !authUser && getAuth();
        accessToken && authUser && setLoading(false);
    }, [refresh, accessToken, authUser])

    return (
        loading ? <Loader /> : <Outlet />
    );
}

export default PersistAuth;