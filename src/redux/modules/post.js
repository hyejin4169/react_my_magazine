import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage, db } from "../../shared/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";

// action creators
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_index) => ({
  post_index,
}));

// initialState
const initialState = {
  list: [],
  uploading: false,
};

//게시글 하나에 대한 기본적인 정보(이런 것들이 들어가야 한다)
const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "alice",
  //   user_profile: "https://d.newsweek.com/en/full/1924636/shiba-inu-dog.jpg",
  // },
  image_url: "https://d.newsweek.com/en/full/1924636/shiba-inu-dog.jpg",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
};

//middleware actions
const editPostFB = (post_id = null, post = {}) => {
  return async function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    const _image = getState().image.preview;
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    const postDB = doc(db, "post", post_id);

    if (_image === _post.image_url) {
      await updateDoc(postDB, post);
      dispatch(editPost(post_id, { ...post }));
      history.replace("/");

      return;
    } else {
      const user_id = getState().user.user.uid;
      const storageRef = ref(
        storage,
        `images/${user_id}_${new Date().getTime()}`
      );
      const _upload = uploadString(storageRef, _image, "data_url");

      _upload
        .then((snapshot) => {
          console.log(snapshot);

          getDownloadURL(snapshot.ref)
            .then((url) => {
              console.log(url);

              return url;
            })
            .then((url) => {
              updateDoc(postDB, { ...post, image_url: url });
              dispatch(editPost(post_id, { ...post, image_url: url }));
              history.replace("/");
            });
        })
        .catch((err) => {
          window.alert("이미지 업로드에 문제가 있어요!");
          console.log("이미지 업로드 실패!", err);
        });
    }
  };
};

const addPostFB = (contents = "") => {
  return async function (dispatch, getState, { history }) {
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"), //addpost가 불려오고나면 그 때 하나하나 만들기 때문에 또 넣음
    };

    const _image = getState().image.preview;
    console.log(_image);

    const storageRef = ref(
      storage,
      `images/${user_info.user_id}_${new Date().getTime()}`
    );
    const _upload = uploadString(storageRef, _image, "data_url");
    _upload
      .then((snapshot) => {
        console.log("snapshot : ", snapshot);
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url);

            return url;
          })
          //db에서 모든 데이터가 받아진 후에 포스트를 만들 수 있게 함(비동기)
          .then(async(url) => {
            const postDB = await addDoc(collection(firestore, "post"), {
              ...user_info,
              ..._post,
              image_url: url,
            });
            let post = { user_info, ..._post, id: postDB.id, image_url: url };
            dispatch(addPost(post));
            history.replace("/");

            dispatch(imageActions.setPreview(null));
          })
          .catch((err) => {
            window.alert("앗! 포스트 작성에 문제가 있어요!");
            console.log("post 작성에 실패했어요!", err);
          });
      })
      // .catch((err) => {
      //   window.alert("앗! 이미지 업로드에 문제가 있어요!");
      //   console.log("이미지 업로드 실패!", err);
      // });
  };
};

const getPostFB = () => {
  return async function (dispatch, getState, { history }) {
    let docRef = query(collection(db, "post"), orderBy("insert_dt", "desc"));
    const postDB = await getDocs(docRef);

    let post_list = [];
    postDB.forEach((doc) => {
      let _post = {
        id: doc.id,
        ...doc.data(),
      };

      let post = {
        id: doc.id,
        user_info: {
          user_name: _post.user_name,
          user_profile: _post.user_profile,
          user_id: _post.user_id,
        },
        image_url: _post.image_url,
        contents: _post.contents,
        comment_cnt: _post.comment_cnt,
        insert_dt: _post.insert_dt,
      };
      post_list.push(post);
    });

    console.log("post_list : ", post_list);

    dispatch(setPost(post_list));
  };
};

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = doc(db, "post", id);
    getDoc(postDB).then((doc) => {
      let _post = doc.data();
      let post_d = Object.keys(_post).reduce(
        (acc, cur) => {
          if (cur.indexOf("user_") !== -1) {
            return {
              ...acc,
              user_info: { ...acc.user_info, [cur]: _post[cur] },
            };
          }

          return { ...acc, [cur]: _post[cur] };
        },
        { id: doc.id, user_info: {} }
      );

      dispatch(setPost([post_d]));
    });
  };
};

const deletePostFB = (post_id) => {
  return async function (dispatch, getState, { history }) {
    // if (!post_id) {
    window.alert("삭제하시겠습니까?");
    // }

    const docRef = doc(db, "post", post_id);
    await deleteDoc(docRef);

    const _post_list = getState().post.list;
    const post_index = _post_list.findIndex((d) => {
      return d.id === post_id;
    });
    console.log("post_index : ", post_index);
    dispatch(deletePost(post_index));
    history.replace("/");
  };
};

// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }
        draft.paging = action.payload.paging;
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id); //id로 내가 뭘 수정할건지 찾아야함(리스트에서 몇번째인걸 고칠건지)
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),

    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = state.list.filter((l, idx) => {
          return parseInt(action.payload.post_index) !== idx;
        });
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  deletePost,
  getPostFB,
  addPostFB,
  editPostFB,
  deletePostFB,
  getOnePostFB,
};

export { actionCreators };
