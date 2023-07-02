import {useState, useEffect} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginSuccess, selectAuthUser} from '../../app/slices/authSlice';
import {axiosPublic} from '../../config/axios';

import {Form, Button, Row, Col, Container, Alert, Spinner} from 'react-bootstrap';
import Loader from '../../components/Loader';


const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = useSelector(selectAuthUser);

    const loginHandler = async e => {
        e.preventDefault();
        setLoading(true);


        if(!email.trim() || !password.trim()) {
            setValidationError('Email and Password required');
            setTimeout(() => setValidationError(null), 3000);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosPublic.post('/api/auth/login', JSON.stringify({email, password}));
            dispatch(loginSuccess({accessToken: response.data.accessToken, user: response.data.user}));
            setEmail('');
            setPassword('');
            setLoading(false);
            navigate('/');
        } catch (err) {
            console.log(err);
            setLoading(false);
            setValidationError(err.response.data?.message);
            setTimeout(() => setValidationError(null), 3000);
        }

        // dispatch(login(email, password));
    }

    return (
        user ? (<Navigate to={-1} />) :
        <>
            <Container>
                <Row className='justify-content-center'>
                    <Col sm={12} md={6}>
                        <h1 className='my-4'>Sign In</h1>
                        {/* {error && <Alert variant='danger'>{error}</Alert>} */}
                        {validationError && <Alert variant='danger'>{validationError}</Alert>}
                        <Form onSubmit={loginHandler} className='mb-2'>
                            <Form.Group className='mb-4'>
                                <Form.Label>Email :</Form.Label>
                                <Form.Control type='email' placeholder='Enter email...' value={email} onChange={e => setEmail(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                                <Form.Label>Password :</Form.Label>
                                <Form.Control type='password' placeholder='Enter password...' value={password} onChange={e => setPassword(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button variant='dark' className='d-flex align-items-center gap-2' type='submit' disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        wait...
                                    </>
                                ) : 'Login'}
                            </Button>
                        </Form>
                        <small>already have an account <Link to='/register'>Sign Up</Link></small>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default LoginPage;