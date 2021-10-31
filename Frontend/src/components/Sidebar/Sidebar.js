/*eslint-disable*/
import React, { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// core components

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBBtn, MDBInput, MDBIcon, MDBContainer } from "mdbreact";
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { toastAction } from "actions/toastActions";

const useStyles = makeStyles(styles);

export default function Sidebar(props ) {
  const classes = useStyles();
  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user)
  const { handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    if(password === confirmPass) {
      toggle();
      socket.emit('createRoom', { roomName, password })
    }
  }

  const [ modalState, setModalState ] = useState(false);
  const [ roomName, setroomName ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPass, setConfirPass ] = useState('');
  const socket = useSelector(state => state.socket.socket);

  const toggle = () => {
    setModalState(!modalState)
  }

  const deleteRoom = () => {
    
    const roomName = location.pathname.split('/')[3];
    if(roomName === 'all') {
      dispatch(toastAction('warning', 'Please select a module!'));
      return;
    }
    socket.emit('deleteRoom', roomName);
    history.push('/admin/module/all');
  }

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logo, image, logoText, routes } = props;

  var links = (
    <List className={classes.list}>
      {props.routes?.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
         {
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(`${prop.layout}/module/${prop.name}`),
          });
        }
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
        });
        return (
          <NavLink
            to={`${prop.layout}/module/${prop.name}`}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <MDBIcon
                className={classNames(classes.itemIcon, whiteFontClasses, {
                  [classes.itemIconRTL]: props.rtlActive,
                })}
                icon={prop.icon}
              >
              </MDBIcon>
              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses, {
                  [classes.itemTextRTL]: props.rtlActive,
                })}
                disableTypography={true}
              />

            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );

  var brand = (
    <div className={classes.logo}>
      <Link
        to="/"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </Link>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}

          <div className={classes.sidebarWrapper}>
            {links}

            { 
              user?.whoAmI === 'admin' ?   
              (
                <MDBContainer className="d-flex justify-content-center mt-3">
                  <MDBBtn tag="a" size="sm" circle={true} gradient="purple" onClick={() => toggle()}>
                    <MDBIcon icon="plus" size="lg"/>
                  </MDBBtn>
                  <MDBBtn tag="a" size="sm" circle={true} gradient="purple" onClick={() => deleteRoom()}>
                    <MDBIcon icon="trash" size="lg"/>
                  </MDBBtn>
                </MDBContainer>
              )
               : null
            }
            </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>

      <MDBModal isOpen={modalState} toggle={() => toggle()}>
      <form  onSubmit={handleSubmit(onSubmit)}>
          <MDBModalHeader toggle={() => toggle()}>
            Modal title
          </MDBModalHeader>
          <MDBModalBody>
              <div className="grey-text">
                  <MDBInput label="Type module name" icon="users" group type="text" validate error="wrong" success="right" onChange={e => setroomName(e.target.value)} required/>
                  <MDBInput label="Type password" icon="lock" group type="password" validate onChange={e => setPassword(e.target.value)} required/>
                  <MDBInput label="Type confirm password" icon="lock" group type="password" validate onChange={e => setConfirPass(e.target.value)} required/>
              </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={() => toggle()}>
              Close
            </MDBBtn>
            <MDBBtn color="primary" type="submit">Save changes</MDBBtn>
          </MDBModalFooter>
        </form>
      </MDBModal>
  
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
