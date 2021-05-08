/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Resource Allocation",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/location-wise",
    name: "Location Wise",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: LocationTableList,
    layout: "/admin",
  },
  {
    path: "/contractors",
    name: "Contractors",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: ContractorTableList,
    layout: "/admin",
  },
  {
    path: "/resource",
    name: "Resource",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: ResourceTableList,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    rtlName: "خرائط",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
  },
];

export default dashboardRoutes;
