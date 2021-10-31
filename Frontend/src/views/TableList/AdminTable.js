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
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, } from 'mdbreact'
import { useSelector } from 'react-redux'
import { BaseURL } from "containers";
import { Lightbox } from 'react-modal-image'
import axios from "axios";
import { useDispatch } from 'react-redux'
import { deleteFileAction } from "actions/fileAction";

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

export default function AdminTable() {

  const user = useSelector(state => state.auth.user)
  const [ imgUrl, setImgUrl ] = useState('')
  const files = useSelector(state => state.files);
  const classes = useStyles();
  const [ imgModalState, setImageModalSate ] = useState(false);
  const dispatch = useDispatch();

  const toggle = url => {
    setImageModalSate(!imgModalState)
    setImgUrl(url);
    //setModalState(!modalState)
  }

  const onFileDelete = file => {
    axios.delete(`${BaseURL}/api/file/${file}`)
      .then(res => {
        if(res.status === 200) dispatch(deleteFileAction(file))
      })
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
                files.map(m => ([m.split('-')[0], m.split('-')[1].split('.')[0], <a href="#"  onClick={() => toggle(`${BaseURL}/api/file/${m}`)}><img src={`${BaseURL}/api/file/${m}`} width={50} height={50} className="rounded-circle" alt={m}/></a>, <MDBBtn color="red" vari onClick={() => onFileDelete(m)}>Delete</MDBBtn>]))
              }
            />
          </CardBody>
        </Card>
      </GridItem>

      {
        imgModalState && 
        <Lightbox
        small={imgUrl}
        large={imgUrl}
        onClose={toggle}
        />
      }
    </GridContainer>
  );
}
