import { UPDATE_BALANCE, UPDATE_RECENT, USER_INFO } from './types';

export const setUser = (obj) => ({
    type: USER_INFO,
    obj
})

export const updateBalance = (amount) => ({
    type: UPDATE_BALANCE,
    amount
})

export const recentActivity = (array) => ({
    type: UPDATE_RECENT,
    array
})