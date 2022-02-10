import React from "react";
import { Grid, Text, Button } from "../elements/Index2";
// import { getCookie, deleteCookie } from "../shared/Cookie";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";

import NotiBadge from "./NotiBadge";
import HomeIcon from "@material-ui/icons/Home";


const Header = (props) => {
  const dispatch = useDispatch();
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  const is_login = useSelector((state) => state.user.is_login);
  console.log("is_login : " + is_login);

  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  console.log("is_session :" + is_session);

  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid is_flex padding="4px 16px">
          <Grid>
            <HomeIcon fontSize="large"
              onClick={() => {
                history.replace("/");
              }}
              margin="0px"
              // size="25px"
              cursor="pointer"
            >
            </HomeIcon>
          </Grid>

          <Grid is_flex>
            {/* <Button text="내정보"></Button> */}

            <NotiBadge
              _onClick={() => {
                history.push("/noti");
              }}
            />

            <Button
              text="로그아웃"
              _onClick={() => {
                dispatch(userActions.logoutFB());
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <HomeIcon fontSize="large"
            _onClick={() => {
              history.replace("/");
              window.location.reload();
            }}
            margin="0px"
            // size="25px"
            cursor="pointer"
          >
          </HomeIcon>
        </Grid>

        <Grid is_flex>
          <Button
            text="로그인"
            _onClick={() => {
              history.push("/login");
            }}
          ></Button>
          <Button
            text="회원가입"
            _onClick={() => {
              history.push("/signup");
            }}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
