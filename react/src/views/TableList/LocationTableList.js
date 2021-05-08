import React,{useState,useEffect} from "react";
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

const useStyles = makeStyles(styles);

function process_it(mydata){
  console.log(mydata)
  let desired = [];
  for (let d in mydata){
      let data = mydata[d];
      desired.push([data.id, data.name, data.role, data.role_level, data.gender]);
  }
  console.log(desired)
  return desired;
}

function process_it2(mydata){
  console.log(mydata)
  let desired = [];
  for (let d in mydata){
      let data = mydata[d];
      desired.push([data.id, data.name, data.start_date, data.gender]);
  }
  console.log(desired)
  return desired;
}



export default function TableList() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    location:'AZ'
  });
  const [eng,seteng] = useState({
    engineer:[]
  })
  const [ux,setux] = useState({
    ux:[]
  })
  const [pm,setpm] = useState({
    pm:[]
  })

  const handleChange = async (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    console.log("Here we are")
    const data = await axios.get(`/core/location_resources?location=${event.target.value}`)
    console.log(data)
    seteng((prev)=>({
      ...prev,
      engineer:data.data.Engr
    }))
    setpm((prev)=>({
      ...prev,
      pm:data.data.pms
    }))
    setux((prev)=>({
      ...prev,
      ux:data.data.uxs
    }))
  };
  console.log(eng,pm,ux)

  useEffect(() => {
    (async () => {
      const data = await axios.get(`/core/location_resources?location=AZ`)
      console.log(data)
      seteng((prev)=>({
        ...prev,
        engineer:data.data.Engr
      }))
      setpm((prev)=>({
        ...prev,
        pm:data.data.pms
      }))
      setux((prev)=>({
        ...prev,
        ux:data.data.uxs
      }))
    })()
  }, [])

  

  return (
    <GridContainer>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="location-id">Location</InputLabel>
        <Select
          native
          value={state.location}
          onChange={handleChange}
          inputProps={{
            name: 'location',
            'id': 'location-id'
          }}
        >
          <option aria-label="None" value="" />
          <option value={"AZ"}>AZ</option>
          <option value={"IL"}>IL</option>
          <option value={"TX"}>TX</option>
        </Select>
      </FormControl>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>List of Product Managers</h4>
            <p className={classes.cardCategoryWhite}>Location - {state.location}</p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Resource", "Start Date", "Gender"]}
              tableData={process_it2(pm.pm)}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>List of UX Designers</h4>
            <p className={classes.cardCategoryWhite}>Location - {state.location}</p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Resource", "Start Date", "Gender"]}
              tableData={process_it2(ux.ux)}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>List of Engineers</h4>
            <p className={classes.cardCategoryWhite}>Location - {state.location}</p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Resource", "Role", "Product", "Gender"]}
              tableData={process_it(eng.engineer)}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}


