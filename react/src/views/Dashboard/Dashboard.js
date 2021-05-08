import React from "react";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Store from "@material-ui/icons/Store";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {useEffect,useState} from "react";


import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "http/axios"
const useStyles = makeStyles(styles);

export default function Dashboard() {
  const [cardData, setcardData] = useState(null);
  const [nextrotationdata, setnextrotationdata] = useState([[]]);
  const [plotData1, setplotData1] = useState({});
  const [plotData2, setplotData2] = useState({});
  const [plotData3, setplotData3] = useState({});
  
  const classes = useStyles();
  useEffect(()=>{
    (async()=>{
       let result = await axios.get("/core/dashboard_data");
       console.log(result)
       let data= result.data;
       setcardData(data);
       result = await axios.get("/core/diversity");
       data=result.data;
       setplotData1(prev=>(
         {
           ...prev,
                ...{
          labels: [
            "Male",
            "Female",
            "Others"
          ],
          series: [[data.total.male,data.gender.male.colored,data.gender.male.not_colored],[data.total.female,data.gender.female.colored,data.gender.female.not_colored],[data.total.other,data.gender.other.colored,data.gender.other.not_colored]],
       },
         }
       ));
       result = await axios.get("/core/resource_ratio");
       data= result.data;
       setplotData2(prev=>(
         {
           ...prev,
                ...{
          labels: [
            "PM",
            "UX",
            "Engr"
          ],
          series: [[data.pms,data.uxs,data.Engr]],
       },
         }
       ));
       
       result = await axios.get("/core/engr_ratio");
        data=result.data;
       setplotData3(prev=>(
         {
           ...prev,
          ...{
          labels: [
            "Junior",
            "Mid",
            "Senior"
          ],
          series: [[data.junior,data.senior,data.mid]],
       },
         }
       ));
       result = await axios.get("/core/next_rotation_resources");
       data=result.data;
       console.log(data)
       setnextrotationdata(prev=>{
         let give=data.map((el,id)=>{
              let arr=[id+1];
              arr.push(el.resource);
              arr.push(el.product);
              arr.push(el.days)
              return arr;
         })
         return give;
       });    
    })()
  },[])
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Ongoing Products</p>
  <h3 className={classes.cardTitle}>{cardData?.active_products}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                All Offices
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Resources Count</p>
              <h3 className={classes.cardTitle}>{cardData?.resources}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Ongoing + Available
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Vendors</p>
              <h3 className={classes.cardTitle}>{cardData?.contractors}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                All Offices
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Completed Products</p>
              <h3 className={classes.cardTitle}>{cardData?.completed_products}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                All Offices
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={plotData1}
                type="Bar"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Gender Ratio/ Diversity</h4>
              <p className={classes.cardCategory}>Diversity in all offices</p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={plotData2}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>PM : UX : Engineer</h4>
              <p className={classes.cardCategory}>Includes contractors</p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={plotData3}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Engineer Distribution</h4>
              <p className={classes.cardCategory}>Includes Contractors</p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Bugs",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                ),
              },
              {
                tabName: "Website",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                ),
              },
              {
                tabName: "Server",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>
                Resource Ready For Next Rotation ?
              </h4>
              <p className={classes.cardCategoryWhite}>
                Lists resources working on their products in descending order of
                days spend
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Resource", "Product", "Days"]}
                tableData={nextrotationdata}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
