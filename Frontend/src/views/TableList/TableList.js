import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact'
import { useSelector } from 'react-redux'

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
const strTemp = "ssssssssssssssssssssssssssssssssssssssssssssdafasdfsdfs";

export default function TableList() {

  const [ modalState, setModalState ] = useState(false);
  const [ modalContent, setModalContent ] = useState(false);
  const user = useSelector(state => state.auth.user)
  const messages = useSelector(state => state.messages);
  const classes = useStyles();

  const toggle = content => {
    setModalContent(content);
    setModalState(!modalState)
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Welcome, {user?.userName}</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["From", "Date", "Content", "action"]}
              tableData={
                messages.map(m => ([m.from, m.date, `${m.content.substring(0, 20)}${m.content.length > 20? '...' : ''}`, <MDBBtn className="btn btn-primary" onClick={() => toggle(m.content)}>More</MDBBtn>]))
              }
            />
          </CardBody>
        </Card>
      </GridItem>
      <MDBModal isOpen={modalState} toggle={() => toggle(2)}>
        <MDBModalHeader toggle={() => toggle(13)}>
          Content
        </MDBModalHeader>
        <MDBModalBody>
         {
           modalContent
         }
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={() => toggle(13)}>
            Close
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </GridContainer>
  );
}
