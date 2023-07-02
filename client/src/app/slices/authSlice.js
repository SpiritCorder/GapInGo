import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../../config/axios';

export const logoutAuthUser = createAsyncThunk("auth/logout", async () => {
    try {
        await axiosPublic.get('/api/auth/logout');
        // logout success
        return {};
    } catch (err) {
        // logout failed
        return {};
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState: {accessToken: null, user: null},
    reducers: {
        loginSuccess: (state, action) => {
            return {accessToken: action.payload.accessToken, user: action.payload.user};
        },
        accessTokenRefreshSuccess: (state, action) => {
            return {accessToken: action.payload.accessToken, user: action.payload.user};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logoutAuthUser.fulfilled, (state, action) => {
            return {accessToken: null, user: null};
        })
    }
});

export const selectAccessToken = state => state.auth.accessToken;
export const selectAuthUser = state => state.auth.user;

export const {loginSuccess, accessTokenRefreshSuccess} = authSlice.actions;

export default authSlice.reducer;