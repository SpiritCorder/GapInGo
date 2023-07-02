import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addPaymentMethod} from '../../actions/cart';
import {useNavigate, useLocation, Navigate} from 'react-router-dom';
import {Row, Col, Form, Button, Alert} from 'react-bootstrap';
import CheckoutSteps from '../../components/CheckoutSteps';

const PaymentPage = () => {

    const {search} = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {paymentMethod, shippingAddress} = useSelector(state => state.cart);

    const [newPaymentMethod, setNewPaymentMethod] = useState(paymentMethod ? paymentMethod : 'Paypal');
    const [isRedirected, setIsRedirected] = useState(search ? search.split('=')[1] : '');

    useEffect(() => {
        if(isRedirected) {
            setTimeout(() => {
                setIsRedirected('');
            }, 4000);
        }
    }, [isRedirected]);

    const addPaymentMethodHandler = e => {
        e.preventDefault();

        dispatch(addPaymentMethod(newPaymentMethod));
        navigate('/placeorder');
    }

    return (
        !shippingAddress ? (<Navigate to='/shipping?redirect=payment' />) :
        <>
            <Row>
                <Col>
                    <CheckoutSteps currentStep={2} step1 step2 />
                </Col>  
            </Row>
            <Row className='justify-content-center'>
                <Col md={6}>
                    {isRedirected && (<Alert variant='danger'>Please Select a Payment Method</Alert>)}
                    <h1 className='my-4'>Select Payment Method</h1>
                    <Form onSubmit={addPaymentMethodHandler}>
                        <Form.Group>
                            <Form.Label as='legend'>Payment Method</Form.Label>
                        </Form.Group>
                        <Form.Check 
                            type='radio' 
                            label='Paypal or Credit or Debit Card' 
                            name='paymentMethod' 
                            value='Paypal' 
                            checked={newPaymentMethod === 'Paypal'} 
                            onChange={e => setNewPaymentMethod(e.target.value)}
                            className='my-4'
                        ></Form.Check>
                        <Form.Check 
                            type='radio' 
                            label='Stripe' 
                            name='paymentMethod' 
                            value='Stripe' 
                            checked={newPaymentMethod === 'Stripe'}
                            onChange={e => setNewPaymentMethod(e.target.value)}
                            className='my-4'
                        ></Form.Check>
                        <Button type='submit' variant='dark'>Continue</Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default PaymentPage;