
import {useQuery} from 'react-query';
import {useSearchParams, useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Row, Col, ListGroup, Image} from 'react-bootstrap';
import {MdCheckCircle, MdShoppingCart} from 'react-icons/md';
import Loader from '../../components/Loader';

const CheckoutPaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const {isLoading, data, isError} = useQuery('checkout-session-success', () => {
        return axiosPrivate.get(`/api/checkout/success?session_id=${sessionId}`);
    });

    if(isLoading) {
        return <Loader />
    }

    if(isError) {
        return navigate('/');
    }

    console.log(data.data);

    return (
        <>
            <Row className='py-5'>
                <Col md={12}>
                    <h1 className='m-0 d-flex align-items-center gap-3'>Thank you for purchasing! <span><MdCheckCircle style={{color: '#5cb85c'}} /></span></h1>
                </Col>
            </Row>

            <Row>
                
                <Col md={7}>
                    <ListGroup>
                        <ListGroup.Item>
                            <Row className='px-3'>
                                <Col md={12}>
                                    <h3 className='m-0'>Order Items</h3>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        {data.data.checkoutSessionInfo.orderItems.map(item => (
                            <ListGroup.Item key={item.id}>
                                <Row className='p-3'>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid width={100} />
                                    </Col>
                                    <Col md={10}>
                                        <h2 style={{fontSize: '18px'}}>{item.name}</h2>
                                        {item.description && <p className='m-0 text-muted mb-2'>{item.description}</p>}
                                        <p className='m-0 text-muted' style={{fontWeight: 500}} >Item Price : ${item.unitPrice}</p>
                                        <p className='m-0 text-muted' style={{fontWeight: 500}} >Quantity: {item.quantity}</p>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

            </Row>

            <Row className='py-3'>
                <Col md={12}>
                    <button className='btn btn-primary d-flex align-items-center gap-2' onClick={() => navigate('/')}>Continue Shopping <MdShoppingCart /></button>
                </Col>
            </Row>
        </>
    );
}

export default CheckoutPaymentSuccess;