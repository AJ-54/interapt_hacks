import React, { useEffect } from "react";
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
import Table from "components/Table/Table.js";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import { SettingsInputComponent } from "@material-ui/icons";
import FormControl from '@material-ui/core/FormControl';


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
import { useState } from "react";
const useStyles = makeStyles(styles);

function process_it(mydata) {
  console.log(mydata);
  let desired = [];
  for (let k in mydata) {
    let v = mydata[k]
    for(let j of v){
      console.log(j)
      desired.push([j.id, j.resource.name, k]);
    }
  }
  console.log(desired);
  return desired;
}

export default function UserProfile() {
  const [data, setdata] = useState({});
  const [state, setState] = React.useState({
    security: false,
    pm: false,
    ux: false,
    anchor: false,
  });
  const [products, setproducts] = React.useState([]);
  const [product,setproduct] = useState({});


  const handleSubmit = async () => {
    let query_str = ""
    if(state.security){
      query_str+="security_maven=1&"
    }
    if(state.pm){
      query_str+="PM=1&"
    }
    if(state.ux){
      query_str+="UX=1&"
    }
    if(state.anchor){
      query_str+="anchor=1&"
    }
    console.log(product)
    const result = await axios.get(`/core/product_resource_position/${product.product}?${query_str}`)
    console.log(result)
    setdata(result.data)
  };
  useEffect(() => {
    (async () => {
      const result = await axios.get("/core/active_products");
      console.log(result.data)
      setproducts(result.data);
    })();
  }, []);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleProduct = (event) => {
    setproduct((prev)=>({
      ...prev,
      product:event.target.value
    }))
  }
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Get Product Details</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="product-id">Product</InputLabel>
                    <Select
                      native
                      value={product?.product_title}
                      onChange={handleProduct}
                      inputProps={{
                        name: "Products name",
                        id: "product-id",
                      }}
                    >
                      <option aria-label="None" value="" />
                      {products &&
                        products.map((el) => {
                          return <option value={el.id}>{el.product_title}</option>;
                        })}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.security}
                        onChange={handleChange}
                        name="security"
                        color="primary"
                      />
                    }
                    label="Security Maven"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.pm}
                        onChange={handleChange}
                        name="pm"
                        color="primary"
                      />
                    }
                    label="Product Manager"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.ux}
                        onChange={handleChange}
                        name="ux"
                        color="primary"
                      />
                    }
                    label="UX"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.anchor}
                        onChange={handleChange}
                        name="anchor"
                        color="primary"
                      />
                    }
                    label="Anchor"
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={handleSubmit}>
                Get Details
              </Button>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={8} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Allocated Resources</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Resource Name", "Role Level"]}
                tableData={process_it(data)}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
