import {React,useEffect,useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from "../../http/axios"

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

function process_it(mydata){
  console.log(mydata)
  let desired = [];
  for (let d in mydata){
      let data = mydata[d];
      desired.push([data.location,data.total]);
  }
  console.log(desired)
  return desired;
}

function process_it2(mydata){
  console.log(mydata)
  let desired = [];
  for (let d in mydata){
      let data = mydata[d];
      desired.push([data.vendor.name,data.total]);
  }
  console.log(desired)
  return desired;
}

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const [vendor,setvendor] = useState({
    vendor:[]
  })
  const [location,setlocation] = useState({
    location:[]
  })
  useEffect(() => {
    (async () => {
      const data = await axios.get(`/core/contractor_count`)
      console.log(data.data)
      setvendor((prev)=>({
        ...prev,
        vendor:data.data.Vendor
      }))
      setlocation((prev)=>({
        ...prev,
        location:data.data.location_wise
      }))
    })()
  }, [])  
  console.log(vendor)
  console.log(location)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Location Wise Resources</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Count"]}
              tableData={process_it(location.location)}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Vendor Wise Resources</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Count"]}
              tableData={process_it2(vendor.vendor)}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
