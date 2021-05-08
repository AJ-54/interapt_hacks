import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};
import axios from "http/axios";
import {useState} from "react";
const useStyles = makeStyles(styles);

export default function UserProfile() {
  
  const [data, setdata] = useState({});
  const [resources, setresources] = useState({});
  const handleSubmit =async ()=>{
        let result=await axios.post("/core/allocate_resources/",data);
        setresources(result.data)
  }
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                Allocate Resources for New Product
              </h4>
              <p className={classes.cardCategoryWhite}>Provide details</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Number of Senior resources"
                    id="senior"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(e)=>setdata(prev=>({...prev,requirements:{...prev.requirements,Senior:e.target.value}}))}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Junior resources"
                    id="junior"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(e)=>setdata(prev=>({...prev,requirements:{...prev.requirements,Junior:e.target.value}}))}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Mid resources"
                    id="mid"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(e)=>setdata(prev=>({...prev,requirements:{...prev.requirements,Mid:e.target.value}}))}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Start Date (yyyy-dd-mm)"
                    id="start"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="End Date (yyyy-dd-mm)"
                    id="last"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(e)=>setdata(prev=>({...prev,end_date:e.target.value}))}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(e)=>setdata(prev=>({...prev,start_date:e.target.value}))}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={handleSubmit}>Allocate Resources</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
