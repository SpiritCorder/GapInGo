import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadtCartItems} from '../../actions/cart';
import {Navigate, Link, useNavigate} from 'react-router-dom';
import {Row, Col, Card, ListGroup, Image, Button, Alert} from 'react-bootstrap';
import Loader from '../../components/Loader';
import CheckoutSteps from '../../components/CheckoutSteps';

const PlaceOrder = () => {

    const {paymentMethod, cartItems, shippingAddress, loading} = useSelector(state => state.cart);
    const {token} = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const [placing, setPlacing] = useState(false);
    const [placingSuccess, setPlacingSuccess] = useState(false);

    useEffect(() => {
        if(!cartItems[0].name) {
            dispatch(loadtCartItems());
        }
    }, [dispatch, cartItems]);

    const calculateIndividualProductPrice = (itemPrice, itemQty) => {
        let total = +(itemPrice) * (+itemQty);
        total = total.toFixed(2);
        return total;
    }

    const calculateTotalPrice = () => {
        let total = cartItems.reduce((acc, item) => (acc + (+item.price) * (+item.qty)) , 0);
        total = total.toFixed(2);
        return total;
    }

    const placeOrderHandler = async () => {
        // setPlacing(true);
        const order = {
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            total: calculateTotalPrice()
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(order)
            })

            const data = await res.json();
        
            if(!data.message) {
                // success
                // setPlacing(false);
                setPlacingSuccess(true);
                setTimeout(() => {
                    navigate(`/orders/${data._id}`);
                }, 3000);
            } else {
                // setPlacing(false);
            }
        } catch(err) {
            // setPlacing(false);
        }
    }

    return (
        !paymentMethod ? (<Navigate to='/payment?redirect=placeorder' />) :
        
        cartItems.length === 0 ? (
            <Row className='justify-content-center'>
                <Col md={12}>
                    <h4 className='text-center my-4'>No Items in the cart so can't place the order <Link to='/cart' className='btn btn-primary'>Go Back To Cart</Link></h4>
                </Col>
            </Row>
        ) : loading ? (<Loader />) :  (
            <>
            <Row>
                <Col>
                    <CheckoutSteps currentStep={3} step1 step2 step3 placingSuccess={placingSuccess} />
                </Col>  
            </Row>
            <Row className='justify-content-center'>
                <Col md={8}>
                    {placingSuccess && (<Alert variant='success'>Order Placed Successfully</Alert>)}
                    <h1 className='text-center my-4'>Place Order</h1>
                    <Card>
                        <ListGroup>
                        <ListGroup.Item>
                                    <Row className='text-center'>
                                        <Col className='text-center cart-description-title'>
                                            <strong>You are ordering {cartItems.reduce((acc, item) => (acc + (+item.qty)), 0)} total items</strong>                             
                                        </Col>
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
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item.id}>
                                        <Row>
                                            <Col className='text-center'>
                                                <Image src={item.image} alt='' fluid />
                                            </Col>
                                            <Col className='text-start'>{item.name}</Col>
                                            <Col className='text-center'>{`$${item.price}`}</Col>
                                            <Col className='text-center'>{item.qty}</Col>
                                            <Col className='text-center'>{`$${calculateIndividualProductPrice(item.price, item.qty)}`}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <Row>
                                        <Col className='d-flex justify-content-end'><h4>Total : </h4></Col>
                                        <Col className='d-flex justify-content-start'><h4>{`$${calculateTotalPrice()}`}</h4></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Payment Method :</Col>
                                        <Col>{paymentMethod}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping Address : </Col>
                                        <Col>{`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <Button 
                                                variant='dark' 
                                                type='button' 
                                                className={`btn-block ${placingSuccess ? 'success' : ''}`} 
                                                // style={{backgroundColor: '#66EF66', fontSize: '25px'}}
                                                onClick={placeOrderHandler}
                                                disabled={placingSuccess}
                                                id='place_order_btn'
                                            >
                                                {placingSuccess ? <i className="fa-solid fa-circle-check"></i> : 'Place Order'}
                                                {/* <i className="fa-solid fa-circle-check"></i> */}
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
        )
        
    );
}

export default PlaceOrder;