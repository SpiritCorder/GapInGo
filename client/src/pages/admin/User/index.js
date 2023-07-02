import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getSingleUserDetails} from '../../../actions/admin/user';
import {useParams, useNavigate} from 'react-router-dom';
import {Alert, Row, Col, ListGroup, Button} from 'react-bootstrap';
import Loader from '../../../components/Loader';
import EnhancedTable from '../../../components/EnhancedTable';

const UserPage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error, userDetails, userOrders} = useSelector(state => state.singleUser);

    useEffect(() => {
        dispatch(getSingleUserDetails(id));
    }, [dispatch, id]);

    return (
        loading ? (<Loader />) : error ? (<Alert variant='danger'>{error}</Alert>) : (
            <>
                <Row className='my-4'>
                    <Col>
                        <Button className='btn-sm' variant='dark' onClick={() => navigate('/admin/users')}>Go Back</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <ListGroup>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Name : </Col>
                                    <Col>{userDetails.name}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Email : </Col>
                                    <Col>{userDetails.email}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Admin : </Col>
                                    <Col><Alert variant={`${userDetails.isAdmin ? 'success' : 'danger'}`}>{userDetails.isAdmin ? 'Admin' : 'Not Admin'}</Alert></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><Button variant='dark' className='btn-sm'>DELETE</Button></Col>
                                    <Col><Button variant={`${userDetails.isAdmin ? 'danger' : 'success'}`} className='btn-sm'>{userDetails.isAdmin ? 'Devote as admin' : 'Make as admin'}</Button></Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={8}>
                    </Col>
                </Row>
                <Row className='my-4'>
                    <Col>
                        {userOrders.length === 0 ? (<h1 className='text-center'>No Orders</h1>) : (<EnhancedTable data={userOrders} />)}
                    </Col>
                </Row>
            </>
        )
    );
}

export default UserPage;