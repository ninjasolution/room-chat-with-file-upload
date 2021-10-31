import { DELETE_FILE } from "containers"
import { ADD_FILE } from "containers"
import { LOAD_FILES } from "containers"

export const loadFilesAction = files => ({ type: LOAD_FILES, payload: { data: files } })
    
export const addFileAction = file => ({ type: ADD_FILE, payload: { data: file } })

export const deleteFileAction = file => ({ type: DELETE_FILE, payload:  { data: file } })