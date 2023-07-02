import {useSelector} from 'react-redux';
import {selectAuthUser} from '../app/slices/authSlice';
import {Navigate} from 'react-router-dom';

const ProtectedAdmin = ({children}) => {

    const user = useSelector(selectAuthUser);

    return (
        !user ? (<Navigate to={-1} />) : !user.isAdmin ? (<Navigate to={-1} />) : (children)
    );
        
    
}

export default ProtectedAdmin;