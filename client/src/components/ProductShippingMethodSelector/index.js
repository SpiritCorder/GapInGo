
import {MdClose, MdCheckCircle} from 'react-icons/md';

import './styles/productShippingMethodSelector.css';

const ProductShippingMethodSelector = ({isoCode, countryShippingDetails, currentMethod, setShippingMethod, closeModel}) => {

    const saveShippingMethod = (method) => {
        setShippingMethod(method);
        closeModel();
    }

    return (
        <div className='productShippingMethodSelector'>

            <div className='d-flex align-items-center justify-content-between pt-2'>
                <p className='m-0'>Select shipping method</p>
                <button className='text-danger rounded bg-white border-0' onClick={closeModel}><MdClose style={{fontSize: '20px'}} /></button>
            </div>

            <div className='d-flex flex-column gap-2 productShippingMethodSelector-methods-container'>
                {countryShippingDetails.find(c => c.isoCode === isoCode).shippingMethods.map(m => (
                    <button key={m.id} className='d-flex flex-column border productShippingMethodSelector-method' onClick={() => saveShippingMethod(m)}>
                            <span className='productShippingMethodSelector-method-name text-muted'>{m.method}</span>
                            {m.isFreeShipping ? (<strong style={{fontSize: '12px'}}>Free Shipping</strong>) : (<strong style={{fontSize: '12px'}}>${m.shippingPrice}</strong>)}
                            <span className='productShippingMethodSelector-method-name-radio border'>{currentMethod.id === m.id && <MdCheckCircle />}</span>
                    </button>
                ))}
            </div>

        </div>
    );
}


export default ProductShippingMethodSelector;