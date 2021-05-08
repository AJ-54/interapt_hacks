import React from "react";
import "./Home.css";
import { ReactComponent as HomeLogo } from "./home.svg";
import {Link} from 'react-router-dom'

function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar navbar-fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            Enterprise Dashboard
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#basicExampleNav"
            aria-controls="basicExampleNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="basicExampleNav">
            <ul className="navbar-nav mr-auto smooth-scroll">
              <li className="nav-item">
                <a className="nav-link" href="#intro">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/dashboard">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="header">
        <div className="inner-header flex">
          <div id="intro" className="view">
            <div className="mask rgba-black-strong">
              <div className="container-fluid d-flex align-items-center justify-content-center h-100">
                <div className="row d-flex justify-content-center text-center">
                  <div className="col-md-10">
                    <h2 className="display-4 font-weight-bold white-text pt-5 mb-2">
                      Shannon Enterprise
                    </h2>

                    <hr className="hr-light" />

                    <h4 className="white-text my-4">
                      Welcome to the Shannon Enterprise. This portal gives
                      access to all ongoing projects and our resources.
                    </h4>
                    <Link to ="/admin/dashboard" >
                    <button type="button" className="btn btn-outline-white">
                      Dashboard<i className="fa fa-book ml-2"></i>
                    </button>
                   </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
            <HomeLogo/>
        </div>
      </div>
      <div className="content flex"></div>
      <main className="mt-5">
        <div className="container">
          <section id="services" className="text-center">
            <h2 className="mb-5 font-weight-bold">Our Services</h2>

            <div className="row d-flex justify-content-center mb-4">
              <div className="col-md-8">
                <p className="grey-text">
                  We create apps to drive business performance and provide
                  custom training to solve the tech talent gap. With a
                  dedication to innovation and advancement, Interapt transforms
                  clients and empowers humans through technology.
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-5">
                <i className="fa fa-camera-retro fa-4x orange-text"></i>
                <h4 className="my-4 font-weight-bold">Experience</h4>
                <p className="grey-text">
                  Get the best application experience delivered within the
                  timeframe!
                </p>
              </div>

              <div className="col-md-4 mb-1">
                <i className="fa fa-heart fa-4x orange-text"></i>
                <h4 className="my-4 font-weight-bold">Happiness</h4>
                <p className="grey-text">
                  We respect deadlines and quality. Happiness is delivered at
                  every stage of the work!
                </p>
              </div>

              <div className="col-md-4 mb-1">
                <i className="fa fa-bicycle fa-4x orange-text"></i>
                <h4 className="my-4 font-weight-bold">Adventure</h4>
                <p className="grey-text">
                  Every project brings out the adventure for us. We learn and
                  grow all the time.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="page-footer font-small unique-color-dark">
        <div className="footer-copyright text-center py-3">
          © 2021 Copyright:
          <a href="#">Lone_Developers</a>
        </div>
      </footer>
    </>
  );
}

export default Home;
