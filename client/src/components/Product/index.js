import {useState, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Rating from '../Rating';
import {Card, Carousel} from 'react-bootstrap';

const Product = ({p}) => {

    const navigate = useNavigate();

    const [index, setIndex] = useState(0);

    // carousel handler
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const calculateProductPrice = useCallback(() => {
        if(p.variations.values.length > 0) {
            // the product has variations, so price will be displayed as a range
            const sortedItems = p.variations.values.sort((a, b) => a.price - b.price);
            if(sortedItems[0].price === sortedItems[sortedItems.length - 1].price) {
                return `$${sortedItems[0].price.toFixed(2)}`;
            }
            return `$${sortedItems[0].price.toFixed(2)} to $${sortedItems[sortedItems.length - 1].price.toFixed(2)}`;
        } else {
            // the product has no variations, just return the regular price
            return `$${p.regularPrice.toFixed(2)}`;
        }
    }, [p])

    return (
            <Card style={{ width: '22rem' }}>
                {/* <Link to={`/products/${p._id}`}> */}
                    <Carousel activeIndex={index} onSelect={handleSelect}>
                        {p.images.slice(0, 3).map(item => (
                            <Carousel.Item key={item.fileName}>
                                <img
                                    className="d-block w-100"
                                    src={item.url}
                                    alt={item.fileName}
                                />
                                {/* <Carousel.Caption>
                                <h3>First slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                </Carousel.Caption> */}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    {/* <Card.Img variant="top" src={p.images[0].url} alt={p.images[0].fileName} /> */}
                {/* </Link> */}
                <Card.Body>
                    <Link to={`/products/${p._id}`}>
                        <Card.Title>{p.title}</Card.Title>
                    </Link>
                    <Card.Text as='div'>
                        <Rating rating={p.rating} reviews={`${p.numReviews} reviews`} />
                    </Card.Text>
                    <Card.Text as='h3' className='product_price'>
                        {calculateProductPrice()}
                    </Card.Text>
                    {/* <Button variant="primary" onClick={() => window.location.href = `/products/${p._id}`}>View More</Button> */}
                    <button onClick={() => navigate(`/products/${p._id}`)} className='btn btn-primary d-flex align-items-center gap-2'>View More<i className='fa-solid fa-chevron-right ml-2'></i></button>
                </Card.Body>
            </Card>
    );
}

export default Product;