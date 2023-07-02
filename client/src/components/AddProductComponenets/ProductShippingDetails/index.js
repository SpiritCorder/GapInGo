import React, {useState, useEffect} from 'react';

import {Table} from 'react-bootstrap';
import ProductShippingDetailsRow from './ProductShippingDetailsRow';

const ProductShippingDetails = ({shippingCountries, setCountryShippingDetails}) => {

    // hold the state of all rows
    const [shippingDetails, setShippingDetails] = useState([]);

    useEffect(() => {

        setShippingDetails(prev => {
            let updated = [];
            prev.forEach(item => {
                const duplicate = shippingCountries.find(i => i.isoCode === item.isoCode);
                if(duplicate) {
                    updated.push(item);
                }
            })
            // setCountryShippingDetails(updated);
            return updated;
        })

        setCountryShippingDetails(prev => {
            let updated = [];
            prev.forEach(item => {
                const duplicate = shippingCountries.find(i => i.isoCode === item.isoCode);
                if(duplicate) {
                    updated.push(item);
                }
            })
            // setCountryShippingDetails(updated);
            return updated;
        })

    }, [shippingCountries, setCountryShippingDetails]);

    const handleCountryShippingDetailsConfirmation = (countryShippingDetails) => {
        const duplicate = shippingDetails.find(item => item.isoCode === countryShippingDetails.isoCode);
        let updated;
        if(duplicate) {
            updated = shippingDetails.map(item => {
                if(item.isoCode === countryShippingDetails.isoCode) {
                    return countryShippingDetails;
                }
                return item;
            })
        } else {
            updated = [...shippingDetails, countryShippingDetails];
        }
        setCountryShippingDetails(updated);
        setShippingDetails(updated);
    }

    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Taxes</th>
                        <th>VAT</th>
                        <th>Economy Shipping</th>
                        <th>Standard Shipping</th>
                        <th>Speed Pak Shipping</th> 
                        <th>Experdited Shipping (DHL, FedEx, UPS)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shippingCountries.map(c => (
                        <ProductShippingDetailsRow key={c.isoCode} country={c} handleShippingDetails={handleCountryShippingDetailsConfirmation} />
                    ))}
                </tbody>
            </Table>

            {shippingDetails.length > 0 && (
                <>
                <h3 className='mt-5 mb-4 text-muted'>Confirmed Shipping Details</h3>
                <Table responsive className='mb-5'>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Taxes</th>
                            <th>VAT</th>
                            <th>Economy Shipping</th>
                            <th>Standard Shipping</th>
                            <th>Speed Pak Shipping</th> 
                            <th>Experdited Shipping (DHL, FedEx, UPS)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippingDetails.map(item => (
                            <tr key={item.isoCode}>
                                <td>{item.countryName}</td>
                                <td>{item.tax && item.tax > 0 ? item.tax : 'No Tax'}</td>
                                <td>{item.vat && item.vat > 0 ? item.vat : 'No VAT'}</td>

                                <td>
                                    {item.shippingMethods.find(m => m.id === '1' && m.selected) ? (
                                        <>
                                            {item.shippingMethods.find(m => m.id === '1').isFreeShipping ? 'Free Shipping' : (
                                                <div>
                                                    <p>Price: ${item.shippingMethods.find(m => m.id === '1').shippingPrice}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : 'Not Available'}
                                </td>

                                <td>
                                    {item.shippingMethods.find(m => m.id === '2' && m.selected) ? (
                                        <>
                                            {item.shippingMethods.find(m => m.id === '2').isFreeShipping ? 'Free Shipping' : (
                                                <div>
                                                    <p>Price: ${item.shippingMethods.find(m => m.id === '2').shippingPrice}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : 'Not Available'}
                                </td>

                                <td>
                                    {item.shippingMethods.find(m => m.id === '3' && m.selected) ? (
                                        <>
                                            {item.shippingMethods.find(m => m.id === '3').isFreeShipping ? 'Free Shipping' : (
                                                <div>
                                                    <p>Price: ${item.shippingMethods.find(m => m.id === '3').shippingPrice}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : 'Not Available'}
                                </td>

                                <td>
                                    {item.shippingMethods.find(m => m.id === '4' && m.selected) ? (
                                        <>
                                            {item.shippingMethods.find(m => m.id === '4').isFreeShipping ? 'Free Shipping' : (
                                                <div>
                                                    <p>Price: ${item.shippingMethods.find(m => m.id === '4').shippingPrice}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : 'Not Available'}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                </>
            )}
        </>
    )
}

export default React.memo(ProductShippingDetails);