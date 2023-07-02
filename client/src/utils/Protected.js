import {useSelector} from 'react-redux';
import {selectAuthUser} from '../app/slices/authSlice';
import {Navigate} from 'react-router-dom';


const Protected = ({children}) => {

    const user = useSelector(selectAuthUser);

    return (
        !user ? (<Navigate to='/login' />) : (children)
    );
}

export default Protected;