import React from 'react';
import ReactDOM from 'react-dom/client';

import {QueryClientProvider, QueryClient} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {Provider} from 'react-redux';
// import store from './store';
import store from './app/store';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './bootstrap.min.css';
import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
);

