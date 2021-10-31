import React, { useState, useEffect } from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "components/Sidebar/Sidebar.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/new_logo.png";
import TableList from "views/TableList/TableList";
import { useSelector } from 'react-redux'
import { MDBBtn, MDBContainer, MDBIcon } from "mdbreact";
import { TextField } from "@material-ui/core";
import { useDispatch } from 'react-redux'
import { toastAction } from "actions/toastActions";
import { FileUploader } from "react-drag-drop-files";
import axios from 'axios'
import { BaseURL } from "containers";
import { useHistory } from 'react-router-dom'

let ps;

const fileTypes = ["JPG", "PNG", "GIF", "MP4", "MP3", "jpeg"];

const useStyles = makeStyles(styles);
const useInputStyle = makeStyles({
  input: {
    color: "white"
  }
});

export default function User({ ...rest }) {
  // styles
  const classes = useStyles();
  const inputClasses = useInputStyle();
  const dispatch = useDispatch();
  const mainPanel = React.createRef();
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const currentRoom = useSelector(state => state.currentRoom)
  const socket = useSelector(state => state.socket.socket)
  const user = useSelector(state => state.auth.user);
  const globalIsStop = useSelector(state => state.isStop)
  const [ target, setTarget ] = useState('manager')
  const [ msgContent, setmsgContent ] = useState('')
  const [ isStop, setIsStop ] = useState(false)
  const history = useHistory();
  let selectedFile

  useEffect(() => {
    if(typeof user === "undefined" || user === null) {
      history.push('/login')
    }
  }, [user])

  const handleChange = (file) => {
    
    if(file === selectedFile) return;
    selectedFile = file;

    var formData = new FormData();

    formData.append('file', file)

    axios.post(`${BaseURL}/api/file/upload/${currentRoom.name}`, formData)
      .then(res => {
        if(res.status === 200)
        dispatch(toastAction('success', 'Uploading is successed!'));
      })
  };

  const toggleStop = () => {

    socket.emit('setStop', { roomName: currentRoom.name, state: !isStop })
    setIsStop(!isStop);

  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
 
  const sendMessage = e => {
    if(e.key === 'Enter') {
        if(typeof user === "undefined" || user === null) return
        setmsgContent('')
        if(globalIsStop === true) {
          dispatch(toastAction('warning', 'All action is stoped!'))
          return;
        }
        if(user.role === 'manager') setTarget('client')
        socket.emit('msgToClientsOfMyRoom', { target, from: user.userName, roomName: currentRoom.name, content: msgContent })
    }
  }

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={currentRoom.name === undefined ? [] : currentRoom.clients.map(c => ({
          name: c.userName,
          rtlName: "Job List",
          icon: "user",
          layout: "/user",
          ...c
        }))}
        logoText={currentRoom.name}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        {
          user?.role !== 'manager' ? 
            <MDBContainer>
              <MDBBtn tag="a" size="lg" outline={ target !== 'manager' } color="success" style={{marginLeft: '30px'}} onClick={() => setTarget('manager')}>
                To manager
              </MDBBtn>
              <MDBBtn tag="a" size="lg" outline={ target !== 'client' } color="success" style={{marginLeft: '30px'}} onClick={() => setTarget('client')}>
                To all clients
              </MDBBtn>
            </MDBContainer> : 
             <MDBBtn tag="a" size="lg" outline={ !isStop } color="success" style={{marginLeft: '30px'}} onClick={() => toggleStop()}>
              { isStop ? 'Is stoped' : 'Stop' }
           </MDBBtn>
        }
        <div className={classes.container}>
          <TableList/>
        </div>
     </div>

      <MDBContainer style={{ position: "fixed", zIndex: "4", bottom: "100px", width: '400px', height: '50px', right: '50px', padding: '10px' }}>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
      </MDBContainer>

     <MDBContainer style={{ position: "fixed", zIndex: "4", bottom: "20px", width: '400px', height: '50px', right: '50px', backgroundColor: '#4f4f4f', borderRadius: '7px', padding: '10px' }}>
      <TextField
          style={{width: '350px'}}
          inputProps={{
            className: inputClasses.input
          }}
          onKeyDown={sendMessage}
          onChange={e => setmsgContent(e.target.value)}
          value={msgContent}
        />
        <MDBIcon icon="comment" size="10px" style={{color: "white", marginLeft: '10px'}}/>
      </MDBContainer>
    </div>
  );
}

