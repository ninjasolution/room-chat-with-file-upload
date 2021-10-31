import { DELETE_FILE } from "containers";
import { ADD_FILE } from "containers";
import { LOAD_FILES } from "containers";

export const files = ( state = [], { type, payload, asyncDispatch } ) => {

    switch (type) {
        case LOAD_FILES:
            return payload.data;
        case ADD_FILE:
            return [
                ...state,
                payload.data
            ]
        case DELETE_FILE:
            return state.filter( f => f !== payload.data )
        default:
            return [
                ...state,
            ]
    }
}
