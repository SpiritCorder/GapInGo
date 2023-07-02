import {configureStore} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import shipToReducer from './slices/shipToSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        shipTo: shipToReducer
    },
    devTools: true
})

export default store;