import { combineReducers } from 'redux'
import { auth, isStop } from './authenticatedUser'
import { socket } from './socket'
import { rooms } from './room'
import { currentRoom } from './room'
import { messages } from './message'
import { files } from './files'
import { connectRouter, routerMiddleware } from 'connected-react-router'

export default history => combineReducers({
                            router : connectRouter(history),
                            auth,
                            socket,
                            rooms,
                            currentRoom,
                            messages,
                            isStop,
                            files
                          });

