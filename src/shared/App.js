import "./App.css";
import React from "react";
import styled from "styled-components";

import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Permit from "./Permit";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";
import Search from "./Search";
import Notification from "../pages/Notification";

import Header from "../components/Header";
import { Grid, Button } from "../elements/Index2";

import {useDispatch, useSelector} from "react-redux"
import { actionCreators as userActions} from "../redux/modules/user";
import {apiKey} from "./firebase";

function App() {
  const dispatch = useDispatch();

    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_session = sessionStorage.getItem(_session_key)? true: false;
  
    React.useEffect(() => {

    if (is_session){
      dispatch(userActions.loginCheckFB());
    }
    
  }, []);
  

  return (
    <React.Fragment>
      <Wrap>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write/:id" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/search" exact component={Search} />
          <Route path="/noti" exact component={Notification} />
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button is_float text="+" _onClick={() => {history.push("/write");}}></Button>
        {/* <div style={{backgroundColor: "#888", width: '50px', height: '50px'}}>
          글쓰기</div> */}
      </Permit>
      </Wrap>
    </React.Fragment>
  );
}

const Wrap = styled.div`
margin: auto;
max-width: 780px;
justify-content: center;
`;

export default App;
