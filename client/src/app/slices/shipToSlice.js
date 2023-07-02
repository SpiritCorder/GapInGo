import {createSlice} from '@reduxjs/toolkit';

const initState = localStorage.getItem('gapInGo_shipTo_state') ? JSON.parse(localStorage.getItem('gapInGo_shipTo_state')) : {
    country: 'United States',
    isoCode: 'US',
    image: 'united_states.jpg'
}

const shipToSlice = createSlice({
    name: 'shipTo',
    initialState: initState,
    reducers: {
        updateShipTo: (state, action) => {
            localStorage.setItem('gapInGo_shipTo_state', JSON.stringify(action.payload));
            return action.payload;
        }
    }
})

export const selectShipTo = state => state.shipTo;

export const {updateShipTo} = shipToSlice.actions;

export default shipToSlice.reducer;