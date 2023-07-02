import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadTopRatedProducts} from '../../actions/product';
import {Link} from 'react-router-dom';
import {Carousel, Image} from 'react-bootstrap';
import Loader from '../Loader';
import './styles/topProductsCarousel.css';

const TopProductsCarousel = () => {

    const dispatch = useDispatch();

    const {loading, products, error} = useSelector(state => state.topratedProducts);

    useEffect(() => {
        dispatch(loadTopRatedProducts());
    }, [dispatch]);

    return (
        <>
            <Carousel pause='hover' className='bg-dark my-4 mb-5'>
                {products.map(product => (
                    <Carousel.Item key={product._id}>
                        <Link to={`/products/${product._id}`}>
                            {/* <Image src={product.image} alt={product.name} fluid /> */}
                            <img
                                className='d-block 2-100'
                                src={product.image}
                                alt={product.name}
                            />
                            <Carousel.Caption className='carousel-caption'>
                                <h2>{product.name} ({product.price})</h2>
                            </Carousel.Caption>
                        </Link>
                    </Carousel.Item>
                ))}
            </Carousel>
        </>
    );
}

export default TopProductsCarousel;