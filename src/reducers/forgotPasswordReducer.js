import * as Types from '../constants/actionsConstants';

const initialState = {
    isSendingVerificationCode: false,
    email: '', 
    isSendingVerificationCodeError: false,
    sendingVerificationCodeError: '',
    isValidatingCode: false,
    code: '',
    isValidatingCodeError: false,
    validatingError: '',
    isGeneratingNewPassword: false,
    isGeneratingNewPasswordError: false,
    generatingNewPasswordError: ''
}

const forgotPasswordReducer = (state = initialState, action) => {

    switch (action.type) {
        case Types.SENDING_VERIFICATION_CODE: {
            return {
                ...state,
                isSendingVerificationCode: true
            }
        }
        case Types.SENDING_VERIFICATION_CODE_ERROR: {
            return {
                ...state,
                isSendingVerificationCode: false,
                isSendingVerificationCodeError: true,
                sendingVerificationCodeError: action.error
            }
        }
        case Types.CODE_SENT: {
            return {
                ...state,
                email: action.email,
                isSendingVerificationCode: false,
                isSendingVerificationCodeError: false
            }
        }
        case Types.VALIDATING_CODE: {
            return {
                ...state,
                isValidatingCode: true
            }
        }
        case Types.VALIDATING_ERROR: {
            return {
                ...state,
                isValidatingCodeError: true,
                validatingError: action.error
            }
        }
        case Types.VALIDATED_CODE: {
            return {
                ...state,
                isValidatingCode: false,
                code: action.code,
                isValidatingCodeError: false
            }
        }
        case Types.GENERATING_NEW_PASSWORD: {
            return {
                ...state,
                isGeneratingNewPassword: true
            }
        }
        case Types.GENERATING_NEW_PASSWORD_ERROR: {
            return {
                ...state,
                isGeneratingNewPasswordError: true,
                generatingNewPasswordError: action.error
            }
        }
        case Types.GENERATED_NEW_PASSWORD: {
            return {
                ...state,
                isGeneratingNewPassword: false,
                isGeneratingNewPasswordError: false
            }
        }
        default: {
            return state;
        }
    }

}

export default forgotPasswordReducer
