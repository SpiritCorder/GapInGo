import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderState, updateOrderPayment, stripeCheckout} from '../../actions/order';
import {useParams} from 'react-router-dom';
import {Row, Col, ListGroup, Card,  Image, Alert, Button} from 'react-bootstrap';
import Loader from '../../components/Loader';
import { PayPalButton } from "react-paypal-button-v2";

const OrderStatus = () => {

    const {id} = useParams();
    
    const dispatch = useDispatch();
    const {loading, order, error, paymentLoading, paymentSuccess, paymentMethod} = useSelector(state => state.orderState);

    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {

        const establishPaypalSdk = async () => {
            const res = await fetch('/api/config/paypal');
            const clientId = await res.json();
            
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            }
            document.body.appendChild(script);
        }

        if(order && !order.isPaid) {
            if(!window.paypal) {
                establishPaypalSdk();
            } else {
                setSdkReady(true);
            }
        }

        if(!order || paymentSuccess || order._id !== id) {
            dispatch(getOrderState(id))
        }
    }, [dispatch, id, order, paymentSuccess]);

    const calculateIndividualProductPrice = (itemPrice, itemQty) => {
        let total = +(itemPrice) * (+itemQty);
        total = total.toFixed(2);
        return total;
    }

    const calculateTotalPrice = () => {
        let total = order.orderItems.reduce((acc, item) => (acc + (+item.price) * (+item.qty)) , 0);
        total = total.toFixed(2);
        return total;
    }

    const orderPaymentHandler = (paymentResult) => {
        dispatch(updateOrderPayment(id, paymentResult));
    }

    const stripeCheckoutHandler = () => {
        dispatch(stripeCheckout(order._id));
    }

    return (
        loading ? (<Loader />) : error ? (<Alert variant='danger'>{error}</Alert>) : (
            <>
                <Row>
                    <Col><h1 className='text-center mb-4 mt-2'>Order State</h1></Col>
                </Row>
               <Row>
                    <Col md={8}>
                        <Card>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Order Id : </strong></Col>
                                        <Col>{order._id}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Name : </strong></Col>
                                        <Col>{order.user.name}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Email : </strong></Col>
                                        <Col>{order.user.email}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Payment Method :</strong></Col>
                                            <Col>{order.paymentMethod}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Shipping Address : </strong> </Col>
                                            <Col>{`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Payment Status : </strong></Col>
                                            <Col>
                                                <Alert variant={`${order.isPaid ? 'success' : 'danger'}`}>{order.isPaid ? 'Paid' : 'Not Paid'}</Alert>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Deliever Status : </strong></Col>
                                            <Col>
                                                <Alert variant={`${order.isDeliverd ? 'success' : 'danger'}`}>{order.isDeliverd ? 'Deliverd' : 'Not Deliverd'}</Alert>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><h4 className='text-center mt-1'>Order Items</h4></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col className='text-center'>Image</Col>
                                            <Col className='text-center'>Name</Col>
                                            <Col className='text-center'>Unit Price</Col>
                                            <Col className='text-center'>Quantity</Col>
                                            <Col className='text-center'>Total</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {order.orderItems.map(item => (
                                        <ListGroup.Item key={item.product._id}>
                                            <Row>
                                                <Col className='text-center'>
                                                    <Image src={item.product.image} alt='' fluid />
                                                </Col>
                                                <Col className='text-start'>{item.product.name}</Col>
                                                <Col className='text-center'>{`$${item.price}`}</Col>
                                                <Col className='text-center'>{item.qty}</Col>
                                                <Col className='text-center'>{`$${calculateIndividualProductPrice(item.price, item.qty)}`}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Row>
                            <Col>
                                <Card>
                                    <ListGroup>
                                        <ListGroup.Item>
                                            <Row className='text-center'>
                                                <Col className='text-center cart-description-title'>
                                                    <strong>You are ordering {order.orderItems.reduce((acc, item) => (acc + (+item.qty)), 0)} total items</strong>                             
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><h6>Shipping Cost: </h6></Col>
                                                <Col><h6>$0.0</h6></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><h6>Tax: </h6></Col>
                                                <Col><h6>$0.0</h6></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><h4>Total : </h4></Col>
                                                <Col><h4>{`$${calculateTotalPrice()}`}</h4></Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <Row className='my-4'>
                            <Col>
                                <ListGroup>
                                
                                    {!order.isPaid && order.paymentMethod === 'Stripe' && (
                                        <>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <p className='text-center mt-1 mb-1' style={{fontSize: '20px'}}><i className="fa-brands fa-paypal mr-2" style={{color: '#3b7bbf'}}></i>Pay Now</p>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col className='text-center'>
                                                        <Button variant="dark" onClick={stripeCheckoutHandler}>Checkout</Button>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </>
                                    )}


                                    {!order.isPaid && !paymentLoading && sdkReady && order.paymentMethod === 'Paypal' && (
                                        <>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <p className='text-center mt-1 mb-1' style={{fontSize: '20px'}}><i className="fa-brands fa-paypal mr-2" style={{color: '#3b7bbf'}}></i>Pay Now</p>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <PayPalButton
                                                            amount={order.totalPrice}
                                                            onSuccess={orderPaymentHandler}
                                                        />
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </>
                                    )}
                                    {paymentLoading && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                    <p className='text-center'>Loading...</p>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row> 
            </>
        )
    );
}

export default OrderStatus;