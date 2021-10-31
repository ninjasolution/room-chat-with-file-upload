import io from "socket.io-client";
import { ADD_ROOM, BaseURL, LOAD_ROOMS, CHANGED_ROOM } from "../containers";
import { toastAction } from "../actions/toastActions";


export const rooms = ( state = [], { type, payload, asyncDispatch } ) => {

    switch (type) {
        case ADD_ROOM:
            return [];

        case LOAD_ROOMS:
            return payload.data;
    
        default:
            return [
                ...state,
            ]
    }
}

export const currentRoom = (state = { clients: [] }, {type, payload}) => {
    switch(type) {
        case CHANGED_ROOM:
            return {
                ...payload.data
            }
        default:
            return {
                ...state
            }
    }
}