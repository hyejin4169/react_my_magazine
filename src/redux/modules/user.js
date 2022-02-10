import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { authService } from "../../shared/firebase";
import {
  getAuth,
  setPersistence,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// actions
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators

const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

// middleware actions (firebase에서 가져온 기능 쓰기)
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    // const auth = getAuth(); 이게 authservice라 주석처리
    //로그인 state 유지
    setPersistence(authService, browserSessionPersistence).then((res) => {
      console.log("세션 추가");
      console.log(id, pwd);
      signInWithEmailAndPassword(authService, id, pwd)
        .then((userCredential) => {
          console.log("로그인 성공!");
          console.log("usercredential : ", userCredential);
          dispatch(
            setUser({
              id: id,
              user_name: userCredential.user.displayName,
              user_profile: "",
              uid: userCredential.user.uid,
            })
          );
          history.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          window.alert("아이디와 비밀번호를 다시 확인해주세요!");
          console.log(errorCode, errorMessage);
        });
    });    
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    // const auth = getAuth();

    createUserWithEmailAndPassword(authService, id, pwd)
      .then((userCredential) => {
        // const user = userCredential.user;

        updateProfile(authService.currentUser, {
          displayName: user_name,
        })
          .then(() => {
            dispatch(
              setUser({
                id: id,
                user_name: user_name,
                user_profile: "",
                uid: userCredential.user.uid,
              })
            );
            history.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
        // Signed in
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
        // ..
      });
  };
};

const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        dispatch(
          setUser({
            id: user.email,
            user_name: user.displayName,
            user_profile: "",
            uid: user.uid,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    signOut(authService).then(() => {
      dispatch(logOut());
      history.replace("/");
    });
  };
};

// reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }), //원본값을 복사한 값을 draft로 받아옴
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
