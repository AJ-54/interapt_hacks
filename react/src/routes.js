// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LocationOn from "@material-ui/icons/LocationOn";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import LocationTableList from "views/TableList/LocationTableList.js";
import ResourceTableList from "views/TableList/ResourceTableList.js";
import ContractorTableList from "views/TableList/ContractorTableList.js";

import Maps from "views/Maps/Maps.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Resource Allocation",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/location-wise",
    name: "Location Wise",
    icon: "content_paste",
    component: LocationTableList,
    layout: "/admin",
  },
  {
    path: "/contractors",
    name: "Contractors",
    icon: "content_paste",
    component: ContractorTableList,
    layout: "/admin",
  },
  {
    path: "/resource",
    name: "Resource",
    icon: "content_paste",
    component: ResourceTableList,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
  },
];

export default dashboardRoutes;
