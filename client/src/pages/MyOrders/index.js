
import {useQuery} from 'react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Row, Col, Alert} from 'react-bootstrap';
import Loader from '../../components/Loader';
import OrderCard from './OrderCard';

const getMyOrders = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get('/api/orders');
        return response.data.orders;
    } catch(err) {
        return err;
    }
}

const MyOrders = () => {

    const axiosPrivate = useAxiosPrivate();

    const {isLoading, data:orders, isError, error, isFetching} = useQuery('my-order-list', () => getMyOrders(axiosPrivate), {
        refetchOnWindowFocus: false
    });

    

    if(isLoading || isFetching) return <Loader />

    if(isError) {
        return (
            <Row>
                <Col md={6}><Alert variant='danger'>{error.message}</Alert></Col>
            </Row>
        )
    }

    console.log(orders);

    return (
        <>
            <Row className='mt-3'>
                <Col md={12}><h2>Your Orders</h2></Col>
            </Row>
            <hr></hr>

            {orders.length === 0 && (<h4 className='text-center mt-5'>No purchases yet</h4>)}
            
            {orders.length > 0 && (
                <Row className='mt-5'>

                    <Col md={3}>
                        <p>Search Options</p>
                    </Col>

                    <Col md={9}>
                        {orders.length > 0 && orders.map(order => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </Col>

                </Row>
            )}
            
        </>
    );
}

export default MyOrders;