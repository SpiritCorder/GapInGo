
import {MdCheck, MdInfoOutline} from 'react-icons/md';
import {FaInfo} from 'react-icons/fa';

import './styles/statusProgress.css';


const StatusProgress = ({type, milestones, size=45}) => {

    console.log(milestones);

    let content;

    switch(type) {
        case 'order_status':
            content = (
                <>
                    <div className='statusProgress-item'>
                        <span className='bg-primary' style={{width: `${size}px`, height: `${size}px`}}><MdCheck /></span>
                        <div>
                            <span className='text-muted milestone'>Order Placed</span>
                            <span className='text-muted milestone-date'>{new Date(milestones[0].milestoneDate).toDateString()}</span>
                        </div>
                    </div>
                    <div className='statusProgress-item'>
                        <span className={milestones[1].milestone === 'order_payment_pending' ? 'bg-warning' : 'bg-primary'} style={{width: `${size}px`, height: `${size}px`}} >{milestones[1].milestone === 'order_payment_pending' ? (<FaInfo style={{fontSize: '16px'}} />) : (<MdCheck />)}</span>
                        <div>
                            {milestones[1].milestone === 'order_payment_pending' ? (
                                <>
                                    <span className='text-muted milestone'>Order Payment Pending</span>
                                    <span className='text-muted milestone-date'>(might take a while to transfer money)</span>
                                </>
                            ) : (
                                <>
                                    <span className='text-muted milestone'>Order Paid</span>
                                    <span className='text-muted milestone-date'>{new Date(milestones[1].milestoneDate).toDateString()}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='statusProgress-item'>
                        <span className={(milestones.length > 2 && milestones[2].milestone === 'partially_shipped') ? 'bg-warning' : (milestones.length > 2 && milestones[2].milestone === 'shipped') ? 'bg-primary' : 'incomplete'} style={{width: `${size}px`, height: `${size}px`}} >
                            {(milestones.length > 2 && milestones[2].milestone === 'partially_shipped') ? (<FaInfo style={{fontSize: '16px'}} />) : (milestones.length > 2 && milestones[2].milestone === 'shipped') ? (<MdCheck />) : ''}
                        </span>
                        <div>
                            {milestones.length <= 2 && (<span className='text-muted milestone'>Order Shipped</span>)}
                            {milestones.length > 2 && milestones[2].milestone === 'partially_shipped' && (
                                <>
                                    <span className='text-muted milestone'>Order Partially Shipped</span>
                                    <span className='text-muted milestone-date'>(some order items have been shipped)</span>
                                </>
                            )}
                            {milestones.length > 2 && milestones[2].milestone === 'shipped' && (
                                <>
                                    <span className='text-muted milestone'>Order Shipped</span>
                                    <span className='text-muted milestone-date'>{new Date(milestones[2].milestoneDate).toDateString()}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='statusProgress-item'>
                        <span className={(milestones.length > 3 && milestones[3].milestone === 'partially_delivered') ? 'bg-warning' : (milestones.length > 3 && milestones[3].milestone === 'delivered') ? 'bg-primary' : 'incomplete'} style={{width: `${size}px`, height: `${size}px`}} >
                            {(milestones.length > 3 && milestones[3].milestone === 'partially_delivered') ? (<FaInfo style={{fontSize: '16px'}} />) : (milestones.length > 3 && milestones[3].milestone === 'delivered') ? (<MdCheck />) : ''}
                        </span>
                        <div>
                            {milestones.length <= 3 && (<span className='text-muted milestone'>Order Delivered</span>)}

                            {milestones.length > 3 && milestones[3].milestone === 'partially_delivered' && (
                                <>
                                    <span className='text-muted milestone'>Order Partially Delivered</span>
                                    <span className='text-muted milestone-date'>(some order items have been delivered)</span>
                                </>
                            )}
                            {milestones.length > 3 && milestones[3].milestone === 'delivered' && (
                                <>
                                    <span className='text-muted milestone'>Order Delivered</span>
                                    <span className='text-muted milestone-date'>{new Date(milestones[3].milestoneDate).toDateString()}</span>
                                </>
                            )}

                        </div>
                    </div>
                </>
            )
            break;
        case 'item_status':
            content = (
                <>
                    <div className='statusProgress-item'>
                        <span className={milestones[0].milestone === 'item_payment_pending' ? 'bg-warning' : 'bg-primary'} style={{width: `${size}px`, height: `${size}px`}} >{milestones[0].milestone === 'item_payment_pending' ? (<FaInfo style={{fontSize: '16px'}} />) : (<MdCheck />)}</span>
                        <div>
                            <span className='text-muted milestone'>{milestones[0].milestone === 'item_payment_pending' ? 'Payment Pending' : 'Paid'}</span>
                            {milestones[0].milestone === 'item_paid' && <span className='text-muted milestone-date'>{new Date(milestones[0].date).toDateString()}</span>}
                        </div>
                    </div>
                    <div className='statusProgress-item'>
                        <span className={milestones.length > 1 ? 'bg-primary' : 'incomplete'} style={{width: `${size}px`, height: `${size}px`}} >{milestones.length > 1 && (<MdCheck />)}</span>
                        <div>
                            <span className='text-muted milestone'>Shipped</span>
                            {milestones.length > 1 && (<span className='text-muted milestone-date'>{new Date(milestones[1].date).toDateString()}</span>)}
                        </div>
                    </div>
                    <div className='statusProgress-item'>
                        <span className={milestones.length > 2 ? 'bg-primary' : 'incomplete'} style={{width: `${size}px`, height: `${size}px`}} >{milestones.length > 2 && (<MdCheck />)}</span>
                        <div>
                            <span className='text-muted milestone'>Delivered</span>
                            {milestones.length > 2 && (<span className='text-muted milestone-date'>{new Date(milestones[2].date).toDateString()}</span>)}
                        </div>
                    </div>
                </>
            )
            break;
        default:
            return;
    }

    return (
        <div className='statusProgress-wrapper'>
            <div className='w-100 statusProgress'>

                <div className='statusProgress-progress-bar-bottom'></div>

                {content}

                {/* <div className='statusProgress-item'>
                    <span className='bg-primary'><MdCheck /></span>
                    <div>
                        <span className='text-muted milestone'>Order Placed</span>
                        <span className='text-muted milestone-date'>{new Date().toDateString()}</span>
                    </div>
                </div> */}

                {/* <div className='statusProgress-item'>
                    <span className='bg-warning'><FaInfo style={{fontSize: '16px'}} /></span>
                    <div>
                        <span className='text-muted milestone'>Order Payment Pending</span>
                        <span className='text-muted milestone-date'>(might take a while to transfer money)</span>
                        <span className='text-muted milestone-date'>{new Date().toDateString()}</span>
                    </div>
                </div> */}

                {/* <div className='statusProgress-item'>
                    <span className='bg-warning'><FaInfo style={{fontSize: '16px'}} /></span>
                    <div>
                        <span className='text-muted milestone'>Order Partially Shipped</span>
                        <span className='text-muted milestone-date'>(some order items have been shipped)</span>
                        <span className='text-muted milestone-date'>{new Date().toDateString()}</span>
                    </div>
                </div> */}

                {/* <div className='statusProgress-item'>
                    <span className='incomplete'></span>
                    <div>
                        <span className='text-muted milestone'>Order Delivered</span>
                        <span className='text-muted milestone-date'>{new Date().toDateString()}</span>
                    </div>
                </div> */}

                {/* <div className='statusProgress-item'>
                    <span className='bg-primary'>5</span>
                    <div>
                        <span className='text-muted milestone'>Order Completed</span>
                        <span className='text-muted milestone-date'>{new Date().toDateString()}</span>
                    </div>
                </div> */}

            </div>
        </div>
    );
}

export default StatusProgress;