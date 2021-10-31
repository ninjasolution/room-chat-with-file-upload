/*eslint-disable*/
import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBModalFooter,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput
} from "mdbreact";
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { loginAction } from "actions/AuthActions";

export default function ({ history }) {

  const dispatch = useDispatch();
  const [ roomName, setroomName ] = useState('');
  const [ userName, setUserName ] = useState('');
  const [ password, setPassword ] = useState('');
  const socket = useSelector(state => state.socket?.socket)
  const room = useSelector(state => state.currentRoom)
  const [ whoAmI, setwhoAmI ] = useState('user')
  const [ role, setrole ] = useState('client')

  const toggle = () => {
    setrole(role === 'client' ? 'manager' : 'client');
  }

  const onLogin = (e) => {

    e.preventDefault();

    socket.emit('joinToRoom', {
      roomName,
      userName,
      password,
      role,
      whoAmI
    })

    const newRole = whoAmI === 'admin' ? 'admin' : role;

    dispatch(loginAction({userName, password, whoAmI, role: newRole}))

    if(whoAmI === 'admin' && userName === 'admin' && password === 'password') {
      history.push('/admin/module/all')
    }
  }

  useEffect(() => {
    if(room.name !== undefined) {
      history.push('/user/module/all')
    }
    
  }, [room])

  return (
    <div className="outer">
      <div className="inner">
          <MDBCard>
            <MDBCardBody>
              <MDBCardHeader className="form-header deep-blue-gradient rounded">
                <MDBContainer>
                  <MDBBtn tag="a" outline={ whoAmI !== 'user' } color="success" style={{marginLeft: '30px'}} onClick={() => setwhoAmI('user')}>
                    user
                  </MDBBtn>
                  <MDBBtn tag="a" outline={ whoAmI !== 'admin' } color="success" style={{marginLeft: '30px'}} onClick={() => setwhoAmI('admin')}>
                    admin
                  </MDBBtn>
                </MDBContainer>              
              </MDBCardHeader>
              <form>
                <div className="grey-text">
                  { whoAmI === 'user' ?  <MDBInput label="Type module name" icon="envelope" group type="text" validate error="wrong" success="right" onChange={e => setroomName(e.target.value)}/> : null}
                  
                  <MDBInput label="Type your name" icon="lock" group type="text" validate onChange={e => setUserName(e.target.value)}/>
                  <MDBInput label="Type password" icon="lock" group type="password" validate onChange={e => setPassword(e.target.value)}/>
                  { 
                    whoAmI === 'user' ? 
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" checked={role === 'manager' ? true : false} id="ismanager" onChange={e => toggle() }/>
                      <label className="custom-control-label" htmlFor="ismanager">I am a manager</label>
                    </div> : null
                  }
                
                </div>

              <div className="text-center mt-4">
                <MDBBtn color="light-blue" className="mb-3" type="submit" onClick={e => onLogin(e)}>
                  Login
                </MDBBtn>
              </div>
              </form>
              <MDBModalFooter>
                <div className="font-weight-light">
                  <a>Not a member? Sign Up</a>
                  <a>Forgot Password?</a>
                </div>
              </MDBModalFooter>
            </MDBCardBody>
          </MDBCard>
      </div>
  </div>
  );
}
