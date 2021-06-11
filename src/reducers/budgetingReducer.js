import * as Types from '../constants/actionsConstants';

const initialState = {
    isFetchingMonthlyBudgets: false,
    monthlyBudgets: [],
    isMonthlyBudgetsError: false,
    monthlyBudgetsError: '',

    isFetchingCategoryBudgets: false,
    categoryBudgets: [],
    isCategoryBudgetsError: false,
    categoryBudgetsError: '',

    isFetchingMarketBudgets: false,
    marketBudgets: [],
    isMarketBudgetsError: false,
    marketBudgetsError: ''
}

const budgetingReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case Types.FETCHING_MONTHLY_BUDGETS: {
            return {
                ...state,
                isFetchingMonthlyBudgets: true,
                isMonthlyBudgetsError: false,
                monthlyBudgetsError: '',
            }
        }
        case Types.FETCHED_MONTHLY_BUDGETS: {
            return {
                ...state,
                isFetchingMonthlyBudgets: false,
                monthlyBudgets: action.monthlyBudgets,
                isMonthlyBudgetsError: false,
                monthlyBudgetsError: '',
            }
        }
        case Types.FETCHING_MONTHLY_BUDGETS_ERROR: {
            return {
                ...state,
                isFetchingMonthlyBudgets: false,
                monthlyBudgets: [],
                isMonthlyBudgetsError: true,
                monthlyBudgetsError: action.error
            }
        }

        case Types.FETCHING_CATEGORY_BUDGETS: {
            return {
                ...state,
                isFetchingCategoryBudgets: true,
                isCategoryBudgetsError: false,
                categoryBudgetsError: ''
            }
        }
        case Types.FETCHED_CATEGORY_BUDGETS: {
            return {
                ...state,
                isFetchingCategoryBudgets: false,
                categoryBudgets: action.categoryBudgets,
                isCategoryBudgetsError: false,
                categoryBudgetsError: ''
            }
        }
        case Types.FETCHING_CATEGORY_BUDGETS_ERROR: {
            return {
                ...state,
                isCategoryBudgetsError: true,
                categoryBudgetsError: action.error,
                isFetchingCategoryBudgets: false,
                categoryBudgets: []
            }
        }

        case Types.FETCHING_MARKET_BUDGETS: {
            return {
                ...state,
                isFetchingMarketBudgets: true,
                isMarketBudgetsError: false,
                marketBudgetsError: ''
            }
        }
        case Types.FETCHED_MARKET_BUDGETS: {
            return {
                ...state,
                isFetchingMarketBudgets: false,
                marketBudgets: action.marketBudgets,
                isMarketBudgetsError: false,
                marketBudgetsError: ''
            }
        }
        case Types.FETCHING_MARKET_BUDGETS_ERROR: {
            return {
                ...state,
                isMarketBudgetsError: true,
                marketBudgetsError: action.error,
                isFetchingMarketBudgets: false,
                marketBudgets: []
            }
        }

        default: {
            return state
        }
    }
}

export default budgetingReducer 
