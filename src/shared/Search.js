import React from "react";
import _ from "lodash";

const Search = () => {
  const [text, setText] = React.useState("");

  const debounce = _.debounce((e) => {
    console.log("debounce ::: ", e.target.value);
  }, 1000);

  const throttle = _.throttle((e) => {
    console.log("throttle ::: ", e.target.value);
  }, 1000);

  const keyPress = React.useCallback(debounce, []);
  //컴포넌트가 리렌더링이 되더라도 초기화 되지 않게 함. 저장한 데이터 계속 쓸 수 있게 해줌.
  const onChange = (e) => {
    setText(e.target.value);
    keyPress(e);
  };

  return (
    <div>
      <input type="text" onChange={onChange} value={text} />
    </div>
  );
};

export default Search;
