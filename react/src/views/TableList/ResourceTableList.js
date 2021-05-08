import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import { SettingsInputComponent } from "@material-ui/icons";

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
import {useEffect,useState} from "react";
import axios from "http/axios"
const useStyles = makeStyles(styles);

export default function TableList() {
  const [resource, setresource] = useState({})
  const [resources, setresources] = useState([]);
  const [skills, setskills] = useState("");
  
  useEffect(()=>{
    (async()=>{
      let result=await axios.get("/core/resources");
      setresources(result.data);
    })();
  },[])
  const handleChange=(e)=>{
     (async()=>{
      let result=await axios.get(`/core/resource_skills/${e.target.value}`);
      setresource(result.data);
      setskills(prev=>{
        let s="";
        for(let el of result.data.skills){
          s+=el.title+",";
        }
        return s;
      });
    })();
  }
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <FormControl className={classes.formControl}>
        <InputLabel htmlFor="location-id">Location</InputLabel>
        <Select
          native
          value={resource?.name}
          onChange={handleChange}
          inputProps={{
            name: 'Resources name',
            'id': 'location-id'
          }}
        >
          <option aria-label="None" value="" />
          {resources&&resources.map(el=>{
            return <option value={el.id}>{el.name}</option>
})}
        </Select>
      </FormControl>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Resource Information</h4>
            <p className={classes.cardCategoryWhite}>
              Here is the data for the resource
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "SkillSet"]}
              tableData={[[resource?.name, skills]]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
