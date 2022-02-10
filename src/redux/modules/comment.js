import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  increment,
  doc,
  where,
} from "firebase/firestore";
import { ref, set, update, push } from "firebase/database";
import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { db, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as postActions } from "./post";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

const addCommentFB = (post_id, contents) => {
  return function (dispatch, getState, { history }) {
    const commentDB = collection(db, "comment");
    const user_info = getState().user.user;

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    addDoc(commentDB, comment).then((docs) => {
      const postDB = doc(db, "post", post_id);
      const post = getState().post.list.find((l) => l.id === post_id);

      const increment_cnt = increment(1);

      comment = { ...comment, id: docs.id };

      updateDoc(postDB, { comment_cnt: increment_cnt }).then((_post) => {
        dispatch(addComment(post_id, comment));

        if (post) {
          dispatch(
            postActions.editPost(post_id, {
              comment_cnt: parseInt(post.comment_cnt) + 1,
            })
          );
          const notiDB = ref(realtime, `noti/${post.user_info.user_id}`);

          const _noti_item = ref(
            realtime,
            `noti/${post.user_info.user_id}/list`
          );

          push(_noti_item, {
            post_id: post.id,
            user_name: comment.user_name,
            image_url: post.image_url,
            insert_dt: comment.insert_dt,
          }).catch(err => {
            window.alert("알림 저장에 실패했어요!");
            console.log(err);
          });

          update(notiDB, {read:false});
        }
      });
    });
  }
}

const getCommentFB = (post_id) => {
  return async function (dispatch, getState, { history }) {
    if (!post_id) {
      return;
    }
    const docRef = collection(db, "comment");
    const commentDB = query(
      docRef,
      where("post_id", "==", post_id),
      orderBy("insert_dt", "desc")
    );

    let comment_Data = await getDocs(commentDB);

    let list = [];

    comment_Data.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });

    dispatch(setComment(post_id, list));
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
    [ADD_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].unshift(action.payload.comment);
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  addCommentFB,
  setComment,
  addComment,
};

export { actionCreators };
