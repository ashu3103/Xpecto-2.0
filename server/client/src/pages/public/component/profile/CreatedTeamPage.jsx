import React, { useEffect } from "react";
import { useState, useRef } from "react";
import styles from "./Profile.module.css";
import styles2 from "./CreatedTeamPage.module.css";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import { ReactComponent as FixedLogo } from "../../../../svg/xpecto-logo.svg";
import { Modal, Box } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { WindowSharp } from "@mui/icons-material";

const CreatedTeamPage = () => {
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const params = useParams();

  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const teamId = params.id;

        const url = `${process.env.REACT_APP_BACKENDURL}/api/eventTeam`;

        const resp = await axios.get(`${url}/one/${teamId}`);

        console.log(resp.data.data.team);
        setTeamData((prev) => resp.data.data.team);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const profileRef = useRef(null);

  useEffect(() => {
    const current = profileRef.current;
    document.body.style.setProperty(
      "--current-page-color",
      current.getAttribute("data-color")
    );
  }, []);
  const [userdetails, setuserdetails] = useState({ data: {} });
  const getprofiledata = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKENDURL}/api/user`;
      const data = await axios.get(url);
      const usrDATA = data.data.user;
      setuserdetails((userdetails) => ({
        ...userdetails,
        ...usrDATA,
      }));
      setLoadingUser((prev) => false);
      if (usrDATA.email) {
        setIsAuthenticated((prev) => true);
      }
    } catch (err) {
      console.log(err);
      setIsAuthenticated((prev) => false);
    }
  };
  if (!loadingUser && !isAuthenticated) {
    navigate("/");
  }
  const logoutUser = () => {
    localStorage.removeItem("UserJwtToken");
    window.location.reload(false);
  };

  useEffect(() => {
    getprofiledata();
  }, []);

  const teamDeleteHandler = async () => {
    try {
      const teamId = params.id;
      const url = `${process.env.REACT_APP_BACKENDURL}/api/eventTeam`;

      const resp = await axios.delete(`${url}/deleteTeam/${teamId}`);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />
      <div
        className={`${styles["fixed-logo"]} ${styles["fixed-logo-visible"]}`}
      >
        <FixedLogo />
      </div>

      <div
        data-color="#5dd9ff"
        ref={profileRef}
        className={styles["events-page-container"]}
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/home/background.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        {!teamData || loadingUser || !isAuthenticated ? (
          <div className={styles["loading"]}>
            <ThreeCircles
              height="150px"
              width="150px"
              color="#fff"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
              outerCircleColor=""
              innerCircleColor="#5dd9ff"
              middleCircleColor=""
            />
          </div>
        ) : (
          <>
            {/* <h2 className={styles["logout-button"]} onClick={logoutUser}>
              LOGOUT
            </h2> */}
            <div className={styles["page-container"]}>
              <div className={styles2["team-main-container"]}>
                <div className={styles2["team-name-container"]}>
                  <div className={styles2["team-name"]}>
                    {teamData.teamName}
                  </div>
                </div>
                <div className={styles2["team-event-name-container"]}>
                  <div className={styles2["team-event-name"]}>
                    {teamData.game.name}
                  </div>
                </div>

                <div className={styles2["code-container"]}>
                  <div className={styles2["code"]}>
                    Code <br />
                    {teamData.code}
                  </div>
                </div>
                <div className={styles2["team-members-container"]}>
                  <div className={styles2["members-heading"]}>Members</div>

                  <div
                    key={teamData.creater._id}
                    className={styles2["member-details"]}
                  >
                    <div className={styles2["member-name"]}>
                      {"( YOU )"} - {teamData.creater.displayName}
                    </div>
                    <div className={styles2["member-email"]}>
                      {teamData.creater.email}
                    </div>
                    <div className={styles2["line"]}></div>
                  </div>

                  {teamData.players.map((mem) => {
                    if (teamData.creater._id != mem._id) {
                      return (
                        <div
                          key={mem._id}
                          className={styles2["member-details"]}
                        >
                          <div className={styles2["member-name"]}>
                            {mem.displayName}
                          </div>
                          <div className={styles2["member-email"]}>
                            {mem.email}
                          </div>
                          <div className={styles2["line"]}></div>
                        </div>
                      );
                    } else return null;
                  })}
                </div>
                <div className={styles2["team-delete-container"]}>
                  <button
                    className={styles2["team-delete"]}
                    onClick={teamDeleteHandler}
                  >
                    Delete Team
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreatedTeamPage;
