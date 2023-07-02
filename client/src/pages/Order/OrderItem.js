
import {Row, Col, Image, Badge, Alert, ListGroup} from 'react-bootstrap';
import StatusProgress from './StatusProgress';

import {MdInfo} from 'react-icons/md';

const OrderItem = ({item}) => {

    const itemMilestone = () => {
        switch(item.milestones[item.milestones.length - 1].milestone) {
            case 'item_payment_pending':
                return 'This item payment is still pending';
            case 'item_paid':
                return 'This item has been paid successfully';
            case 'item_shipped':
                return 'This item has been shipped';
            case 'item_delivered':
                return 'This item has been delivered successfully';
            default:
                return;
        }
    }

    return (

        <ListGroup className='mb-5'>
            <ListGroup.Item className='p-3'>
                <Row>

                    <Col md={3}>
                        <Image src={item.productInfo?.image} alt={item._id} fluid width='90%' />
                    </Col>

                    <Col md={9}>
                        <p className='m-0' style={{fontSize:'17px', fontWeight: 400}}>{item.productInfo?.title}</p>
                        {item.productInfo?.description && (<p className='m-0 text-muted mt-1' style={{fontSize:'14px'}}>{item.productInfo?.description}</p>)}

                        <p className='m-0 text-muted mt-2' style={{fontSize:'14px', fontWeight: 400}}>Unit Price</p>
                        <p className='m-0' style={{fontSize:'14px', fontWeight: 500}}>USD ${item.productInfo?.unitPrice}</p>

                        <p className='m-0 text-muted mt-2' style={{fontSize:'14px', fontWeight: 400}}>Quantity Ordered : <Badge bg='dark'>{item.qty}</Badge></p>

                        <p className='m-0 text-muted mt-2' style={{fontSize:'14px', fontWeight: 400}}>Total Price : <span style={{fontWeight: 500, color: '#000'}}>USD ${item.totalPrice.toFixed(2)}</span></p>

                        <Alert variant='info' className='mt-3 d-flex align-items-center gap-2'>
                            <MdInfo className='text-primary' />
                            <span>{itemMilestone()}</span>
                        </Alert>

                    </Col>

                </Row>
            </ListGroup.Item>
            <ListGroup.Item className='p-3'>
                <Row>
                    <Col md={12}>
                        <p className='m-0 text-muted mb-4' style={{fontSize: '16px', fontWeight: 500}}>Item Milestones</p>
                        <Row className='d-flex align-items-center justify-content-center'>
                            <Col md={12}>
                                <StatusProgress type='item_status' milestones={item.milestones} size={30} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item className='p-3'>
                <Row>
                    <Col md={12}>
                        <p className='m-0 text-muted mb-3' style={{fontSize: '16px', fontWeight: 500}}>Shipping Info</p>
                        <p className='m-0 text-muted' style={{fontSize: '14px'}}>{item.shippingInfo?.method.toUpperCase()}</p>
                        {item.shippingInfo?.isFreeShipping ? (
                            <p className='m-0 text-muted' style={{fontSize: '14px'}}>Free shipping</p>
                        ) : (
                            <>
                                {(item.shippingInfo?.additionalShippingPrice > 0 && item.qty > 1) ? (
                                    <>
                                        <p className='m-0 text-muted' style={{fontSize: '14px'}}>Total Shipping Cost : USD ${(item.shippingInfo?.shippingPrice + ((item.qty - 1) * item.shippingInfo?.additionalShippingPrice)).toFixed(2)}</p>
                                    </>
                                ) : (
                                    <p className='m-0 text-muted' style={{fontSize: '14px'}}>Total Shipping Cost : USD ${item.shippingInfo?.shippingPrice.toFixed(2)}</p>
                                )}
                                
                            </>
                        )}
                    </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item className='p-3'>
                <Row>
                    <Col md={12}>
                        <p className='m-0 text-muted mb-3' style={{fontSize: '16px', fontWeight: 500}}>Returns</p>
                        <p className='m-0 text-muted' style={{fontSize: '14px'}} >{item.returnsInfo?.isAccepted ? `Returns are accepted within ${item.returnsInfo?.maxDaysAccept} days after product has been delivered` : `Returns are not accepted`}</p>           
                        {item.returnsInfo?.isAccepted && (<p className='m-0 text-muted' style={{fontSize: '12px'}}>{item.returnsInfo?.shippingCostPaidBy === 'buyer' ? 'Return shipping cost must be paid by Buyer' : 'Return shipping cost will be paid by seller'}</p>)}           
                    </Col>
                </Row>
            </ListGroup.Item>
        </ListGroup>
    );
}

export default OrderItem;