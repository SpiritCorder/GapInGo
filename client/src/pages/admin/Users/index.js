import {useQuery} from 'react-query';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import {Row, Col, Table, Alert, Button, Badge} from 'react-bootstrap';
import Loader from '../../../components/Loader';

import {MdOutlineMoreVert} from 'react-icons/md';

import './styles/userList.css';

const getAllUsers = async axiosPrivate => {
    const response = await axiosPrivate.get('/api/admin/users');
    return response.data.users;
}

const UserListPage = () => {

    const axiosPrivate = useAxiosPrivate();

    const {isLoading, isFetching, isError, data:users, error} = useQuery('user-list', () => getAllUsers(axiosPrivate), {
        refetchOnWindowFocus: false
    })

    if(isLoading || isFetching) return <Loader />
    
    if(isError) {
        return (
            <Row className='mt-5 justify-content-center'>
                <Col md={12}><Alert variant='danger'>{error?.message}</Alert></Col>
            </Row>
        );
    }

    return (
        <>
            <Row className='mt-3'>
                <Col md={12}><h2>All Users</h2></Col>
            </Row>
            <hr></hr>

            {users?.length === 0 && (<h4 className='text-center mt-5'>No Users Registered Yet</h4>)}

            {users?.length > 0 && (

                <Row className='mt-5'>

                    <Col md={3}>
                        Search Options
                    </Col>

                    <Col md={9}>
                    <table className="userList-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Account Created</th>
                                <th>Email Verification</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <UserListRow key={user._id} user={user} />
                            ))}
                        </tbody>
                    </table>
                    </Col> 

                </Row>

            )}
            
        </>
    );
}

function UserListRow({user}) {

    return (
        <tr>
            <td>
                <p className="mb-0">{`${user.firstName} ${user.lastName}`}</p>
            </td>
            <td>
                <p className="text-muted mb-0" style={{maxWidth: '300px'}}>{user.email}</p>
            </td>
            <td>    
                <Badge bg={user.isAdmin ? 'info' : 'dark'}>{user.isAdmin ? 'Admin' : 'Customer'}</Badge>
            </td>
            <td>
                <small>{new Date(user.createdAt).toDateString()}</small>
            </td>
            <td>
                <Badge bg={user.isEmailVerified ? 'success' : 'danger'}>{user.isEmailVerified ? 'verified' : 'not verified'}</Badge>
            </td>
            <td>
                <div className='d-flex align-items-center justify-content-center'>
                    <MdOutlineMoreVert fontSize={20} />
                </div>
            </td>
        </tr>
    );
}


export default UserListPage;