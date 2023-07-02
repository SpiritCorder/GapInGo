import React from 'react';
import {useState} from 'react';
import {Row, Col} from 'react-bootstrap';

import {toast} from 'react-toastify';

const shippingCountries = [
    {isoCode: "US", name: "United States"},
    {isoCode: "GB", name: "United Kingdom"},
    {isoCode: "AU", name: "Australia"},
    {isoCode: "CA", name: "Canada"},
    {isoCode: "NO", name: "Norway"},
    {isoCode: "BE", name: "Belgium"},
    {isoCode: "FR", name: "France"},
    {isoCode: "DE", name: "Germany"},
    {isoCode: "IT", name: "Italy"},
    {isoCode: "PL", name: "Poland"},
    {isoCode: "PT", name: "Portugal"},
    {isoCode: "ES", name: "Spain"},
    {isoCode: "IE", name: "Ireland"},
    {isoCode: "NL", name: "Netherlands"},
    {isoCode: "AT", name: "Austria"},
    {isoCode: "BG", name: "Bulgaria"},
    {isoCode: "HR", name: "Croatia"},
    {isoCode: "CZ", name: "Czech Republic"},
    {isoCode: "DK", name: "Denmark"},
    {isoCode: "EE", name: "Estonia"},
    {isoCode: "FI", name: "Finland"},
    {isoCode: "GR", name: "Greece"},
    {isoCode: "HU", name: "Hungary"},
    {isoCode: "LV", name: "Latvia"},
    {isoCode: "LU", name: "Luxembourg"},
    {isoCode: "RO", name: "Romania"},
    {isoCode: "SK", name: "Slovakia"},
    {isoCode: "SI", name: "Slovenia"},
    {isoCode: "SE", name: "Sweden"},
    
]


const ProductCountrySelector = ({setShippingCountries, alreadySelectedShippingCountries}) => {

    const [selectedCountries, setSelectedCountries] = useState(alreadySelectedShippingCountries);

    const handleCountrySelect = e => {
        const country = shippingCountries.find(c => c.isoCode === e.target.value);
        if(e.target.checked) {
            // add the selected country to the array
            setSelectedCountries(prev => [...prev, country]);
        } else {
            // remove the selected country from an array
            setSelectedCountries(prev => prev.filter(c => c.isoCode !== e.target.value));
        }
    }

    const handleConfirm = () => {
        setShippingCountries(selectedCountries);
        toast.success('Countries are confirmed, update the below table');

    }

    return (
        <Row>
            <Col md={12} className='border px-4 pt-5'>
                <div className='d-flex align-items-center flex-wrap gap-4'>
                    {shippingCountries.map(country => (
                        <div key={country.isoCode} className='d-flex align-items-center gap-1'>
                            <input type='checkbox' value={country.isoCode} onChange={handleCountrySelect} checked={selectedCountries.find(i => i.isoCode === country.isoCode) ? true : false} />
                            <label>{country.name}</label>
                        </div>
                    ))}
                </div>
                <button type='button' className='btn btn-dark mt-4 mb-3'onClick={handleConfirm} >Confirm</button>
            </Col>
        </Row>
    );
}

export default React.memo(ProductCountrySelector);