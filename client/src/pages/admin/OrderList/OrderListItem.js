import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Row, Col, Badge} from 'react-bootstrap';
import moment from 'moment';
import {MdInfoOutline, MdMoreVert, MdRemoveRedEye, MdUnfoldMore, MdOfflinePin, MdCheckCircle} from 'react-icons/md';

import './styles/orderListItem.css';

const OrderListItem = ({order}) => {

    const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
    const navigate = useNavigate();

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
        <Row className='w-100 shadow p-3 mb-4 rounded' key={order._id} >
            <Col md={2} className='d-flex align-items-center'>
                <div style={{width: 'max-content'}}>
                    <p className='m-0' style={{fontSize: '20px', fontWeight: 500}}>#Order ID</p>
                    <p className='m-0 text-center'><Badge bg='dark'>{order.orderId}</Badge></p>
                </div>
            </Col>
            <Col md={2} className='d-flex align-items-center'>
                <div style={{width: 'max-content'}}>
                    <p className='m-0 text-center text-muted' style={{fontSize: '14px'}} >Placed At</p>
                    <p className='m-0 text-muted d-flex align-items-center gap-2' style={{fontSize: '13px'}}>{new Date(order.createdAt).toDateString()} <span>{moment(order.createdAt).format('hh:mm A')}</span></p>
                </div>
            </Col>
            <Col md={2} className='d-flex align-items-center'>
                <div style={{width: 'max-content'}}>
                    <p className='m-0 text-muted' style={{fontSize: '14px'}}>Total Items</p>
                    <p className='m-0 text-center' style={{fontSize: '14px'}}><Badge bg='secondary'>{order.orderItems.length}</Badge></p>
                </div>
            </Col>
            <Col md={2} className='d-flex align-items-center'>
                <div style={{width: 'max-content'}}>
                    <p className='m-0' style={{fontSize: '14px'}}>Order Status</p>
                    <p className='m-0' style={{fontSize: '14px'}}><Badge bg={orderStatus().bg}>{orderStatus().message}</Badge></p>
                </div>
            </Col>
            <Col md={2} className='d-flex align-items-center'>
                <div className='d-flex flex-column align-items-center w-100 orderListItem-actions-container'>
                    {/* <p className='m-0' style={{fontSize: '14px'}}>Actions</p> */}
                    <button className='border-0 bg-transparent' onClick={() => setIsMoreActionsOpen(prev => !prev)}><MdMoreVert className='text-muted' fontSize={25} /></button>
                    {isMoreActionsOpen && (
                        <div className='shadow orderListItem-actions rounded'>
                            <button className='d-flex align-items-center gap-2 border-0' onClick={() => navigate(`/admin/orders/${order._id}`)}><MdUnfoldMore fontSize={20} /> View more</button>
                            <button className='d-flex align-items-center gap-2 border-0'><MdRemoveRedEye fontSize={16} /> Add to watch list</button>
                        </div>
                    )}
                </div>
            </Col>
            <Col md={2} className='d-flex align-items-center'>
                <div className='d-flex flex-column justify-content-center align-items-center' style={{width: 'max-content'}}>
                    {order?.handledState.state === 'unhandled' ? (<MdInfoOutline className='text-warning' style={{fontSize: '30px'}} />) : order?.handledState.state === 'handled' ? (<MdOfflinePin className='text-primary' style={{fontSize: '30px'}} />) : (<MdCheckCircle className='text-success' style={{fontSize: '30px'}} />)}
                    
                    {order?.handledState.state === 'unhandled' && (<p className='text-warning m-0' style={{fontSize: '14px', fontWeight: 500}}>Not Handled</p>)}
                    {order?.handledState.state === 'handled' && (<p className='text-primary m-0' style={{fontSize: '14px', fontWeight: 500}}>Handled</p>)}
                    {order?.handledState.state === 'completed' &&  (<p className='text-success m-0' style={{fontSize: '14px', fontWeight: 500}}>Completed</p>)}
                </div>
            </Col>
        </Row>
    );
}

export default OrderListItem;