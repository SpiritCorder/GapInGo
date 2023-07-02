
import {useQuery} from 'react-query';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import {Row, Col, Alert} from 'react-bootstrap';

import Loader from '../../../components/Loader';
import OrderListItem from './OrderListItem';

const getAllOrders = async axiosPrivate => {
    const response = await axiosPrivate.get('/api/admin/orders');
    return response.data.orders;
}

const OrderList = () => {

    const axiosPrivate = useAxiosPrivate();

    const {isLoading, isFetching, isError, error, data:orders} = useQuery('order-list', () => getAllOrders(axiosPrivate), {
        refetchOnWindowFocus: false
    });

    if(isLoading || isFetching) return <Loader />

    if(isError) {
        <Row>
            <Col md={12}><Alert variant='danger'>{error?.message}</Alert></Col>
        </Row>
    }

    return (
        <>
            <Row className='mt-3'>
                <Col md={12}>
                    <h2>Orders</h2>
                </Col>
            </Row>
            <hr></hr>

            {orders.length === 0 && (<h4 className='text-center mt-5'>No orders</h4>)}

            {orders.length > 0 && (
                <Row className='mt-4 justify-content-center'>
                    <Col md={12}>
                        {orders.map(order => (
                            <OrderListItem order={order} key={order._id} />
                        ))}
                    </Col>
                </Row>
            )}
            
        </>
    );
}

export default OrderList;
