import {useNavigate} from 'react-router-dom';
import './styles/checkoutSteps.css';


const CheckoutSteps = ({currentStep, step1, step2, step3, placingSuccess}) => {

    const navigate = useNavigate();

    return (
        <>
            <div className='checkout_steps_container'>

                <div className='checkout_step'>
                    <button
                        disabled={placingSuccess}
                        className={`${step2 && step1 && !step3 ? 'fade' : ''}`} 
                        style={{backgroundColor: currentStep === 1 ?'#333' : step2 ? '#66EF66' : '#b5afaf', cursor: 'pointer'}}
                        onClick={() => navigate('/shipping')}
                    >{step2 ? <i className="fa-solid fa-check"></i> : 1 }</button>
                    <span className={`checkout_step_link ${step2 && !step3 ? 'grow' : step2 && step3 ? 'stay' : ''}`} id='step_link' style={{backgroundColor: step2 ? '#b5afaf' : '#b5afaf'}}></span>
                    <small>Shipping</small>
                </div>

                <div className='checkout_step'>
                    <button 
                        className={`${step2 && step1 && step3 ? 'fade' : ''}`} 
                        disabled={!step2 || placingSuccess} 
                        style={{backgroundColor: currentStep === 2 ?'#333' : step3 ? '#66EF66' : '#b5afaf', cursor: step2 && 'pointer'}}
                        onClick={() => navigate('/payment')}
                    >{step3 ? <i className="fa-solid fa-check"></i> : 2}</button>
                    <span className={`checkout_step_link ${step3 ? 'grow' : ''}`} id='step_link' style={{backgroundColor: step3 ? '#b5afaf' : '#b5afaf'}}></span>
                    <small>Payment Method</small>
                </div>

                <div className='checkout_step'>
                    <button 
                        className={`${placingSuccess ? 'fade' : ''}`}
                        disabled={!step3} 
                        style={{
                            backgroundColor: placingSuccess ? '#66EF66' : currentStep === 3 &&'#333',
                            cursor: step3 && 'pointer'
                        }}
                        onClick={() => navigate('/placeorder')}
                    >
                        {placingSuccess ? <i className="fa-solid fa-check"></i> : 3}
                    </button>
                    <small>Place Order</small>
                </div>
            </div>
        </>
    );
}

export default CheckoutSteps;