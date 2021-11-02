import React, { useState, useEffect } from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Sidebar from "components/Sidebar/Sidebar.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/new_logo.png";
import TableList from "views/TableList/AdminTable";
import Searchstyles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import UserTable from "views/TableList/UserTable";

const useSeachStyles = makeStyles(Searchstyles);

let ps;


const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const rooms = useSelector(state => state.rooms)
  const socket = useSelector(state => state.socket.socket)
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  const user = useSelector(state => state.auth.user);
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const searchClasses = useSeachStyles();
  const [ msgContent, setmsgContent ] = useState('')
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if(typeof user === "undefined" || user === null) {
      history.push('/login')
    }
    
  }, [user])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
 
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const sendMessage = e => {
 
    if(e.key === 'Enter') {
        if(user.role === 'manager') setTarget('client')
        socket.emit('msgToAllClients', {  content: msgContent })
    }
  }

  useEffect(() => {
    socket.emit('loadFiles', true);
  }, [socket])

  // initialize and destroy the PerfectScrollbar plugin
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
        routes={ rooms.map( r => ({
          name: r.name,
          icon: "users",
          layout: "/admin",
          ...r
        })) }
        logoText={"Module list"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          <div className={classes.content}>
            <div className={classes.container}>
            {
              location.pathname.split('/')[3] === 'all' && <TableList/>
            }
            
            {
              location.pathname.split('/')[3] !== 'all' && <UserTable/>
            }
            </div>
          </div>
     </div>
    
     {/* <MDBContainer style={{ position: "fixed", zIndex: "4", bottom: "20px", width: '400px', height: '50px', right: '50px', backgroundColor: '#4f4f4ff5', borderRadius: '7px', padding: '10px' }}>
      <Input
          style={{color: 'white', width: '350px'}}
          onKeyDown={sendMessage}
          onChange={e => setmsgContent(e.target.value)}
          defaultValue={msgContent}
        />
        <MDBIcon icon="comment" size="10px" style={{color: "white", marginLeft: '10px'}}/>
      </MDBContainer> */}
    </div>
  );
}
