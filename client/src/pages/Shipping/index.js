import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addShippingAddress} from '../../actions/cart'
import {useNavigate, useLocation} from 'react-router-dom';
import {Row, Col, Form, Button, Alert} from 'react-bootstrap';
import CheckoutSteps from '../../components/CheckoutSteps';

const ShippingPage = () => {

    const dispatch = useDispatch();
    const {shippingAddress} = useSelector(state => state.cart);
    const navigate = useNavigate();
    const {search} = useLocation();

    const [address, setAddress] = useState(shippingAddress ? shippingAddress.address : '');
    const [city, setCity] = useState(shippingAddress ? shippingAddress.city : '');
    const [postalCode, setPostalCode] = useState(shippingAddress ? shippingAddress.postalCode : '');
    const [country, setCountry] = useState(shippingAddress ? shippingAddress.country : '');
    const [isRedirected, setIsRedirected] = useState(search ? search.split('=')[1] : '');

    useEffect(() => {
        if(isRedirected) {
            setTimeout(() => {
                setIsRedirected('');
            }, 4000)
        }
    }, [isRedirected])

    const addShippingAddressHandler = e => {
        e.preventDefault();

        const newShippingAddress = {
            address,
            city,
            postalCode,
            country
        }

        dispatch(addShippingAddress(newShippingAddress));
        navigate('/payment');
    }

    return (
        <>
            <Row>
                <Col>
                    <CheckoutSteps currentStep={1} step1 />
                </Col>  
            </Row>
            <Row className='justify-content-center'>
                <Col md={6}>
                    {isRedirected && (<Alert variant='danger'>Please Enter a Shipiing Address</Alert>)}
                    <h1 className='my-4'>Shipping</h1>
                    <Form onSubmit={addShippingAddressHandler}>
                        <Form.Group className='mb-4'>
                            <Form.Label>Address : </Form.Label>
                            <Form.Control type='text' placeholder='Enter shipping address...' value={address} onChange={e => setAddress(e.target.value)} ></Form.Control>
                        </Form.Group>
                        <Form.Group className='mb-4'>
                            <Form.Label>City : </Form.Label>
                            <Form.Control type='text' placeholder='Enter city...' value={city} onChange={e => setCity(e.target.value)} ></Form.Control>
                        </Form.Group>
                        <Form.Group className='mb-4'>
                            <Form.Label>Postal Code : </Form.Label>
                            <Form.Control type='text' placeholder='Enter postal code...' value={postalCode} onChange={e => setPostalCode(e.target.value)} ></Form.Control>
                        </Form.Group>
                        <Form.Group className='mb-4'>
                            <Form.Label>Country : </Form.Label>
                            <Form.Control type='text' placeholder='Enter country...' value={country} onChange={e => setCountry(e.target.value)} ></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='dark'>Continue</Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default ShippingPage;