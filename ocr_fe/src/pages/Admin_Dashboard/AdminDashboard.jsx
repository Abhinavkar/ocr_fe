import React from 'react'
import "./style.css" 
// @import "variables"
import "./style.scss"

import SearchSvg from "../../assets/images/search.svg"
import NotificationsSvg from "../../assets/images/notifications.svg"
import MoonSolidSvg from "../../assets/images/moon-solid.svg"
import InfoOutlineSvg from "../../assets/images/info_outline.svg"
import AvatarPng from "../../assets/images/avatar.png"
import LogoSvg from "../../assets/images/logo.svg"
import DashboardPng from "../../assets/images/dashboard.png"
import DownloadPng from "../../assets/images/download.png"
import NewsFeedPng from "../../assets/images/news-feed.png"
import UpcomingEventsPng from "../../assets/images/upcoming-events.png"
import CareersPng from "../../assets/images/careers.png"
import LogoutPng from "../../assets/images/logout.png"
import UploadPng from "../../assets/images/upload.png"
import ArrowDownSvg from "../../assets/images/arrow-down.svg"



export const AdminDashboard = () => {
  return (
    <>
        <div className="wrapper">
            <header>
                <div class="d-flex justify-content-between">
                    <h2 class="heading">Question & Answer Admin Dashboard</h2>
                    <div class="search-profile-blk">
                        <div class="position-relative search-blk">
                            {/* <span class="search-icon">
                                <img src={SearchSvg} />
                            </span> */}
                            <input type="text" clayss="form-control" placeholder="Search..." autocomplete="off"
                                id="search-options" value=""/>
                        </div>
                        <ul class="nav">
                            <li class="nav-item">
                                <a class="nav-link" href="#"><img src={NotificationsSvg} /></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"><img src={MoonSolidSvg} /></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"><img src={InfoOutlineSvg} /></a>
                            </li>
                            <li class="nav-item">
                                <div class="dropdown">
                                    <div class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={AvatarPng} />
                                    </div>
                                    {/* <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">Profile</a></li>
                                        <li><a class="dropdown-item" href="#">Logout</a></li>
                                    </ul> */}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <div class="sidenav">
                <div class="logo">
                    <img src={LogoSvg} />
                </div>
                <ul class="">
                    <li class="active"><a href="javascript:void()"><span><img src={DashboardPng} /></span>Dashboard</a></li>
                    <li><a href="javascript:void()"><span><img src={DownloadPng} /></span> Result Download</a></li>
                    {/* <li><a href="javascript:void()"><span><img src={NewsFeedPng} /></span>News Feed</a></li>
                    <li><a href="javascript:void()"><span><img src={UpcomingEventsPng} /></span>Upcoming Events</a>
                    </li>
                    <li><a href="javascript:void()"><span><img src={CareersPng} /></span>Careers</a></li> */}
                    <li><a href="javascript:void()"><span><img src={LogoutPng} /></span>Logout</a></li>
                </ul>
                {/* <div class="survey-blk">
                    <h5>Send Survey</h5>
                    <p>Send your survey for
                        Alumni</p>
                    <button class="btn-fill w-100" data-bs-toggle="modal" data-bs-target="#sendSurveyModal">Send</button>
                </div> */}
            </div>
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <div class="common-box">
                            <div class="row align-items-start">
                                <div class="col-md-6 pe-5">
                                    <div class="form-group d-flex mb-3">
                                        <label class="col-sm-3 col-form-label label">Class</label>
                                        <div class="col-sm-9">
                                            <div class="downcaret-icon">
                                            <select class="form-control">
                                                <option>Class 1</option>
                                                <option>Class 2</option>
                                                <option>Class 3</option>
                                                <option>Class 4</option>
                                                <option>Class 5</option>
                                                <option>Class 6</option>
                                                <option>Class 7</option>
                                                <option>Class 8</option>
                                                <option>Class 9</option>
                                                <option>Class 10</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group d-flex">
                                        <label for="title" class="col-sm-3 col-form-label label">Subject</label>
                                        <div class="col-sm-9">
                                            <div class="downcaret-icon">
                                                <select class="form-control">
                                                    <option>History</option>
                                                    <option>Geography</option>
                                                    <option>Science</option>
                                                    <option>English</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 d-flex ps-5 align-items-center">
    
                                    <form class="" enctype='multipart/form-data'>
                                        <div class="upload-files-container">
                                            <div class="">
                                                <span class="upload-icon"> <img src={UploadPng} /> </span>
                                                <h3 class="dynamic-message"> Upload Files</h3>
                                                <div class="">
                                                    <span class="browse-files">
                                                        <input type="file" class="default-file-input" />
                                                        <span class="browse-files-text">PNG, JPG and GIF files
                                                            areallowed</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <span class="cannot-upload-message"> Please select a file first </span>
    
                                        </div>
                                    </form>
                                    <div class="content-blk">
                                        <h3 class="subheading">Upload Document</h3>
                                        <p class="content">Upload all your required Documents here</p>
                                        <button class="btn-fill">Upload </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 class="heading mt20">Document Requests</h2>
                        <div class="common-box">
                            <div class="table-responsive">
                                <table class="table custom-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">User <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Class <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Subject <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Uploaded Date <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Status <span><img src={ArrowDownSvg} /></span></th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Kapilsharma0403</td>
                                            <td>Need to get my exit letter.</td>
                                            <td>Aug. 12. 2024, 11:16 a.m.</td>
                                            <td>Aug. 12. 2024, 11:16 a.m.</td>
                                            <td>
                                                <div class="downcaret-icon">
                                                    <select class="form-control">
                                                        <option>Open</option>
                                                        <option>Close</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="modal fade custom-modal" id="sendSurveyModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-body">
                        <h2 class="heading text-center">Do you want to send survey to the alumni?</h2>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-fill" data-bs-dismiss="modal">Yes</button>
                        <button type="button" class="btn btn-outline" data-bs-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    
  )
}
