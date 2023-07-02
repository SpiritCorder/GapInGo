import React, { useState, useEffect } from "react";
//import "./styles.css";
import { useFormik } from "formik";
import Select from "react-select";
import { Country, State, City }  from 'country-state-city';
import {Form, FloatingLabel} from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input'

import 'react-phone-number-input/style.css'
import "./styles/countryStateCitySelector.css";

const CountryStateCitySelector = ({onEnsure}) => {

    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [zip, setZip] = useState('');
    const [phone, setPhone] = useState('');

    const addressFromik = useFormik({
        initialValues: {
          country: "",
          state: "",
          city: ""
        },
        onSubmit: ({country, state, city}) => {
          const info = {
            country: country.name, 
            isoCode: country.isoCode, 
            phoneCode: country.phonecode,
            state: state.name,
            city: city.name,
            address: address.trim(),
            apartment: apartment.trim(),
            zipcode: zip.trim(),
            phone: phone.trim()
          };

          onEnsure(info);

        }
      });
    
      const countries = Country.getAllCountries();
    
      const updatedCountries = countries.map((country) => ({
        label: country.name,
        value: country.id,
        ...country
      }));

      const updatedStates = (countryId) =>
        State
          .getStatesOfCountry(countryId)
          .map((state) => ({ label: state.name, value: state.id, ...state }));

      const updatedCities = (countryId, stateId) =>
        City
          .getCitiesOfState(countryId, stateId)
          .map((city) => ({ label: city.name, value: city.id, ...city }));
    
      const { values, handleSubmit, setFieldValue } = addressFromik;
    
      // useEffect(() => {}, [values]);

      return (
        <div className="country-selector">
            <Form.Label className="mb-4">Select Country, State, City</Form.Label>
            <Select
                id="country"
                name="country"
                label="country"
                placeholder="Country"
                options={updatedCountries}
                value={values.country}
                // onChange={value => {
                //   setFieldValue("country", value);
                //   setFieldValue("state", null);
                //   setFieldValue("city", null);
                // }}
                onChange={(value) => {
                    setFieldValue("country", value);
                    //setValues({ country: value, state: null, city: null }, false);
                }}
            />
            <Select
                id="state"
                name="state"
                placeholder="State"
                options={updatedStates(values.country ? values.country.isoCode : null)}
                value={values.state}
                onChange={(value) => {
                    setFieldValue("state", value);
                    //setValues({ state: value, city: null }, false);
                }}
            />
            <Select
                id="city"
                name="city"
                placeholder="City"
                options={updatedCities(values.country ? values.country.isoCode : null, values.state ? values.state.isoCode : null)}
                value={values.city}
                onChange={(value) => setFieldValue("city", value)}
            />

            <FloatingLabel
              controlId="address"
              label="Address"
              className="mb-3"
            >
              <Form.Control type="text" placeholder="address..." value={address} onChange={e => setAddress(e.target.value)} />
            </FloatingLabel>

            <FloatingLabel
              controlId="apartment"
              label="Apartment"
              className="mb-3"
            >
              <Form.Control type="text" placeholder="apartment..." value={apartment} onChange={e => setApartment(e.target.value)} />
            </FloatingLabel>

            <FloatingLabel
              controlId="zipcode"
              label="Postal Code"
              className="mb-3"
            >
              <Form.Control type="text" placeholder="Postal code..." value={zip} onChange={e => setZip(e.target.value)} />
            </FloatingLabel>

            {/* Phone Number Picker */}
            <Form.Label>Enter phone number</Form.Label>
            <PhoneInput
                placeholder="Enter phone number"
                defaultCountry={values.country ? values.country.isoCode : ""}
                value={phone}
                onChange={setPhone}
            />

            <button type="button" onClick={handleSubmit} className="btn-ensure">Ensure</button>
            
        </div>
      );
}

export default CountryStateCitySelector;