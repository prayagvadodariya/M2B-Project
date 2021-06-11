import { createDrawerNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import Dashboard from './src/containers/Dashboard';
import OpenOrders from './src/containers/OpenOrders';
import CreateOrder from './src/containers/CreateOrder';
import M2bHeaderStyles from './config/M2bHeaderStyles';
import Budgeting from './src/containers/Budgeting';
import M2bCustomDrawer from './src/containers/M2bCustomDrawer';
import Login from './src/containers/Login';
import ForgotPassword from './src/containers/ForgotPassword';
import AuthLoadingScreen from './src/containers/AuthLoadingScreen';
import Support from './src/containers/Support';
import EditOrder from './src/containers/EditOrder';
import Orders from './src/containers/Orders';
import MarketTrips from './src/containers/MarketTrips';
import EventsOrders from './src/containers/EventsOrders';
import ViewOrder from './src/containers/ViewOrder';
import Search from './src/containers/Search';
import MonthlyBudgets from './src/containers/MonthlyBudgets';
import CategoryBudgets from './src/containers/CategoryBudgets';
import MarketBudgets from './src/containers/MarketBudgets';
import CategoryBudgetChart from './src/containers/CategoryBudgetChart';
import MarketBudgetChart from './src/containers/MarketBudgetChart';
import Setting from './src/containers/Setting';
import CompanyProfileSetting from './src/containers/CompanyProfileSetting';
import CategoriesSetting from './src/containers/CategoriesSetting';
import AddCategory from './src/containers/AddCategory';
import EditCategory from './src/containers/EditCategory';
import ViewCategory from './src/containers/ViewCategory';
import Reporting from './src/containers/Reporting';
import TaggedReporting from './src/containers/TaggedReporting';

const DashboardStack = createAppContainer(createStackNavigator({
    Dashboard: {
        screen: Dashboard
    },
    CreateOrder: {
        screen: CreateOrder
    },
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const OpenOrdersStack = createAppContainer(createStackNavigator({
    OpenOrders: {
        screen: OpenOrders
    },
    DashboardScreen: {
        screen: Dashboard
    },
    EditOrder: {
        screen: EditOrder
    },
    ViewOrder: {
        screen: ViewOrder
    },
    CreateOrder: {
        screen: CreateOrder
    },
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const OrdersStack = createAppContainer(createStackNavigator({
    Orders: {
        screen: Orders
    },
    CreateOrder: {
        screen: CreateOrder
    },
    EditOrder: {
        screen: EditOrder
    },
    ViewOrder: {
        screen: ViewOrder
    }
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const MarketTripsStack = createAppContainer(createStackNavigator({
    MarketTrips: {
        screen: MarketTrips
    },
    CreateOrder: {
        screen: CreateOrder
    },
    EditOrder: {
        screen: EditOrder
    },
    EventsOrders: {
        screen: EventsOrders
    },
    ViewOrder: {
        screen: ViewOrder
    }
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const BudgetingStack = createAppContainer(createStackNavigator({
    Budgeting: {
        screen: Budgeting
    },
    MonthlyBudgets: {
        screen:MonthlyBudgets
    },
    CategoryBudgets: {
        screen: CategoryBudgets
    },
    MarketBudgets: {
        screen: MarketBudgets
    },
    CategoryBudgetChart: {
        screen: CategoryBudgetChart
    },
    MarketBudgetChart: {
        screen: MarketBudgetChart
    }
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const SupportStack = createAppContainer(createStackNavigator({
    Support: {
        screen: Support
    },
}, {
        defaultNavigationOptions: M2bHeaderStyles
        
}));

const ReportingStack = createAppContainer(createStackNavigator({
    Reporting: {
        screen: Reporting
    },
    TaggedReporting: {
        screen: TaggedReporting
    }
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const SettingStack = createAppContainer(createStackNavigator({
    Setting: {
        screen: Setting
    },
    CompanyProfileSetting: {
        screen: CompanyProfileSetting
    },
    CategoriesSetting: {
        screen: CategoriesSetting
    },
    AddCategory: {
        screen: AddCategory
    },
    EditCategory: {
        screen: EditCategory
    },
    ViewCategory: {
        screen: ViewCategory
    }
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const SearchStack = createAppContainer(createStackNavigator({
    Search: {
        screen: Search
    },
    EditOrder: {
        screen: EditOrder
    },
    ViewOrder: {
        screen: ViewOrder
    }
}, {
        defaultNavigationOptions: M2bHeaderStyles
}));

const M2bDrawerNavigator = createDrawerNavigator({
    Dashboard: {
        screen: DashboardStack,
    },
    OpenOrders: {
        screen: OpenOrdersStack
    },
    Orders: {
        screen: OrdersStack
    },
    MarketTrips: {
        screen: MarketTripsStack
    },
    Budgeting: {
        screen: BudgetingStack
    },
    Support: {
        screen: SupportStack
    },
    Search: {
        screen: SearchStack
    },
    Setting: {
        screen: SettingStack
    },
    Reporting: {
        screen: ReportingStack
    }
}, {
    contentComponent: M2bCustomDrawer,
    unmountInactiveRoutes: true
});

const AuthStackNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    ForgotPassword: {
        screen: ForgotPassword
    }
});

const AppSwitchNavigator = createSwitchNavigator({
    AuthLoading: {screen: AuthLoadingScreen},
    Auth: { screen: AuthStackNavigator },
    Dashboard: { screen: M2bDrawerNavigator }
}, {
    initialRouteName: 'AuthLoading'
});

const Router = createAppContainer(AppSwitchNavigator)

export default Router
