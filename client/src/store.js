import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {productList, singleProduct, topratedProducts} from './reducers/products';
import {cart} from './reducers/cart';
import {auth} from './reducers/auth';
import {profileOwner} from './reducers/profile';
import {orderState} from './reducers/orderState';
import {myOrders} from './reducers/myOrders';

import {userList} from './reducers/admin/users';
import {singleUser} from './reducers/admin/user';

const reducer = combineReducers({
    productList,
    singleProduct,
    topratedProducts,
    cart,
    auth,
    profileOwner,
    orderState,
    myOrders,
    userList,
    singleUser
});

const store = createStore(reducer, compose(composeWithDevTools(applyMiddleware(thunk))))


export default store;