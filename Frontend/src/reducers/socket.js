import io from "socket.io-client";
import { CREATE_SOCKET } from "../containers";
import { toastAction } from "../actions/toastActions";
import { changedRoomAction, loadRoomAction, rateSetAction } from "../actions/roomAction";
import { loginAction } from "actions/AuthActions";
import { push } from 'connected-react-router'
import { receivedMessageAction } from "actions/messageActions";
import { isStopAction } from "actions/AuthActions";
import { loadFilesAction } from "actions/fileAction";
import { addFileAction } from "actions/fileAction";
import { deleteFileAction } from "actions/fileAction";

export const socket = ( state = {}, { type, payload, asyncDispatch } ) => {

    switch (type) {
        case CREATE_SOCKET:
            const socket = io.connect(payload.data);
            socket.on('changedRoom', room => {
                asyncDispatch(changedRoomAction(room))
              })

            socket.on('setStop', state => {
                asyncDispatch(isStopAction(state))
            })

            socket.on('msgToClientsOfMyRoom', req => {
                asyncDispatch(receivedMessageAction(req))
            })
            
            socket.on('allRomes', rooms => {
                asyncDispatch(loadRoomAction(rooms))
            })
     
            socket.on('allFiles', files => {
                asyncDispatch(loadFilesAction(files))
            })

            socket.on('newFile', file => {
                asyncDispatch(addFileAction(file))
            })

            socket.on('deleteFile', file => {
                asyncDispatch(deleteFileAction(file))
            })

            return {
                socket
            }
    
        default:
            return {
                ...state,
            }
    }
}