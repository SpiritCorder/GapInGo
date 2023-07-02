import {useState} from 'react';
import {useQuery} from 'react-query';
import {useNavigate, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import {Row, Col, Badge} from 'react-bootstrap';
import Loader from '../../../components/Loader';
import StatusProgress from '../../Order/StatusProgress';
import OrderItem from './OrderItem';

import {toast} from 'react-toastify';
import {Country, State} from 'country-state-city';
import moment from 'moment';

import {MdWest, MdCheckCircle, MdInfo, MdMoreVert, MdOutlineErrorOutline, MdOutlineDangerous, MdOfflinePin} from 'react-icons/md';

import './styles/adminOrderPage.css';

const getOrder = async (axiosPrivate, orderId) => {
    const response = await axiosPrivate.get(`/api/admin/orders/${orderId}`);
    return response.data.order;
}

const AdminOrderPage = () => {

    const [isHandledOptionsOpen, setIsHandledOptionsOpen] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const {orderId} = useParams();

    const {isLoading, isFetching, isError, error, data:order, refetch} = useQuery('admin-order-view', () => getOrder(axiosPrivate, orderId), {
        refetchOnWindowFocus: false
    });

    if(isLoading || isFetching) return <Loader />;

    if(isError) {
        toast.error(error?.message);
        return navigate('/admin/orders');
    }

    const getCountryName = (countryCode) => {
        return Country.getCountryByCode(countryCode).name;
    }

    const getStateName = (countryCode, stateCode) => {
        return State.getStateByCodeAndCountry(stateCode, countryCode).name;
    }

    const updateHandledStatus = async (status) => {
        try {
            await axiosPrivate.put('/api/admin/orders/update/handled-status', JSON.stringify({orderId: order._id, handledStatus: status}));
            toast.success('order handled status updated');
            refetch();
        } catch (err) {
            toast.error(err.response.data?.message)
        }
    }

    console.log(order);

    return (
        <>
            <Row>
                <Col md={12}><button className='btn bg-transparent d-flex align-items-center gap-2 text-muted border-0' onClick={() => navigate('/admin/orders')} ><MdWest />Orders</button></Col>
            </Row>

            {order._id && (
                <Row className='mt-3'>

                    <Col md={8}>
                        <div className='w-100 shadow p-3 position-relative'>

                            <div className='adminOrderPage-handleStatus'>
                                <button className='bg-transparent shadow' onClick={() => setIsHandledOptionsOpen(prev => !prev)} ><MdMoreVert fontSize={20} /></button>
                                {isHandledOptionsOpen && (
                                    <div className='shadow d-flex flex-column'>
                                        <button className='border-0 px-3 py-2' disabled={order?.handledState.state === 'unhandled'} onClick={() => updateHandledStatus('unhandled')} >mark as unhandled</button>
                                        <button className='border-0 px-3 py-2' disabled={order?.handledState.state === 'handled'} onClick={() => updateHandledStatus('handled')}>mark as handled</button>
                                        <button className='border-0 px-3 py-2' disabled={order?.handledState.state === 'completed'} onClick={() => updateHandledStatus('completed')}>mark as completed</button>
                                    </div>
                                )}
                            </div>

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
                                    {order?.orderItems.map(item => (<OrderItem key={item._id} item={item} orderId={order._id} refetch={refetch} />))}
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
                        

                        <div className={`w-100 shadow p-3 ${order?.handledState.state === 'unhandled' ? 'bg-warning' : order?.handledState.state === 'handled' ? 'bg-primary' : 'bg-success'}`}>
                            <div className='d-flex align-items-center gap-3'>
                                {order?.handledState.state === 'unhandled' ? (<MdOutlineErrorOutline fontSize={30} className='text-white' />) : order?.handledState.state === 'handled' ? (<MdOfflinePin fontSize={30} className='text-white' />) : (<MdCheckCircle fontSize={30} className='text-white' />)}
                                <p className='m-0 text-white' style={{fontSize: '16px', fontWeight: 500}}>{order?.handledState.state === 'unhandled' ? 'Not Handled' : order?.handledState.state === 'handled' ? 'Handled' : 'Completed'}</p>
                            </div>
                        </div>

                        <div className='w-100 shadow p-3 mt-3'>
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
                            <p className='m-0' style={{fontSize: '16px', fontWeight: 500}}>Customer Details</p>

                            <p className='m-0 mt-3' style={{fontSize: '14px'}}>Customer ID</p>
                            <p className='m-0 text-muted' style={{fontSize: '14px'}}>100</p>

                            <p className='m-0 mt-2' style={{fontSize: '14px'}}>Customer Name</p>
                            <p className='m-0 text-muted' style={{fontSize: '14px'}}>{`${order?.customer.firstName} ${order?.customer.lastName}`}</p>

                            <p className='m-0 mt-2' style={{fontSize: '14px'}}>Customer Email</p>
                            <p className='m-0 text-muted' style={{fontSize: '14px'}}>{order?.customer.email}</p>

                            <p className='m-0 mt-2' style={{fontSize: '14px'}}>Customer Phone</p>
                            <p className='m-0 text-muted d-flex align-items-center gap-2' style={{fontSize: '14px'}}>{order?.customer.phone.regular} <span>or</span> {order?.customer.phone.international}</p>
                            {/* <p className='m-0 text-muted' style={{fontSize: '14px'}}>{order?.customer.phone.international}</p> */}

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
                            <p className='m-0 mb-3' style={{fontSize: '16px', fontWeight: 500}}>Order Actions</p>

                            <button className='btn btn-outline-dark btn-block w-100'>Add to Watch List</button>
                            <button className='btn btn-outline-primary btn-block w-100 mt-2'>Refund</button>
                            <button className='btn btn-outline-secondary btn-block w-100 mt-2'>Send Email to Customer</button>
                        
                        </div>

                    </Col>
                </Row>
            )}

            
        </>
    );
}

export default AdminOrderPage;