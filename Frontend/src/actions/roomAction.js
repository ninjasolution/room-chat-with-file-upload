import { ADD_ROOM, CHANGED_ROOM, LOAD_ROOMS, REMOVE_ROOM } from "../containers"

export const addRoomAction = (roomName, password) => ({ type: ADD_ROOM, payload: { roomName, password } })
export const removeRoomAction = (roomName) => ({ type: REMOVE_ROOM, payload: { roomName } })
export const loadRoomAction = (rooms) => ({type: LOAD_ROOMS, payload: { data: rooms }})


export const changedRoomAction = ( room ) => ({ type: CHANGED_ROOM, payload: { data: room } })

