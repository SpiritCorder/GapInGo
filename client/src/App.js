import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectAccessToken, selectAuthUser} from './app/slices/authSlice';
import {Routes, Route} from 'react-router-dom';
import useRefreshToken from './hooks/useRefreshToken';

// toast container
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Protected from './utils/Protected';
import ProtectedAdmin from './utils/ProtectedAdmin';

import HomePage from './pages/Home';
import ProductPage from './pages/Product';
import CartPage from './pages/Cart';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import ShippingPage from './pages/Shipping';
import PaymentPage from './pages/Payment';
import PlaceOrderPage from './pages/PlaceOrder';
import OrderStatusPage from './pages/OrderStatus';

import UsersPage from './pages/admin/Users';
import UserPage from './pages/admin/User';
//import AddProductPage from './pages/AddProduct';
import AddProductPage from './pages/admin/AddProduct';
import OrderListPage from './pages/admin/OrderList';


import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import {Container} from 'react-bootstrap';
import CheckoutPaymentSuccess from './pages/CheckoutPaymentSuccess';
import MyOrders from './pages/MyOrders';
import OrderPage from './pages/Order';
import AdminOrderPage from './pages/admin/Order';

const App = () => {
  
  const accessToken  = useSelector(selectAccessToken);
  const authUser  = useSelector(selectAuthUser);
  const refresh = useRefreshToken();

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getAuth = async () => {
        try {
            await refresh();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    !accessToken && !authUser && getAuth();
    accessToken && authUser && setLoading(false);

}, [refresh, accessToken, authUser])

  return (
    loading ? <Loader /> :
    <>
      <ToastContainer position='top-left' />
      <Header />
        <main className='py-3'>
          <Container>
            <Routes>
              {/* Public Pages */}
              <Route path='/products/:id' element={<ProductPage />} /> 
              <Route path='/cart' element={<CartPage />} />

              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              
              <Route path='/my-orders' element={<Protected children={<MyOrders />} />} />
              <Route path='/my-orders/:orderId' element={<Protected children={<OrderPage />} />} />
              <Route path='/my-profile' element={<Protected children={<ProfilePage />} />} />

              <Route path='/shipping' element={<Protected children={<ShippingPage />} />} />
              <Route path='/payment' element={<Protected children={<PaymentPage />} />} />
              <Route path='/placeorder' element={<Protected children={<PlaceOrderPage />} />} />
              <Route path='/orders/:id' element={<Protected children={<OrderStatusPage />} />} />

              <Route path='/checkout/payment-success' element={<CheckoutPaymentSuccess />} />

              <Route path='/admin/users' element={<ProtectedAdmin children={<UsersPage />} />} />
              <Route path='/admin/orders' element={<ProtectedAdmin children={<OrderListPage />} />} />
              <Route path='/admin/orders/:orderId' element={<ProtectedAdmin children={<AdminOrderPage />} />} />
              
              <Route path='/admin/users/:id' element={<ProtectedAdmin children={<UserPage />} />} />
              <Route path='/admin/products/add' element={<ProtectedAdmin children={<AddProductPage />} />} />

              <Route path='/' element={<HomePage />} />

              <Route path='/search/:keyword' element={<HomePage />} />
            </Routes>
          </Container>
        </main>
      <Footer />
    </>
  );
}

export default App;
