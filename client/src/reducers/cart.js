const initState = {
    cartItems: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
    shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || null,
    paymentMethod: localStorage.getItem('paymentMethod') || null
}

export const cart = (state=initState, action) => {

    switch(action.type) {
        case 'ADD_TO_CART':
            const newItem = action.payload;
            let currentItems = JSON.parse(localStorage.getItem('cart')) || [];
            const isExist = currentItems.find(item => item.id === newItem.id);
            if(isExist) {
                currentItems = currentItems.map(item => item.id === newItem.id ? newItem : item);
            } else {
                currentItems.unshift(newItem);
            }
            localStorage.setItem('cart', JSON.stringify(currentItems));
            return {...state, cartItems: currentItems}
        case 'REMOVE_FROM_CART':
            const {removeId} = action.payload;
            let removeItems = [...state.cartItems];
            removeItems = removeItems.filter(item => item.id !== removeId);
            let removeItemsToSave = removeItems.map(item => ({id: item.id, qty: item.qty}))
            localStorage.setItem('cart', JSON.stringify(removeItemsToSave));
            return {...state, cartItems: removeItems};
        case 'CART_ITEMS_REQUEST':
            return {loading: true, ...state}
        case 'CART_ITEMS_SUCCESS':
            let data = action.payload;
            let populatedItems = [...state.cartItems];
            populatedItems = populatedItems.map(item => {
                const fullData = data.find(i => i._id === item.id);
                if(fullData) {
                    return {
                        ...item,
                        name: fullData.name,
                        price: fullData.price,
                        stockCount: fullData.stockCount,
                        image: fullData.image,
                        isValid: true
                    }
                } else {
                    return {
                        ...item,
                        isValid: false
                    }
                }
            })

            populatedItems = populatedItems.filter(item => item.isValid);
            const newCartItems = populatedItems.map(item => {
                return {
                    id: item.id,
                    qty: item.qty
                }
            })
            localStorage.setItem('cart', JSON.stringify(newCartItems));
            return {...state, loading: false, cartItems: populatedItems};
        case 'UPDATE_CART_QUANTITY':
            const {id, qty} = action.payload;
            let updatedCartItems = [...state.cartItems];
            updatedCartItems = updatedCartItems.map(item => {
                return {
                    ...item,
                    qty: item.id === id ? qty : item.qty
                }
            })
            let updatedCartItemsToSave = updatedCartItems.map(item => ({id: item.id, qty: item.qty}))
            localStorage.setItem('cart', JSON.stringify(updatedCartItemsToSave));
            return {...state, cartItems: updatedCartItems};
        case 'ADD_SHIPPING_ADDRESS':
            const shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
            return {...state, shippingAddress};
        case 'ADD_PAYMENT_METHOD':
            localStorage.setItem('paymentMethod', action.payload);
            return {...state, paymentMethod: action.payload};
        default: 
            return state;
    }
}