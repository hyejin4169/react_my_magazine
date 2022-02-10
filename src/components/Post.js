import React from "react";

import { Grid, Image, Text, Button } from "../elements/Index2";
import { history } from "../redux/configureStore";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { actionCreators as postActions } from "../redux/modules/post";

import Likes from "../components/Likes";

const Post = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  console.log("post_list : ", post_list);
  const [like, setLike] = React.useState(false)

  const toggleLike = () => {
    setLike(!like)
  }

  return (
    <React.Fragment>
      <Grid />
      <Grid is_flex padding="16px">
      <Grid is_flex width="auto">
        <Image shape="circle" src={props.src} />
        <Text bold>{props.user_info.user_name}</Text>
        </Grid>

        <Grid is_flex width="auto">
          <Text>{props.insert_dt}</Text>
          {props.is_me && (
            <Button
              width="auto"
              margin="4px"
              padding="4px"
              _onClick={() => {
                history.push(`/write/${props.id}`);
              }}
            >
              수정
            </Button>
          )}
          
          {props.is_me && (
            <Button
              width="auto"
              margin="4px"
              padding="4px"
              _onClick={() => {
                dispatch(postActions.deletePostFB(props.id));
                // history.replace(`/`);
              }}
            >
              삭제
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid
        padding="4px 16px"
        _onClick={() => {
          history.push(`/post/${props.id}`);
        }}
      >
        <Text>{props.contents}</Text>
      </Grid>

      <Grid
        padding="3px 16px"
        _onClick={() => {
          history.push(`/post/${props.id}`);
        }}
      >
      
        <Image shape="rectangle" src={props.image_url} />
      </Grid>
        
      <Grid padding="6px 16px 1px">
      <Likes like={like} onClick={toggleLike} />
      </Grid>

      <Grid padding="16px">
        <Text margin="0px" bold>
          댓글 {props.comment_cnt}개
        </Text>
      </Grid>
    </React.Fragment>
  );
};

//필요한 props를 미리 넘겨놓는 방식
Post.defaultProps = {
  user_info: {
    user_name: "alice",
    user_profile:
      "https://image.yes24.com/momo/TopCate653/MidCate004/65236689.jpg",
  },
  image_url: "https://d.newsweek.com/en/full/1924636/shiba-inu-dog.jpg",
  contents: "시바쨩데스네",
  comment_cnt: 10,
  insert_dt: "2022-02-04 10:00:00",
  is_me: false,
};

export default Post;
