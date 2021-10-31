import { CREATE_SOCKET, IS_STOP, LOGIN } from "../containers";


export const loginAction = user => ({ type: LOGIN, payload: { data: user} })

export const createSocketAction = url => ({type: CREATE_SOCKET, payload: { data: url }})

export const isStopAction = state => ({ type: IS_STOP, payload: { data: state } })