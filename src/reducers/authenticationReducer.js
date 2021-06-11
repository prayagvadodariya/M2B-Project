import * as Types from '../constants/actionsConstants';

const initialState = {
  isAuthenticating: false,
  userData: {},
  isError: false,
  error: ''
}

const authenticationReducer = (state = initialState, action) => {

  switch (action.type) {
    case Types.AUTHENTICATING: {
      return {
        ...state,
        isAuthenticating: true
      }
    }
    case Types.AUTHENTICATED: {
      return {
        ...state,
        isAuthenticating: false
      }
    }
    case Types.USER_FOUND: {
      return {
        ...state,
        isAuthenticating: false,
        isError: false,
        error: '',
        userData: action.data
      }
    }
    case Types.AUTH_ERROR: {
      return {
        ...state,
        isAuthenticating: false,
        isError: true,
        error: action.error
      }
    }
    default: {
      return state
    }
  }

}

export default authenticationReducer
