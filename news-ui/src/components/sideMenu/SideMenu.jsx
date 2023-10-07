import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SideMenu.css";

const SideMenu = user => {
  const [sectionType, setSectionType] = useState("select");
  const navigate = useNavigate();

  const handleChange = type => {
    setSectionType(type);
    navigate(`/newscom/pending/${type}`);
  };

  return (
    <div style={{ position: 'fixed'}}className="side-menu-container">
      <nav className="navbar navbar-expand-lg navbar-dark sideMenu">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav flex-column">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  HOME
                </Link>
              </li>
              {user && (user.role === "ADMIN" || user.role === "EDITOR") && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/addUser">
                      ADD {user.target}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/searchUser">
                      SEARCH {user.target}
                    </Link>
                  </li>
                </>
              )}

              {user && user.role === "EDITOR" && (
                <>
                  <div className="form-group my-2">
                    <li className="nav-item">
                      <Link className="nav-link" to="/createAdd">
                        CREATE ADD
                      </Link>
                    </li>
                  </div>
                  <li className="nav-item">
                    <div className="form-group my-2">
                      <select
                        id="sectionType"
                        className="form-select"
                        value={sectionType}
                        onChange={e => handleChange(e.target.value)}
                      >
                        <option value="select">Approve / Disapprove</option>
                        <option value="news">News</option>
                        <option value="comments">Comment</option>
                      </select>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div className="form-group my-2">
                      <select
                        id="newsOrComment"
                        className="form-select"
                        onChange={e => {
                          const selectedOption = e.target.value;
                          if (selectedOption === "news") {
                            navigate(`/newscom/disable/${selectedOption}`);
                          } else if (selectedOption === "comments") {
                            navigate(`/newscom/disable/${selectedOption}`);
                          }
                        }}
                      >
                        <option value="">Enable / Disable</option>
                        <option value="news">News</option>
                        <option value="comments">Comment</option>
                      </select>
                    </div>
                  </li>
                </>
              )}

              {user && (user.role === "REPORTER" && user.isDisabled === false) && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/uploadNews">
                      Upload News
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/pendingNews">
                      Pending News
                    </Link>
                  </li>
                </>
              )}

              {user && (user.role === "USER" || user.role === "REPORTER") && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/showNews">
                      Show News
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/pendingComments">
                      Pending Comments
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SideMenu;
