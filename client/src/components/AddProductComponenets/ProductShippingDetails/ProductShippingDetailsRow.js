import {useState} from 'react';

import {toast} from 'react-toastify';

const ProductShippingDetailsRow = ({country, handleShippingDetails}) => {

    const [tax, setTax] = useState(0);
    const [vat, setVat] = useState(0);
    const [shippingMethods, setShippingMethods] = useState([
        {id: '1', method: 'Economy Shipping', selected: false, isFreeShipping: false, shippingPrice: 0, additionalShippingPrice: 0},
        {id: '2', method: 'Standard Shipping', selected: false, isFreeShipping: false, shippingPrice: 0, additionalShippingPrice: 0},
        {id: '3', method: 'Speed Pak Shipping', selected: false, isFreeShipping: false, shippingPrice: 0, additionalShippingPrice: 0},
        {id: '4', method: 'Experdited Shipping', selected: false, isFreeShipping: false, shippingPrice: 0, additionalShippingPrice: 0},
    ])

    const handleShippingMethodSelection = e => {
        const id = e.target.value;
        let updated;
        if(e.target.checked) {
            // update the selected shipping method's selected to true
            updated = shippingMethods.map(method => {
                if(method.id === id) {
                    return {...method, selected: true}
                }
                return method;
            })
            setShippingMethods(updated);
        } else {
            // update the selected shipping method's selected to false
            updated = shippingMethods.map(method => {
                if(method.id === id) {
                    return {...method, selected: false}
                }
                return method;
            })
            setShippingMethods(updated);
        }
    }

    const handleShippingMethodFreeShippingStatus = e => {
        const id = e.target.value;
        let updated;
        if(e.target.checked) {
            // update the isFreeShipping value to true of this perticular shipping method
            updated = shippingMethods.map(method => {
                if(method.id === id) {
                    return {...method, isFreeShipping: true}
                }
                return method;
            })
        } else {
            updated = shippingMethods.map(method => {
                if(method.id === id) {
                    return {...method, isFreeShipping: false}
                }
                return method;
            })
        }
        setShippingMethods(updated);
    }

    const handleShippingMethodPrice = (id, price) => {
        const priceNum = price ? parseFloat(price) : '';
        let updated = shippingMethods.map(method => {
            if(method.id === id) {
                // update the price
                return {...method, shippingPrice: priceNum}
            }
            return method;
        })
        setShippingMethods(updated);
    }

    const handleShippingMethodAdditionalPrice = (id, price) => {
        const priceNum = price ? parseFloat(price) : '';
        let updated = shippingMethods.map(method => {
            if(method.id === id) {
                // update the price
                return {...method, additionalShippingPrice: priceNum}
            }
            return method;
        })
        setShippingMethods(updated);
    }

    const handleShippingDetailsConfirmation = () => {
        const countryShippingDetails = {
            countryName: country.name,
            isoCode: country.isoCode, // Alpha 2 iso code
            shippingMethods: shippingMethods.filter(method => method.selected),
            tax: +tax,
            vat: +vat
        }

        if(countryShippingDetails.tax < 0 || countryShippingDetails.vat < 0 || countryShippingDetails.shippingMethods.length <= 0) {
            toast.error('Invalid Shipping Details');
            return;
        }

        handleShippingDetails(countryShippingDetails);
        toast.success(`Shipping details of ${country.name} are confirmed`);
    }

    return (
        <tr>
            <td><p style={{width: 'max-content'}}>{country.name}</p></td>
            <td>
                <input type='number' placeholder='tax...' min='0' value={tax} onChange={e => setTax(e.target.value)} />
            </td>
            <td>
                <input type='number' placeholder='vat...' min='0' value={vat} onChange={e => setVat(e.target.value)} />
            </td>
            <td>
                <div style={{width: '250px'}}>
                    <div className='d-flex align-items-center gap-1'>
                        <input type='checkbox' value='1' onChange={handleShippingMethodSelection} />
                        <label>Select method</label>
                    </div>
                    {/* This content must be hidden if this shipping method doesn't selected  */}
                    {shippingMethods.find(m => m.id === '1' && m.selected) && (
                        <div className='border p-2 my-2'>
                            <div className='d-flex align-items-center gap-1 mb-2'>
                                <input type='checkbox' value='1' onChange={handleShippingMethodFreeShippingStatus} checked={shippingMethods.find(m => m.id === '1' && m.selected && m.isFreeShipping)} />
                                <label>Free Shipping</label>
                            </div>
                            {shippingMethods.find(m => m.id === '1' && m.selected && !m.isFreeShipping) && (
                                <>
                                    <input type='number' step='.01' min='0' placeholder='shipping cost...' className='mb-2' value={shippingMethods.find(m => m.id === '1').shippingPrice} onChange={(e) => handleShippingMethodPrice('1', e.target.value)} />
                                    <div>
                                        <label>Additional shipping cost (per 1 quantity)</label>
                                        <input type='number' step='.01' min='0' placeholder='additional cost...' value={shippingMethods.find(m => m.id === '1').additionalShippingPrice} onChange={e => handleShippingMethodAdditionalPrice('1', e.target.value)} />
                                    </div>
                                </>
                            )}
                            
                        </div>
                    )}
                    {/* end */}
                </div>
            </td>

            <td>
                <div style={{width: '250px'}}>
                    <div className='d-flex align-items-center gap-1'>
                        <input type='checkbox' value='2' onChange={handleShippingMethodSelection} />
                        <label>Select method</label>
                    </div>
                    {/* This content must be hidden if this shipping method doesn't selected  */}
                    {shippingMethods.find(m => m.id === '2' && m.selected) && (
                        <div className='border p-2 my-2'>
                            <div className='d-flex align-items-center gap-1 mb-2'>
                                <input type='checkbox' value='2' onChange={handleShippingMethodFreeShippingStatus} checked={shippingMethods.find(m => m.id === '2' && m.selected && m.isFreeShipping)} />
                                <label>Free Shipping</label>
                            </div>
                            {shippingMethods.find(m => m.id === '2' && m.selected && !m.isFreeShipping) && (
                                <>
                                    <input type='number' step='.01' min='0' placeholder='shipping cost...' className='mb-2' value={shippingMethods.find(m => m.id === '2').shippingPrice} onChange={(e) => handleShippingMethodPrice('2', e.target.value)} />
                                    <div>
                                        <label>Additional shipping cost (per 1 quantity)</label>
                                        <input type='number' step='.01' min='0' placeholder='additional cost...' value={shippingMethods.find(m => m.id === '2').additionalShippingPrice} onChange={e => handleShippingMethodAdditionalPrice('2', e.target.value)} />
                                    </div>
                                </>
                            )}
                            
                        </div>
                    )}
                    {/* end */}
                </div>
            </td>

            <td>
                <div style={{width: '250px'}}>
                    <div className='d-flex align-items-center gap-1'>
                        <input type='checkbox' value='3' onChange={handleShippingMethodSelection} />
                        <label>Select method</label>
                    </div>
                    {/* This content must be hidden if this shipping method doesn't selected  */}
                    {shippingMethods.find(m => m.id === '3' && m.selected) && (
                        <div className='border p-2 my-2'>
                            <div className='d-flex align-items-center gap-1 mb-2'>
                                <input type='checkbox' value='3' onChange={handleShippingMethodFreeShippingStatus} checked={shippingMethods.find(m => m.id === '3' && m.selected && m.isFreeShipping)} />
                                <label>Free Shipping</label>
                            </div>
                            {shippingMethods.find(m => m.id === '3' && m.selected && !m.isFreeShipping) && (
                                <>
                                    <input type='number' step='.01' min='0' placeholder='shipping cost...' className='mb-2' value={shippingMethods.find(m => m.id === '3').shippingPrice} onChange={(e) => handleShippingMethodPrice('3', e.target.value)} />
                                    <div>
                                        <label>Additional shipping cost (per 1 quantity)</label>
                                        <input type='number' step='.01' min='0' placeholder='additional cost...' value={shippingMethods.find(m => m.id === '3').additionalShippingPrice} onChange={e => handleShippingMethodAdditionalPrice('3', e.target.value)} />
                                    </div>
                                </>
                            )}
                            
                        </div>
                    )}
                    {/* end */}

                </div>
            </td>

            <td>
                <div style={{width: '250px'}}>
                    <div className='d-flex align-items-center gap-1'>
                        <input type='checkbox' value='4' onChange={handleShippingMethodSelection} />
                        <label>Select method</label>
                    </div>

                    {/* This content must be hidden if this shipping method doesn't selected  */}
                    {shippingMethods.find(m => m.id === '4' && m.selected) && (
                        <div className='border p-2 my-2'>
                            <div className='d-flex align-items-center gap-1 mb-2'>
                                <input type='checkbox' value='4' onChange={handleShippingMethodFreeShippingStatus} checked={shippingMethods.find(m => m.id === '4' && m.selected && m.isFreeShipping)} />
                                <label>Free Shipping</label>
                            </div>
                            {shippingMethods.find(m => m.id === '4' && m.selected && !m.isFreeShipping) && (
                                <>
                                    <input type='number' step='.01' min='0' placeholder='shipping cost...' className='mb-2' value={shippingMethods.find(m => m.id === '4').shippingPrice} onChange={(e) => handleShippingMethodPrice('4', e.target.value)} />
                                    <div>
                                        <label>Additional shipping cost (per 1 quantity)</label>
                                        <input type='number' step='.01' min='0' placeholder='additional cost...' value={shippingMethods.find(m => m.id === '4').additionalShippingPrice} onChange={e => handleShippingMethodAdditionalPrice('4', e.target.value)} />
                                    </div>
                                </>
                            )}
                            
                        </div>
                    )}
                    {/* end */}
                </div>
            </td>

            <td>
                <div style={{width: '100px'}} className='d-flex align-items-center justify-content-center'>
                    <button type='button' className='btn btn-primary btn-sm' onClick={handleShippingDetailsConfirmation}>Confirm</button>
                </div>
            </td>

        </tr>
    );
}

export default ProductShippingDetailsRow;