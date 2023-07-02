import {useState} from 'react';
import {createPortal} from 'react-dom';
import {useSelector, useDispatch} from 'react-redux';
// import {useNavigate} from 'react-router-dom';
import {selectAuthUser, logoutAuthUser} from '../../app/slices/authSlice';
import {selectShipTo} from '../../app/slices/shipToSlice';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import SearchBox from '../SearchBox';
import Overlay from '../Overlay';
import ShipToCountryPicker from '../ShipToCountryPicker';
import Brand from '../../assets/images/brand.jpg';
import {MdSupervisedUserCircle} from 'react-icons/md';
import {FaShippingFast} from 'react-icons/fa';


const Header = () => {

    const [isShipToModelOpen, setIsShipToModelOpen] = useState(false);

    const user = useSelector(selectAuthUser);
    const shipTo = useSelector(selectShipTo);
    const dispatch = useDispatch();

    const closeShipToModel = () => setIsShipToModelOpen(false);

    const handleLogout = () => dispatch(logoutAuthUser());

    return (
        <>
        {isShipToModelOpen && createPortal(<Overlay closeModel={closeShipToModel} />, document.getElementById('overlay'))}
        {isShipToModelOpen && createPortal(<ShipToCountryPicker closeModel={closeShipToModel} />, document.getElementById('portals'))}
        <header>
            <Navbar variant='dark' style={{backgroundColor: '#151c26'}} expand="lg">
                <Container>

                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img src={Brand} alt='brand' style={{width: '150px', objectFit: 'cover'}} />
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-between'>
                        <SearchBox />
                        <Nav  className="d-flex align-items-center gap-4">
                            <button className='d-flex align-items-center gap-2 bg-white border-0 px-2' onClick={() => setIsShipToModelOpen(true)}>
                                <img src={`${window.location.origin}/images/country_flags/${shipTo.image}`} style={{width: '35px', height: '24px'}} alt='country' />
                                <label className='text-dark'>ship to {shipTo.country}</label>
                            </button>
                            <LinkContainer to='/cart' className="d-flex align-items-center gap-2 no-border">
                                <Nav.Link><i className="fa-solid fa-cart-arrow-down"></i>Cart</Nav.Link>
                            </LinkContainer>
                            {!user && (
                                <LinkContainer to='/login' className="d-flex align-items-center gap-2">
                                    <Nav.Link><i className="fa-solid fa-arrow-right-to-bracket mr-2"></i>Sign In</Nav.Link>
                                </LinkContainer>
                            )}
                            {user && (
                                <NavDropdown title={`${user.firstName} ${user.lastName}`} id='username' className='ml-4'>
                                


                                    {user.isAdmin && (
                                        <>
                                            <LinkContainer to='/admin/orders'>
                                                <NavDropdown.Item className='d-flex align-items-center gap-3'>
                                                    {/* <i className="fa-solid fa-user mr-2"></i> */}
                                                    <FaShippingFast />
                                                    Order Management
                                                </NavDropdown.Item>
                                            </LinkContainer>

                                            <LinkContainer to='/admin/users'>
                                                <NavDropdown.Item className='d-flex align-items-center gap-3'>
                                                    {/* <i className="fa-solid fa-user mr-2"></i> */}
                                                    <MdSupervisedUserCircle />
                                                    User Management
                                                </NavDropdown.Item>
                                            </LinkContainer>

                                            <LinkContainer to='/admin/products/add'>
                                                <NavDropdown.Item className='d-flex align-items-center gap-3'>
                                                    <i className="fa-brands fa-product-hunt mr-2"></i>
                                                    Add Product
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}

                                    <LinkContainer to='/my-orders'>
                                        <NavDropdown.Item className='d-flex align-items-center gap-3'>
                                            <i className="fa-solid fa-money-check mr-2"></i>
                                            My Orders
                                        </NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to='/my-profile'>
                                        <NavDropdown.Item className='d-flex align-items-center gap-3'>
                                            <i className="fa-solid fa-user mr-2"></i>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    
                                    <NavDropdown.Item className='d-flex align-items-center gap-3' onClick={handleLogout}>
                                        <i className="fa-solid fa-right-from-bracket mr-2"></i>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </header>
    </>
    );
}

export default Header;