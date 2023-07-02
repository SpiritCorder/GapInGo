import {useEffect} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {Link, useNavigate} from 'react-router-dom';
// import {loadtCartItems, updateCartQuantity, removeFromCart} from '../../actions/cart';
// import Loader from '../../components/Loader';
// import {Row, Col, Image, ListGroup, Button, Card} from 'react-bootstrap';
import axios from 'axios';

const CartPage = () => {


    useEffect(() => {
        const createProduct = async () => {

            const body = {};

            try {
                const response = await axios.post('/api/admin/products', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': `Bearer tokenvalue`
                    }
                }, JSON.stringify(body));
            } catch (err) {
                console.log(err);
            }
        }
    }, []) 













    return (
        <>
        <h1>Cart Page</h1>
        <div class="parcels-widget-wrap">
            <iframe class="parcels-widget" style={{width: '600px', height: '600px'}} src="https://parcelsapp.com/widget" frameborder="no" seamless></iframe>
        </div>
        </>
    );

    // const navigate = useNavigate();
 

    // const updateCartQuantityHandler = (id, qty) => {
    //     dispatch(updateCartQuantity(id, qty));
    // }

    // const removeFromCartHandler = (id) => {
    //     dispatch(removeFromCart(id));
    // }

    // const calculateTotalPrice = () => {
    //     let total = cartItems.reduce((acc, item) => (acc + (+item.price) * (+item.qty)) , 0);
    //     total = total.toFixed(2);
    //     return total;
    // }

    // const calculateIndividualProductPrice = (itemPrice, itemQty) => {
    //     let total = +(itemPrice) * (+itemQty);
    //     total = total.toFixed(2);
    //     return total;
    // }

    // return (
    //     loading ? (<Loader />) : cartItems.length === 0 ? (<h3 className='text-center my-4'>No Cart Items <Link to='/' className='btn btn-secondary btn-sm'>Go Back</Link></h3>) : (
    //         <>
    //             <Row><h3 className='my-3'>Cart Items</h3></Row>
    //             <Row>
    //                 <Col md={8}>
    //                     <ListGroup variant='flush'>
    //                         {cartItems.map(item => (
    //                             <ListGroup.Item key={item.id} >
    //                                 <Row>
    //                                     <Col md={3} className='cartImageContainer'>
    //                                         <Image src={item.image} alt={item.name} fluid rounded  />
    //                                     </Col>
    //                                     <Col md={9}>
    //                                         <ListGroup.Item>
    //                                             <Row>
    //                                                 <Col>
    //                                                     Name :
    //                                                 </Col>
    //                                                 <Col>{item.name}</Col>
    //                                             </Row>
    //                                         </ListGroup.Item>
    //                                         <ListGroup.Item>
    //                                             <Row>
    //                                                 <Col>
    //                                                     Price :
    //                                                 </Col>
    //                                                 <Col>{`$${item.price}`}</Col>
    //                                             </Row>
    //                                         </ListGroup.Item>
    //                                         <ListGroup.Item>
    //                                             <Row>
    //                                                 <Col>
    //                                                     Selected Quantity :
    //                                                 </Col>
    //                                                 <Col>{item.qty}</Col>
    //                                             </Row>
    //                                         </ListGroup.Item>
    //                                         <ListGroup.Item>
    //                                             <Row>
    //                                                 <Col>Quantity : </Col>
    //                                                 <Col>
    //                                                     {item.stockCount > 0 && (
    //                                                         <select defaultValue={item.qty} onChange={e => updateCartQuantityHandler(item.id, e.target.value)}>
    //                                                             {Array.from({length: item.stockCount}, (i, j) => j+1).map(i => (
    //                                                                 <option key={i} value={i}>{i}</option>
    //                                                     ))}
    //                                                         </select>
    //                                                     )}
    //                                                 </Col>
    //                                             </Row>
    //                                         </ListGroup.Item>
    //                                         <ListGroup.Item>
    //                                             <Row>
    //                                                 <Col>Remove Item : </Col>
    //                                                 <Col>
    //                                                     <Button variant='dark' className='btn-sm' onClick={() => removeFromCartHandler(item.id)}>DELETE</Button>
    //                                                 </Col>
    //                                             </Row>
    //                                         </ListGroup.Item>
    //                                     </Col>
    //                                 </Row>
    //                             </ListGroup.Item>
    //                         ))}
    //                     </ListGroup>
    //                 </Col>
    //                 <Col md={4}>
    //                     <Card>
    //                         <ListGroup>
    //                             <ListGroup.Item>
    //                                 <Row className='text-center'>
    //                                     <Col className='text-center cart-description-title'>
    //                                         <strong>You are ordering {cartItems.reduce((acc, item) => (acc + (+item.qty)), 0)} total items</strong>                             
    //                                     </Col>
    //                                 </Row>
    //                             </ListGroup.Item>
    //                             <ListGroup.Item>
    //                                 <Row>
    //                                     <Col className='text-center'><b>Name</b></Col>
    //                                     <Col className='text-center'><b>Quantity</b></Col>
    //                                     <Col className='text-center'><b>Total Price</b></Col>
    //                                 </Row>
    //                             </ListGroup.Item>
    //                             {cartItems.map(item => (
    //                                 <ListGroup.Item key={item.id}>
    //                                     <Row>
    //                                         <Col className='text-start'>{item.name}</Col>
    //                                         <Col className='text-center'>{item.qty}</Col>
    //                                         <Col className='text-center'>{`$${calculateIndividualProductPrice(item.price, item.qty)}`}</Col>
    //                                     </Row>
    //                                 </ListGroup.Item>
    //                             ))}
    //                             <ListGroup.Item>
    //                                 <Row>
    //                                     <Col><h4>Total : </h4></Col>
    //                                     <Col><h4>{`$${calculateTotalPrice()}`}</h4></Col>
    //                                 </Row>
    //                             </ListGroup.Item>
    //                             <ListGroup.Item>
    //                                 <Row>
    //                                     <Col>
    //                                         <Button variant='dark' className='btn-block' onClick={() => navigate('/shipping')}>ORDER NOW</Button>
    //                                     </Col>
    //                                 </Row>
    //                             </ListGroup.Item>
    //                         </ListGroup>                                      
    //                     </Card>                                               
    //                 </Col>
    //             </Row>
    //         </>
    //     )
    // );
}

export default CartPage;