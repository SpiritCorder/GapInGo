import {useState} from 'react';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/slices/authSlice';
import {Navigate, Link} from 'react-router-dom';
import {axiosPublic} from '../../config/axios';

import {toast} from 'react-toastify';
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap';

import {Country, State} from 'country-state-city';
import Select from 'react-select';
import PhoneInput, {formatPhoneNumber, formatPhoneNumberIntl} from 'react-phone-number-input';
import 'react-phone-number-input/style.css'


const RegisterPage = () => {

    const user = useSelector(selectAuthUser);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [phone, setPhone] = useState({
        countryCode: '',
        number: ''
    });

    const [validateError, setValidateError] = useState('');
    const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

    // COST OPERATION SO MOVE OUTSIDE OF THE COMPONENT AND USE useMemo
    const countries = Country.getAllCountries().map(country => ({...country, label: country.name, value: country.isoCode}));
    const states = State.getStatesOfCountry(country ? country.isoCode : '').map(state => ({...state, label: state.name, value: state.isoCode}));

    const registerHandler = async e => {
        e.preventDefault();

        // PERFORM VALIDATION
        if(
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password.trim() ||
            !country ||
            !city.trim() ||
            !postalCode.trim() ||
            !address.trim() ||
            !phone.number.trim() ||
            !phone.countryCode.trim()
        ) {
            toast.error('please enter valid values for required fields');
            return;
        }

        // PASSWORD & CONFIRM PASSWORD CHECK
        if(password.trim() !== confirmPassword.trim()) {
            setValidateError('Passwords are not matching');
            setTimeout(() => {
                setValidateError('');
            }, 3000);
            toast.error('Passwords are not matching');
            return;
        }

        // CHECK ENTERED PHONE NUMBER IS A NUMBER OF THE SELECTED COUNTRY
        if(country.isoCode.trim() !== phone.countryCode.trim()) {
            toast.error(`phone number is not a phone number of ${country.name}`);
            return;
        }

        const user = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: password.trim(),
            countryDetails: {
                country: country?.name.trim(),
                isoCode: country?.isoCode.trim(),
                phoneCode: country?.phonecode.trim(),
                state: {
                    name: state?.name || '',
                    isoCode: state?.isoCode || ''
                },
                city: city.trim()
            },
            city: city.trim(),
            zipCode: postalCode.trim(),
            phoneNums: {
                regular: formatPhoneNumber(phone.number),
                international: formatPhoneNumberIntl(phone.number)
            },
            addressDetails: {
                address: address.trim(),
                apartment: apartment.trim()
            }
        }

        try {
            await axiosPublic.post('/api/auth/register', JSON.stringify(user));
            setIsRegistrationSuccess(true);
            toast.success('Registered Successfully');
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
        }
    }

    return (
        user ? (<Navigate to='/' />) : isRegistrationSuccess ? (
            <>
                <Container>
                    <Row className='d-flex justify-content-center align-items-center'>
                        <Col md={6}>
                            <Alert variant='success'>An email has been sent to the email address that you provided. Please Verify your email. <Link to='/login' className='ml-2'>Login</Link></Alert>
                        </Col>
                    </Row>
                </Container>
            </>
        ) : 
        <>
            <Container>
                <Row className='justify-content-center'>
                    <Col sm={12} md={12} lg={6}>
                        <h1 className='my-4'>Register</h1>
                        {validateError && (<Alert variant='danger'>{validateError}</Alert>)}
                        
                        <Form onSubmit={registerHandler}>

                            <Form.Group className='mb-4'>
                                <Form.Label>First Name : </Form.Label>
                                <Form.Control type='text' placeholder='Enter first name...' value={firstName} onChange={e => setFirstName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <Form.Label>Last Name : </Form.Label>
                                <Form.Control type='text' placeholder='Enter last name...' value={lastName} onChange={e => setLastName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <Form.Label>Email :<small> (please enter a valid email address. We will send a verification email to this)</small></Form.Label>
                                <Form.Control type='email' placeholder='Enter Email...' value={email} onChange={e => setEmail(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <Form.Label>Password :</Form.Label>
                                <Form.Control type='password' placeholder='Enter Password...' value={password} onChange={e => setPassword(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type='password' placeholder='Confirm Password...' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></Form.Control>
                            </Form.Group>

                            {/* <Form.Group>
                                <CountryStateCitySelector onEnsure={onEnsure} />
                            </Form.Group> */}

                            <Form.Group>
                                <Form.Label>Country</Form.Label>
                                <Select
                                    id="country"
                                    name="country"
                                    label="country"
                                    placeholder="Country"
                                    options={countries}
                                    value={country}
                                    onChange={value => {
                                        if(value.isoCode !== country?.isoCode) {
                                            setState(null);
                                        }
                                        setPhone({countryCode: value.isoCode, number: ''})
                                        setCountry(value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className='mt-3'>
                                <Form.Label>State <small className='text-muted' style={{fontSize: '12px', fontWeight: 400}}>(optional)</small></Form.Label>
                                <Select
                                    id="state"
                                    name="state"
                                    label="satate"
                                    placeholder="State"
                                    options={states}
                                    isDisabled={!country}
                                    value={state}
                                    onChange={value => {
                                        setState(value);
                                    }}
                                />
                            </Form.Group>

                            <Row className='mt-3'>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>City</Form.Label>
                                        <Form.Control type='text' placeholder='city' value={city} onChange={e => setCity(e.target.value)} ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Postal Code</Form.Label>
                                        <Form.Control type='text' placeholder='postal code' value={postalCode} onChange={e => setPostalCode(e.target.value)} ></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className='mt-4'>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type='text' placeholder='address' value={address} onChange={e => setAddress(e.target.value)} ></Form.Control>
                            </Form.Group>

                            <Form.Group className='mt-4'>
                                <Form.Label>Apartment <small className='text-muted' style={{fontSize: '12px', fontWeight: 400}}>(optional)</small></Form.Label>
                                <Form.Control type='text' placeholder='apartment' value={apartment} onChange={e => setApartment(e.target.value)} ></Form.Control>
                            </Form.Group>

                            <Form.Group className='mt-4'>
                                <Form.Label>Phone No. <small className='text-muted' style={{fontSize: '14px', fontWeight: 400}}>(must be a phone number of selected country)</small></Form.Label>
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    international
                                    countryCallingCodeEditable={false}
                                    initialValueFormat="national"
                                    limitMaxLength={true}
                                    addInternationalOption={false}

                                    
                                    defaultCountry={phone.countryCode}
                                    onCountryChange={code => setPhone(prev => ({...prev, countryCode: code}))}
                                    value={phone.number}
                                    onChange={val => setPhone(prev => ({...prev, number: val}))}
                                    
                                />
                            </Form.Group>         

                            <Button className='mt-4' type='submit' variant='dark'>Register</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default RegisterPage;