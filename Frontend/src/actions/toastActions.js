import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()


export const toastAction = (type, content) => () => toast[type](content, { autoClose: 2000 })