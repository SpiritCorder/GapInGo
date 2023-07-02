import {useState, useMemo} from 'react';
import {useQuery} from 'react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Country, State}  from 'country-state-city';
import Loader from '../../components/Loader';
import {Alert, Row, Col, Badge} from 'react-bootstrap';
import Select from "react-select";
import PhoneInput, {formatPhoneNumber, formatPhoneNumberIntl} from 'react-phone-number-input';
// import PhoneInput from 'react-phone-number-input/input'

import {toast} from 'react-toastify';
import {MdCheckCircle, MdCancel} from 'react-icons/md';

import 'react-phone-number-input/style.css'

const getMyProfile = async (axiosPrivate) => {
    const response = await axiosPrivate.get('/api/profile');
    return response.data.profile;
}

const getAllCountries = () => Country.getAllCountries().map(country => ({label: country.name, value: country.isoCode, ...country}));

const getStatesOfACountry = (countryId=null) => State.getStatesOfCountry(countryId).map((state) => ({ label: state.name, value: state.isoCode, ...state }));


const ProfilePage = () => {

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

    const [isResendingEmailVerification, setIsResendingEmailVerification] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    const {isLoading, isFetching, data, isError, error, refetch} = useQuery('my-profile', () => getMyProfile(axiosPrivate), {
        onSuccess: data => {
            // populate with current profile data
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            const country = Country.getCountryByCode(data.countryDetails.isoCode);
            setCountry({label: country.name, value: country.isoCode, ...country});
            if(data.countryDetails.state?.isoCode) {
                const state = State.getStatesOfCountry(data.countryDetails.isoCode).find(item => item.isoCode === data.countryDetails.state?.isoCode);
                setState({label: state.name, value: state.isoCode, ...state});
            }
            setPhone({countryCode: data.countryDetails.isoCode, number: data.phone.international});
            setCity(data.city);
            setPostalCode(data.zipCode);
            setAddress(data.addressDetails.address);
            setApartment(data.addressDetails.apartment || '');
        },
        refetchOnWindowFocus: false
    });

    const countries = useMemo(() => {
        return  getAllCountries();
    }, [])

    const states = useMemo(() => {
        return getStatesOfACountry(country?.isoCode);
    }, [country])

    const handleEmailVerificationResend = async () => {
        setIsResendingEmailVerification(true);
        try {
            await axiosPrivate.get('/api/profile/resend-email-verification');
            toast.success('email verification sent');
            setIsResendingEmailVerification(false);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
            setIsResendingEmailVerification(false);            
        }
    }

    const handleProfileUpdate = async () => {
        // PERFORM VALIDATION
        setIsSaving(true);
        if(
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !country ||
            !city.trim() ||
            !postalCode.trim() ||
            !address.trim() ||
            !phone.number.trim() ||
            !phone.countryCode.trim()
        ) {
            setIsSaving(false);
            toast.error('please enter valid values for required fields');
            return;
        }

        // PASSWORD & CONFIRM PASSWORD CHECK
        if(password.trim() !== confirmPassword.trim()) {
            setIsSaving(false);
            toast.error('Passwords are not matching');
            return;
        }

        // CHECK ENTERED PHONE NUMBER IS A NUMBER OF THE SELECTED COUNTRY
        if(country.isoCode.trim() !== phone.countryCode.trim()) {
            setIsSaving(false);
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
            await axiosPrivate.put('/api/profile', JSON.stringify(user));
            toast.success('profile updated');
            setPassword('');
            setConfirmPassword('');
            setIsSaving(false);
            refetch();
        } catch (err) {
            console.log(err);
            setIsSaving(false);
            toast.error(err.response.data?.message);
        }
    }

    if(isLoading || isFetching) return <Loader />

    if(isError) {
        return (
            <Row>
                <Col md={12}>
                    <Alert variant='danger'>{error?.message}</Alert>
                </Col>
            </Row>
        );
    }

    return (
        <Row>

            <Col md={5} className='border-right'>
                <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                    <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt='profile-avatar' />
                    <span className="font-weight-bold">{data.firstName} {data.lastName}</span>
                    <span className="text-black-50">{data.email}</span>
                    <Badge bg={data?.isEmailVerified ? 'success' : 'danger'} className='d-flex align-items-center gap-1 text-white mt-2'>{data?.isEmailVerified ? 'Email is verified' : 'Email is not verified'}{data?.isEmailVerified ? <MdCheckCircle className='text-white' style={{fontSize: '20px'}} /> : <MdCancel className='text-white' style={{fontSize: '20px'}} />}</Badge>
                
                    {!data?.isEmailVerified && (
                        <div className='mt-3'>
                            <p className='text-danger text-start' style={{fontSize: '14px'}}>you have not verified your email, inorder to purchase you must verify your email address. If you did not receive an email verification message to your current email, you can resend it by clicking <span>resend email</span> button below. If your current email address does not exist then you can update to a new working email address.</p>
                            <button className='btn btn-dark btn-sm' onClick={handleEmailVerificationResend} disabled={isResendingEmailVerification} >{isResendingEmailVerification ? 'sending...' : 'Resend Email Verification'}</button>
                        </div>
                    )}
                    
                </div>
            </Col>

            <Col md={7}>
                <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Profile Settings</h4>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels mb-1">Name</label><input type="text" className="form-control" placeholder="first name" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                        <div className="col-md-6"><label className="labels mb-1">Surname</label><input type="text" className="form-control" placeholder="last name" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
                    </div>

                    <div className='row mt-3'>
                        <div className="col-md-12"><label className="labels mb-1">Email</label><input type="email" className="form-control" placeholder="enter email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                    </div>
                    
                    <div className='row mt-3'>
                        <div className="col-md-6"><label className="labels mb-1">New Password</label><input type="password" className="form-control" placeholder="enter new password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                        <div className="col-md-6"><label className="labels mb-1">Confirm New Password</label><input type="password" className="form-control" placeholder="confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
                    </div>
                        
                    <div className='row mt-3'>
                        <div className='col-md-12'>
                            <label className="labels mb-1">Country</label>
                            <Select
                                id="country"
                                name="country"
                                label="country"
                                placeholder="Country"
                                options={countries}
                                value={country}
                                onChange={(value) => {
                                    
                                    if(value.isoCode !== country?.isoCode) {
                                        setState(null);
                                    }
                                    if(value.isoCode !== data.countryInfo.isoCode) {
                                        setPhone(prev => ({countryCode: value.isoCode, number: ''}));
                                    } else {
                                        setPhone(prev => ({countryCode: value.isoCode, number: ''}));
                                    }
                                    setCountry({...value});
                                }}
                            />  
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-md-12'>
                            <label className="labels mb-1">State</label>
                            <Select
                                id="state"
                                name="state"
                                placeholder="State"
                                isDisabled={!country}
                                options={states}
                                value={state}
                                onChange={(value) => {
                                    setState(value);
                                }}
                            />
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className="col-md-6"><label className="labels mb-1">City</label><input type="text" className="form-control" placeholder="city" value={city} onChange={e => setCity(e.target.value)} /></div>
                        <div className="col-md-6"><label className="labels mb-1">Postal Code</label><input type="text" className="form-control" placeholder="postal code" value={postalCode} onChange={e => setPostalCode(e.target.value)} /></div>
                    </div>

                    <div className='row mt-3'>
                        <div className="col-md-12"><label className="labels mb-1">Address</label><input type="text" className="form-control" placeholder="address" value={address} onChange={e => setAddress(e.target.value)} /></div>
                    </div>

                    <div className='row mt-3'>
                        <div className="col-md-12"><label className="labels mb-1">Apartment</label><input type="text" className="form-control" placeholder="apartment address" value={apartment} onChange={e => setApartment(e.target.value)} /></div>
                    </div>
                   
                   <div className='row mt-3'>
                        <div className='col-md-12'>
                            <label className="labels mb-1">Phone Number (must be a phone number of the selected country)</label>
                            <PhoneInput
                                placeholder="Enter phone number"
                                international
                                countryCallingCodeEditable={false}
                                //initialValueFormat="national"
                                limitMaxLength={true}
                                addInternationalOption={false}
                                
                                defaultCountry={phone.countryCode}
                                onCountryChange={code => setPhone(prev => ({...prev, countryCode: code}))}
                                value={phone.number}
                                onChange={val => setPhone(prev => ({...prev, number: val}))}
                                
                            />
                            
                        </div>
                   </div>
                   
                    <div className="mt-5 d-flex align-items-center justify-content-center gap-2">
                        <button className="btn btn-primary profile-button" type="button" onClick={handleProfileUpdate} disabled={isSaving}>{isSaving ? 'saving...' : 'Save Profile'}</button>
                        <button className="btn btn-dark profile-button" type="button" onClick={refetch}>Reset Profile Info</button>
                    </div>
                </div>
            </Col>

        </Row>
    );
}

export default ProfilePage;