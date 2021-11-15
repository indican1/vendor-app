import { UPDATE_BALANCE, UPDATE_RECENT, USER_INFO } from "../action/types";

const initialState = {
    user:{
        _id: ''
    },
    recentArray: []
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_INFO:
            return {
                ...state,
                user: action.obj
            }
        
        case UPDATE_BALANCE:
            const newUser = {...state.user}
            newUser.wallet = action.amount
            return {
                ...state,
                user: newUser
            }
        case UPDATE_RECENT:
            return {
                ...state,
                recentArray: action.array
            }
        default:
            return state;
    }
}

export default userReducer;