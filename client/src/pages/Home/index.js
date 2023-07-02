import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectShipTo} from '../../app/slices/shipToSlice';
import {useQuery} from 'react-query';
import {useParams} from 'react-router-dom';
import {axiosPublic} from '../../config/axios';

import Product from '../../components/Product';
import {Row, Col} from 'react-bootstrap';
import Loader from '../../components/Loader';
// import TopProductsCarousel from '../../components/TopProductsCarousel';

const HomePage = () => {

    const {keyword} = useParams();
    const shipTo = useSelector(selectShipTo);

    const {isLoading, data, isError, error, refetch} = useQuery("product-list", () => {
        return axiosPublic.get(`/api/products/country/${shipTo.isoCode}`);
    });

    useEffect(() => {
        refetch();
    }, [shipTo, refetch])

    if(isLoading) {
        return <Loader />
    }

    if(isError) {
        return <p>{error.message}</p>
    }

    return (
        (
            <>
                {/* {!keyword && (
                    <Row className='my-5'>
                        <Col>
                            <h1>Top Rated Products</h1>
                            <TopProductsCarousel />
                        </Col>
                    </Row>
                )} */}
                <div className='mt-5' style={{width: '100%', height: '320px', backgroundColor: '#333'}}>

                </div>
                {data.data.length === 0 && (
                    <Row className='my-5'>
                        <Col>
                            <h3 className='text-center'>No products available for shipping to {shipTo.country}</h3>
                        </Col>
                    </Row>
                )}
                <Row className='my-5'>
                    {data.data.length > 0 && data.data.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={4} className='my-3'>
                            <Product p={product} />
                        </Col>
                    ))}
                </Row>
            </>
        )
    );
}

export default HomePage;