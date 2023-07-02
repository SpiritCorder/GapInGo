import {createPortal} from 'react-dom';
import {useState} from 'react';
import {useQuery} from 'react-query';
import {useNavigate, useParams, Navigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Row, Col, Badge} from 'react-bootstrap';
import Loader from '../../components/Loader';
import StatusProgress from './StatusProgress';
import OrderItem from './OrderItem';
import Overlay from '../../components/Overlay';

import {MdWest, MdCheckCircle, MdInfo, MdOutlineDangerous} from 'react-icons/md';
import {Country, State} from 'country-state-city';
import moment from 'moment';

import './styles/orderCancelPrompt.css';
import { toast } from 'react-toastify';

const getMyOrder = async (axiosPrivate, orderId) => {
    const response = await axiosPrivate.get(`/api/orders/${orderId}`);
    return response.data.order;
}

const OrderPage = () => {

    const [isOrderCancelPromptOpen, setIsOrderCancelModelOpen] = useState(false);

    const navigate = useNavigate();
    const {orderId} = useParams();
    const axiosPrivate = useAxiosPrivate();

    const {isLoading, isFetching, data:order, isError, refetch} = useQuery(['my-order', orderId], () => getMyOrder(axiosPrivate, orderId), {
        refetchOnWindowFocus: false
    });

    if(isLoading || isFetching) return <Loader />

    if(isError) {
        return <Navigate to='/my-orders' />
    }

    const getCountryName = (countryCode) => {
        return Country.getCountryByCode(countryCode).name;
    }

    const getStateName = (countryCode, stateCode) => {
        return State.getStateByCodeAndCountry(stateCode, countryCode).name;
    }

    const closeOrderCancelModel = () => setIsOrderCancelModelOpen(false)
    
    return (
        <>
            {isOrderCancelPromptOpen && createPortal(<Overlay closeModel={closeOrderCancelModel} />, document.getElementById('overlay'))}
            {isOrderCancelPromptOpen && createPortal(<OrderCancelPrompt closeModel={closeOrderCancelModel} orderId={order?._id} refetch={refetch} />, document.getElementById('portals'))}

            <Row>
                <Col md={12}><button className='btn bg-transparent d-flex align-items-center gap-2 text-muted border-0' onClick={() => navigate('/my-orders')} ><MdWest /> My orders</button></Col>
            </Row>

            <Row className='mt-3'>

                <Col md={8}>

                    <div className='w-100 shadow p-3'>

                        <Row>
                            <Col md={12}>
                                <p className='m-0' style={{fontSize: '18px', fontWeight: 500}}>Order Information</p>
                                <Row className='mt-3'>
                                    <Col md={3}><p className='m-0 text-muted'>Order Placed</p></Col>
                                    <Col md={9}><p className='m-0 text-muted d-flex align-items-center gap-3'>{new Date(order?.createdAt).toDateString()} <Badge bg='secondary'>{moment(order?.createdAt).format('hh:mm A')}</Badge></p></Col>
                                </Row>
                                <Row className='mt-1'>
                                    <Col md={3}><p className='m-0 text-muted'>Order Number</p></Col>
                                    <Col md={9}><p className='m-0 text-muted'>{order?.orderId}</p></Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-4'>
                            <Col md={12}>
                                <p className='m-0 mb-4' style={{fontSize: '18px', fontWeight: 500}}>Order Status</p>
                                <StatusProgress type='order_status' milestones={order?.orderMilestones} />
                            </Col>
                        </Row>

                        <Row className='mt-5'>
                            <Col md={12}>
                                <p className='m-0 mb-4' style={{fontSize: '18px', fontWeight: 500}}>Order Items</p>
                                {order.orderItems.map(item => (<OrderItem key={item._id} item={item} />))}
                            </Col>
                        </Row>

                    </div>

                </Col>

                <Col md={4}>

                    {order?.cancellationDetails.isCanceled && (
                        <>
                            <div className='w-100 shadow p-3 bg-danger mb-3'>
                                <div className='d-flex align-items-center gap-3'>
                                    <MdOutlineDangerous fontSize={30} className='text-white' />
                                    <p className='m-0 text-white' style={{fontSize: '16px', fontWeight: 500}}>Order has been canceled</p>
                                </div>
                            </div>
                        </>
                    )}
                    
                    <div className='w-100 shadow p-3'>
                        <div className='d-flex align-items-center gap-3'>
                            {order.paymentDetails?.isPaid ? (
                                <>
                                    <MdCheckCircle className='text-success' fontSize={30} />
                                    <span style={{fontSize: '18px'}}>Paid</span>
                                </>
                            ) : (
                                <>
                                    <MdInfo className='text-warning' fontSize={30} />
                                    <span style={{fontSize: '18px'}}>Payment Pending</span>
                                </>
                            )}  
                        </div>
                        <hr></hr>
                
                        <p className='m-0 text-muted' style={{fontSize: '16px', fontWeight: 500}}>Payment summary</p>
                        <Row className='mt-3'>
                            <Col sm={6}><p className='m-0 text-muted'>Subtotal</p></Col>
                            <Col sm={6}><p className='m-0 text-muted text-end' style={{fontSize: '14px'}}>USD ${(order.totalPrice - (order.shippingCost + order.taxPrice)).toFixed(2)}</p></Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col sm={6}><p className='m-0 text-muted'>Shipping</p></Col>
                            <Col sm={6}><p className='m-0 text-muted text-end' style={{fontSize: '14px'}}>{order.shippingCost > 0 ? `USD $${order.shippingCost.toFixed(2)}` : 'Free'}</p></Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col sm={6}><p className='m-0 text-muted'>Tax</p></Col>
                            <Col sm={6}><p className='m-0 text-muted text-end' style={{fontSize: '14px'}}>{order.taxPrice > 0 ? `USD $${order.taxPrice.toFixed(2)}` : 'Free'}</p></Col>
                        </Row>
                        <hr></hr>
                        <Row className='mt-2'>
                            <Col sm={6}><p className='m-0' style={{fontWeight: 700}}>Total</p></Col>
                            <Col sm={6}><p className='m-0 text-end' style={{fontWeight: 700}}>USD ${order.totalPrice.toFixed(2)}</p></Col>
                        </Row>
                    </div>

                    <div className='w-100 shadow mt-3 p-3'>
                        <p className='m-0' style={{fontSize: '16px', fontWeight: 500}}>Shipping Address</p>

                        <p className='m-0 mt-3 text-muted' style={{fontSize: '14px'}}>{order.shippingDetails?.name}</p>
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{order.shippingDetails?.address.addressLine1}, {order.shippingDetails?.address.city}</p>
                        {order.shippingDetails?.address.state && (<p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{getStateName(order.shippingDetails?.address.country, order.shippingDetails?.address.state)}</p>)}
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{order.shippingDetails?.address.postalCode}</p>
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{getCountryName(order.shippingDetails?.address.country)}</p>
                    
                    </div>

                    <div className='w-100 shadow mt-3 p-3'>
                        <p className='m-0' style={{fontSize: '16px', fontWeight: 500}}>Billing Address</p>

                        <p className='m-0 mt-3 text-muted' style={{fontSize: '14px'}}>{order.billingDetails?.name}</p>
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{order.billingDetails?.email}</p>
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{order.billingDetails?.address.addressLine1}, {order.billingDetails?.address.city}</p>
                        {order.billingDetails?.address.state && (<p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{getStateName(order.billingDetails?.address.country, order.billingDetails?.address.state)}</p>)}
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{order.billingDetails?.address.postalCode}</p>
                        <p className='m-0 mt-1 text-muted' style={{fontSize: '14px'}}>{getCountryName(order.billingDetails?.address.country)}</p>
                    
                    </div>

                    <div className='w-100 shadow mt-3 p-3'>
                        <p className='m-0 mb-4' style={{fontSize: '16px', fontWeight: 500}}>Order Actions</p>

                        {(new Date(order.createdAt).getTime() + 12 * 60 * 60 * 1000) >= new Date().getTime() && (
                            <button className='btn btn-outline-danger w-100 d-block' onClick={() => setIsOrderCancelModelOpen(true)} >Cancel Order</button>
                        )}
                        <button className='btn btn-outline-secondary d-block w-100 mt-2'>Email about the order</button>
                    </div>

                </Col>

            </Row>

        </>
    );
}

const OrderCancelPrompt = ({closeModel, orderId, refetch}) => {

    const axiosPrivate = useAxiosPrivate();

    const handleOrderCancel = async () => {
        alert(orderId);

        // try {
        //     await axiosPrivate.put(`/api/orders/cancel`, JSON.stringify({orderId}));
        //     toast.success('order cancelled');
        //      refetch();
        // } catch (err) {
        //     toast.error(err.response.data?.message);
        // }
    }

    return (
        <div className='orderCancelPrompt rounded'>
            <h2>Cancel Order</h2>
            <hr></hr>
            <p>Are you sure that you want to cancel this order?</p>
            <div className='d-flex align-items-center gap-2'>
                <button className='btn btn-primary btn-sm' onClick={handleOrderCancel} >Confirm</button>
                <button className='btn btn-danger btn-sm px-3' onClick={closeModel} >Cancel</button>
            </div>
        </div>
    );
}


export default OrderPage;