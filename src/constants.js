export const LOADER_DATA = [1,2,3,4,5,6,7]
export const BASE_URL = 'https://indiscanvendor.com/api/';
export const FILE_URL = 'https://indiscanvendor.com/uploads/';
// check phone no in database
export const CHECK_USER = 'auth/phonecheck';
export const CHECK_FACE = 'auth/facecheck';
export const SIGNUP = 'auth/signup';
export const SIGNIN = 'auth/login';
// forgot pin code
export const FORGOT_PIN = 'auth/forgot/pincode';
export const FORGOT_TOKEN = 'auth/forgot/token';
// check current user in database
export const CURRENT_USER = 'auth/current';
export const STRIPE_CHARGE = 'account/charge';
// share balance between customer
export const VALIDATE_ACCOUNT = 'account/validate_before_share_balance';
export const SHARE_BALANCE = 'account/sharebalance';
// for charge user
export const VALIDATE_USER_ACCOUNT = 'vendor/validate_charge_customer';
export const CHARGE_USER = 'vendor/charge_customer';

// user face verification
export const USER_FACE_VERIFY = 'vendor/face_verification';
export const JUST_USER_VERIFY = 'vendor/verifyuserbyface';
export const VERIFICATION_LOGS = 'faceverification/logs';

// for transaction history
export const VENDOR_TRANSACTION_HISTORY = 'vendor/transactions';
export const USER_TRANSACTION_HISTORY = 'users/transactions';
export const WIDTH_DRAW_REQUEST = 'withdraw/request';
export const TRANSACTION_HISTORY_DETAIL = 'vendor/transaction';

// locate vendors
export const LOCATE_VENDORS = 'users/agentlocator';
export const GET_PROMOTIONS = 'promotions';


// IMAGES
export const IMAGES = {
    logo: require('./assets/images/indiscanlogo.png'),
}

// Toast constants
export const TOAST = {
    marginTop: 150
}

// Fonts 
export const FONTS = {
    openSans_Regular: 'OpenSans-Regular',
    opneSans_SemiBold: 'OpenSans-SemiBold',
    openSans_Bold: 'OpenSans-Bold'
}