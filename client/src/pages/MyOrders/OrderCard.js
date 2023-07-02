
import {useNavigate} from 'react-router-dom';
import {Row, Col, Image, Alert, Badge} from 'react-bootstrap';

import {MdInfo} from 'react-icons/md';

const OrderCard = ({order}) => {

    const navigate = useNavigate();

    const itemMilestone = () => {
        switch( order.orderItems[0]?.milestones[order.orderItems[0]?.milestones.length - 1].milestone) {
            case 'item_payment_pending':
                return 'This item payment is still pending';
            case 'item_paid':
                return 'This item has been paid successfully';
            case 'item_shipped':
                return 'This item has been shipped';
            case 'item_delivered':
                return 'This item has been delivered successfully';
            default:
                return;
        }
    }

    const orderStatus = () => {
        switch(order.orderMilestones[order.orderMilestones.length - 1].milestone) {
            case 'order_payment_pending':
                return {message: 'Order payment is still pending', bg: 'warning'};
            case 'order_paid':
                return {message: 'Order has been paid successfully', bg: 'success'};
            case 'partially_shipped':
                return {message: 'Some order items has been shipped', bg: 'info'};
            case 'shipped':
                return {message: 'Order has been shipped', bg: 'success'};
            case 'partially_delivered':
                return {message: 'Some order items has been delivered successfully', bg: 'info'};
            case 'delivered':
                return {message: 'Order has been delivered successfully', bg: 'success'};
            case 'completed':
                return {message: 'Order has been completed', bg: 'success'};
            default:
                return;
        }
    }


    return (
        <div className="w-100 p-4 shadow mb-5">

            <Row className='gap-3 gap-md-0'>
                <Col md={3}>
                    <p className='m-0 text-muted' style={{fontSize: '15px'}}>ORDER DATE</p>
                    <p className='m-0' style={{fontSize: '15px'}}>{new Date(order.createdAt).toDateString()}</p>
                </Col>
                <Col md={3}>
                    <p className='m-0 text-muted' style={{fontSize: '15px'}}>ORDER NUMBER</p>
                    <p className='m-0' style={{fontSize: '15px'}}>{order.orderId}</p>
                </Col>
                <Col md={4}>
                    <p className='m-0 text-muted' style={{fontSize: '15px'}}>ORDER CURRENT STATUS</p>
                    <p className='m-0' style={{fontSize: '16px'}}><Badge bg={orderStatus().bg}>{orderStatus().message}</Badge></p>
                </Col>
                <Col md={2} className='d-flex flex-column align-items-md-end'>
                    <p className='m-0 text-muted' style={{fontSize: '15px'}}>ORDER TOTAL</p>
                    <p className='m-0' style={{fontSize: '15px', fontWeight: 700}}>USD  ${order.totalPrice}</p>
                </Col>
            </Row>

            <hr></hr>

            <Row><Col md={12}><h5>Order Items</h5></Col></Row>

            <Row className='mt-2'>
                <Col md={3}>
                    <Image src={order.orderItems[0]?.productInfo.image} alt={order.orderItems[0]?.productInfo.id} fluid width='90%' rounded />
                </Col>
                <Col md={6}>
                    <p className='m-0' style={{fontSize:'17px', fontWeight: 400}}>{order.orderItems[0]?.productInfo.title}</p>
                    
                    {order.orderItems[0]?.productInfo.description && (<p className='m-0 text-muted mt-1' style={{fontSize:'14px'}}>{order.orderItems[0]?.productInfo.description}</p>)}
                    
                    <p className='m-0 text-muted mt-2' style={{fontSize:'14px', fontWeight: 400}}>Unit Price</p>
                    <p className='m-0' style={{fontSize:'14px', fontWeight: 500}}>USD ${order.orderItems[0]?.productInfo.unitPrice}</p>

                    {/* <p className='m-0 text-muted mt-2' style={{fontSize:'14px', fontWeight: 400}}>Ordered Quantity</p>
                    <p className='m-0' style={{fontSize:'14px'}}>{order.orderItems[0]?.qty}</p> */}
                    <Alert variant='info' className='mt-3 d-flex align-items-center gap-2'>
                        <MdInfo className='text-primary' />
                        <span>{itemMilestone()}</span>
                    </Alert>
                
                </Col>
                <Col md={3}>
                    <button className='btn btn-primary w-100' onClick={() => navigate(`/my-orders/${order._id}`)} >View More</button>
                </Col>
            </Row>

        </div>
    );
}

export default OrderCard;