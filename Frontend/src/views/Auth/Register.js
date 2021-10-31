/*eslint-disable*/
import React from "react";
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

export default function () {
  return (
    <div className="outer">
      <div className="inner">
          <MDBCard>
            <MDBCardBody>
              <MDBCardHeader className="form-header deep-blue-gradient rounded">
                <h3 className="my-3">
                  <MDBIcon icon="lock" /> Register:
                </h3>
              </MDBCardHeader>
              <form>
                <div className="grey-text">
                <MDBInput label="Your name" icon="user" group type="text" validate error="wrong"
                    success="right" />
                <MDBInput label="Your email" icon="envelope" group type="email" validate error="wrong"
                    success="right" />
                <MDBInput label="Confirm your email" icon="exclamation-triangle" group type="text" validate
                    error="wrong" success="right" />
                <MDBInput label="Your password" icon="lock" group type="password" validate />
                </div>
                <div className="text-center">
                <MDBBtn color="primary">Register</MDBBtn>
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
