import { combineReducers } from 'redux';
import authenticationReducer from './authenticationReducer';
import forgotPasswordReducer from './forgotPasswordReducer';

// Dashboard Reducers
import dashboardReducer from './dashboardReducer';

// OpenOrders
import openOrdersReducer from './openOrdersReducer';

// Budgeting
import budgetingReducer from './budgetingReducer';

// Support 
import supportReducer from './supportReducer';

const rootReducer = combineReducers({
    authenticationReducer,
    forgotPasswordReducer,

    dashboardReducer,
    openOrdersReducer,
    budgetingReducer,
    supportReducer
});

export default rootReducer
