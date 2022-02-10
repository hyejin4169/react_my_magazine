import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";
import { Grid } from "../elements/Index2";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);

  const { history } = props;

  React.useEffect(() => {
    if (post_list.length < 2) {
      dispatch(postActions.getPostFB());
    }
  }, []);

  return (
    <React.Fragment>
        <Grid bg={"#EFF6FF"} padding="20px 0px">
      {/* <Post /> */}
      {post_list.map((p, idx) => {
        //post하나라 p
        if (p.user_info.user_id === user_info?.uid) {
          //옵셔널 체이닝(user_info 있는지 없는지 확인)
          return (
            <Grid bg="#ffffff"
              key={idx}
            >
              <Post {...p} is_me />
            </Grid>
            //spread 연산자로 p에 모든 게시글 정보가 들어가게
          );
        } else {
          return (
            <Grid
              key={idx}
            >
              <Post {...p} />
            </Grid>
          );
        }
      })}
      </Grid>
    </React.Fragment>
  );
};

export default PostList;
