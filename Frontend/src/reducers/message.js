import { ADD_MESSAGE } from "containers";


export const messages = ( state = [], { type, payload, asyncDispatch } ) => {

    switch (type) {
        case ADD_MESSAGE:
            const message = {
                from: payload.data.from,
                date: payload.data.createdAt,
                content: payload.data.content
            };
            return [
                ...state,
                message
            ];

        
        default:
            return [
                ...state,
            ]
    }
}

