import {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {useSelector} from 'react-redux';
import {selectShipTo} from '../../app/slices/shipToSlice';
import {selectAuthUser, selectAccessToken} from '../../app/slices/authSlice';
import {useQuery} from 'react-query';
import {axiosPublic} from '../../config/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Row, Col, ListGroup, Tabs, Tab, Table, Spinner} from 'react-bootstrap';
import {useParams,Link, useNavigate} from 'react-router-dom'; 
import Rating from '../../components/Rating';
import Loader from '../../components/Loader';
import ProductImageSlider from '../../components/ProductImageSlider';
import ReactPlayer from 'react-player/youtube'
import {MdElectricalServices, MdKeyboardArrowDown} from 'react-icons/md';

import Overlay from '../../components/Overlay';
import ProductShippingMethodSelector from '../../components/ProductShippingMethodSelector';

import {toast} from 'react-toastify';

import './styles/productPage.css';

const ProductPage = () => {

    const shipTo = useSelector(selectShipTo);
    const authUser = useSelector(selectAuthUser);
    const accessToken = useSelector(selectAccessToken);
    const {id} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const {isLoading, isError, error} = useQuery(["single-product", id], () => {
        return axiosPublic.get(`/api/products/${id}`);
    }, {
        onSuccess: ({data:p}) => {
            setProduct(p);
            if(p.countryShippingDetails.find(c => c.isoCode === shipTo.isoCode)) {
                setShippingMethod(p.countryShippingDetails.find(c => c.isoCode === shipTo.isoCode)?.shippingMethods[0]);
            }
            
            if(p.title && p.variations?.values.length > 0) {
                // we have variations
                let priceAsce = [...p.variations.values];
                priceAsce = priceAsce.sort((a, b) => a.price - b.price);
                if(priceAsce[0].price === priceAsce[priceAsce.length - 1].price) {
                    setCurrentVariation({
                        price: `${priceAsce[0].price}`,
                        _id: ''
                    });
                } else {
                    setCurrentVariation({
                        price: `${priceAsce[0].price}  to  $${priceAsce[priceAsce.length - 1].price}`,
                        _id: ''
                    });
                }
            } else {
                setCurrentVariation({
                    price: p?.regularPrice,
                    qty: p?.regularQuantity,
                    _id: 1
                });
            }
        }
    });
    
    const [product, setProduct] = useState({});
    const [currentVariation, setCurrentVariation ] = useState(null);
    const [qty, setQty ] = useState(0);
    const [shippingMethod, setShippingMethod] = useState(null);
    const [isShippingMethodModelOpen, setIsShippingMethodModelOpen] = useState(false);
    const [buyItNowLoading, setBuyItNowLoading] = useState(false);

    useEffect(() => {
        if(product.countryShippingDetails && product.countryShippingDetails.find(c => c.isoCode === shipTo.isoCode)) {
            // update shippingMethod to new country's shipping method
            setShippingMethod(product.countryShippingDetails.find(c => c.isoCode === shipTo.isoCode)?.shippingMethods[0]);
        }
    }, [shipTo, product])

    // useEffect(() => {
    //     dispatch(loadSingleProduct(id));
    // }, [id, dispatch]);

    // useEffect(() => {
    //     if(product.title && product.variations?.values.length > 0) {
    //         // we have variations
    //         setCurrentVariation({
    //             price: `${product?.variations.values[0].price}  to  $${product?.variations.values[product?.variations.values.length - 1].price}`,
    //             _id: ''
    //         });
    //     } else {
    //         setCurrentVariation({
    //             price: product?.regularPrice,
    //             qty: product?.regularQuantity,
    //             _id: 1
    //         });
    //     }
    // }, [product]);

    const handleProductVariationChange = variationId => {
        const selected = product?.variations.values.find(v => v._id === variationId);

        setQty(0);
        if(selected) {
            setCurrentVariation(selected)
        } else {
            setCurrentVariation({
                price: `${product?.variations.values[0].price}  to  $${product?.variations.values[product?.variations.values.length - 1].price}`,
                _id: ''
            });
        }
        
    }

    const handleQuantitySelected = (type) => {
        if(!currentVariation || currentVariation._id === '') {
            return;
        }

        if(type === 'increment' && currentVariation?.qty > qty) {
            setQty(prev => prev + 1);
            return;
        }
        
        if(type === 'decrement' && qty > 0) {
            setQty(prev => prev - 1);
            return;
        }
    }

    const closeShippingMethodModel = () => {
        setIsShippingMethodModelOpen(false);
    }

    const handleBuyItNow = async () => {
        setBuyItNowLoading(true);

        if(+qty <= 0) {
            setBuyItNowLoading(false);
            return toast.error('please select a quantity');
        }

        // check for authentication
        if(!authUser || !accessToken) {
            setBuyItNowLoading(false);
            return navigate('/login');
        }

        // check for email is verified or not
        if(!authUser.isEmailVerified) {
            setBuyItNowLoading(false);
            toast.error('Please verify your email address in order to purchase');
            navigate('/my-profile');
            return;
        }

        const orderDetails = {
            productId: product._id,
            qty: +qty,
            shippingMethod,
            shipToCountry: shipTo.isoCode
        }

        if(product.variations.values.length > 0) {
            orderDetails.variationId = currentVariation._id;
        }

        try {
            const response = await axiosPrivate.post('/api/checkout/buy-it-now', JSON.stringify(orderDetails));
            setBuyItNowLoading(false);
            window.location.href = response.data.url;
        } catch (err) {
            console.log(err);
            setBuyItNowLoading(false);
            toast.error(err.response.data?.message)
        }
    }

    // const addToCartHandler = () => {
    //     dispatch(addToCart({id, qty}));
    // }

    if(isLoading) {
        return <Loader />
    }

    if(isError) {
        return <p>{error.message}</p>
    }

    return (
        product.title && ( 
            <>
                {isShippingMethodModelOpen && createPortal(<Overlay closeModel={closeShippingMethodModel} />, document.getElementById('overlay'))}
                {isShippingMethodModelOpen && createPortal(<ProductShippingMethodSelector isoCode={shipTo.isoCode} countryShippingDetails={product.countryShippingDetails} currentMethod={shippingMethod} setShippingMethod={setShippingMethod} closeModel={closeShippingMethodModel} />, document.getElementById('portals'))}
                <Link to='/' className='btn btn-light my-3'>
                    Go Back
                </Link>
                
                <Row>
                    <Col md={6}>
                        {/* <Image src={product.image} alt={product.name} fluid /> */}
                        <ProductImageSlider images={product?.images} currentVariationImage={currentVariation} />
                    </Col>
                    <Col md={6} className='productPage-details-container'>
                        <ListGroup variant='flush'>

                            <ListGroup.Item>
                                <h3 className='productPage-details-title'>{product?.title}</h3>
                                <h5 className='productPage-details-subtitle'>{product?.subTitle}</h5>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <div className='d-flex flex-column gap-3 py-1'>
                                    <h6 className='productPage-details-condition'>Condition: <span>{product?.condition}</span></h6>
                                    {product?.variations?.values.length > 0 && (
                                        
                                        <div className='d-flex gap-4'>
                                            <label className='productPage-details-variation-label'>{product?.variations.name}:</label>
                                            <select className='productPage-details-variation-select' value={currentVariation?._id} onChange={e => handleProductVariationChange(e.target.value)}>
                                                <option value=''>--select {product?.variations.name}--</option>
                                                {product?.variations.values.map(v => (
                                                    <option key={v._id} value={v._id}>{v.val}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div>
                                        <div className='d-flex align-items-center gap-3'>
                                            <label>Quantity: </label>
                                            <div className='d-flex aling-items-center productPage-details-quantity'>
                                                <button onClick={() => handleQuantitySelected('decrement')}>-</button>
                                                <p>{qty}</p>
                                                <button onClick={() => handleQuantitySelected('increment')}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <div className='d-flex justify-content-between py-3'>
                                    <div>
                                        <label className='mb-1'  style={{fontSize: '18px', fontWeight: 500}}>Price :</label>
                                        <h4 className='align-self-start'>{`$${currentVariation?.price}`}</h4>                                                    
                                    </div>
                                    <div className='d-flex flex-column gap-3'>
                                        {product.shippingCountries.find(c => c.isoCode === shipTo.isoCode) ? (
                                            <>
                                                <button className='btn btn-primary btn-rounded px-5 btn-buy-it-now d-flex align-items-center gap-2' disabled={currentVariation._id === '' || buyItNowLoading} onClick={handleBuyItNow}>{buyItNowLoading ? 
                                                    (
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                            processing...
                                                        </>
                                                    ) 
                                                    : 
                                                        'Buy It Now'
                                                    }
                                                </button>
                                                <button className='btn btn-info btn-rounded px-5 btn-add-to-cart'>Add To Cart</button>
                                            </>
                                        ) : (
                                            <p>This product does not ship to {shipTo.country}</p>
                                        )}
                                        
                                    </div>
                                </div>
                            </ListGroup.Item>

                            {/* Shipping Details */}
                            <ListGroup.Item>
                                {product.countryShippingDetails.find(c => c.isoCode === shipTo.isoCode) ? (
                                    <div>
                                        <label className='mb-2' style={{fontSize: '16px', fontWeight: 500}}>Shipping Details</label>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <p className='m-0 text-muted'  style={{fontSize: '14px', fontWeight: 400}}>{shippingMethod?.method}</p>
                                                {shippingMethod?.isFreeShipping ? (
                                                    <strong  style={{fontSize: '12px', margin: 0}}>Free Shipping</strong>
                                                ) : (
                                                    <>
                                                        <strong style={{fontSize: '12px', margin: 0}}>${shippingMethod?.shippingPrice.toFixed(2)}</strong>
                                                        {shippingMethod?.additionalShippingPrice > 0 && <strong style={{fontSize: '11px', margin: 0, marginLeft: '5px'}}>(${shippingMethod?.additionalShippingPrice.toFixed(2)} for each additional quantity)</strong>}
                                                    </>
                                                )}
                                            </div>
                                            <button className='align-self-end bg-transparent border-0 d-flex align-items-center gap-1 text-primary' style={{fontSize: '13px'}} onClick={() => setIsShippingMethodModelOpen(true)} >More Options <MdKeyboardArrowDown style={{fontSize: '16px'}} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Shipping not available to {shipTo.country}</p>
                                )}
                            </ListGroup.Item>

                            {/* Returns Details */}
                            <ListGroup.Item>
                                <label className='mb-2' style={{fontSize: '16px', fontWeight: 500}}>Returns</label>
                                <div>
                                    <p className='m-0 text-muted'  style={{fontSize: '14px', fontWeight: 400}}>{product.returns.type === 'not-accepted' ? 'Returns not accepted by the seller' : product.returns.type === 'accepted-within-7-days' ? 'Returns accepted within 7 days' : 'Returns accepted within 15 days'}</p>
                                    {product.returns.type !== 'not-accepted' && <strong style={{fontSize: '12px', margin: 0}}>{product.returns.returnShippingCostPaidBy === 'buyer' ? 'Return shipping cost must be paid by buyer' : 'Return shipping cost will be paid by seller'}</strong>}
                                </div>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Rating rating={product?.rating} reviews={product?.numReviews} />
                            </ListGroup.Item>
                            
                            {/* <ListGroup.Item>
                                Description : {product?.aboutDescription}
                            </ListGroup.Item> */}

                        </ListGroup>

                    </Col>
                   
                </Row>

                <Row className='py-5'>
                    <Col>
                        <Tabs
                            defaultActiveKey="description"
                            id="uncontrolled-tab-example"
                            className="w-100 productPage-tab-content"
                        >
                            <Tab eventKey="description" title="Description">
                                <div className='productPage-detailed-desc-specifications'>
                                    <h3 className='productPage-detailed-desc-specifications-title'>Item specifics</h3>
                                    <div className='d-flex align-items-start gap-3'>
                                        <Table striped bordered hover size="sm" style={{width: '50%'}}>
                                            <tbody>
                                                {Object.entries(product.recommendedSpecifications).map(e => (
                                                    <tr key={e[0]}>
                                                        <td style={{width: '50%'}}>{e[0]}</td>
                                                        <td style={{width: '50%'}}>{e[1]}</td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </Table>
                                        <Table striped bordered hover size="sm" style={{width: '50%'}}>
                                            <tbody>
                                                {product.customSpecifications.length > 0 && product.customSpecifications.map(s => (
                                                    <tr key={s._id}>
                                                        <td style={{width: '50%'}}>{s.name}</td>
                                                        <td style={{width: '50%'}}>{s.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>

                                <h1 className='productPage-detailed-desc-title'>{product?.title}</h1>
                                <div className='video-output-container my-4'>  
                                    <ReactPlayer 
                                        url={product?.videoUrl} 
                                        controls     
                                    />
                                </div>
                                <div className='productPage-detailed-desc' dangerouslySetInnerHTML={{__html: product?.detailedDescription}}>

                                </div>
                            </Tab>

                            <Tab eventKey="shipping" title="Shipping Details">
                                Shipping
                            </Tab>

                            <Tab eventKey="reviews" title="Reviews">
                                Reviews
                            </Tab>

                        </Tabs>
                    </Col>
                </Row>
            </>
        )
    );
}

export default ProductPage;