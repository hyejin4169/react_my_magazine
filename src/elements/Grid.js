import React from "react";
import styled from "styled-components";

const Grid = (props) => {
  const {
    is_flex,
    is_left,
    is_right,
    is_justify,
    width,
    padding,
    margin,
    bg,
    children,
    center,
    _onClick,
  } = props;
  //children: GridBox안에 들어오는건 children으로 넘겨줘야함

  const styles = {
    is_flex: is_flex,
    is_left: is_left,
    is_right: is_right,
    is_justify: is_justify,
    width: width,
    padding: padding,
    margin: margin,
    bg: bg,
    center: center,
  };
  //children말고는 style관련이므로 여기에 따로 뺌

  return (
    <React.Fragment>
      <GridBox {...styles} onClick={_onClick}>
        {children}
      </GridBox>
    </React.Fragment>
  );
};

Grid.defaultProps = {
  children: null,
  is_flex: false,
  is_left: false,
  is_right: false,
  is_justify: false,
  width: "100%",
  padding: false,
  margin: false,
  bg: false,
  center: false,
  _onClick: () => {},
};

//props로 넘어오는 것들 여기서 style설정
const GridBox = styled.div`
    width: ${(props) => props.width}
    height: 100%,
    box-sizing: border-box;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
    ${(props) =>
      props.is_flex
        ? `display: flex; align-items:center; justify-content: space-between;`
        : ""}
    ${(props) =>
      props.is_left
        ? `display: flex; align-items:center; justify-content: start;`
        : ""}
    ${(props) =>
      props.is_right
        ? `display: flex; align-items:center; justify-content: end;`
        : ""}
    ${(props) =>
      props.is_justify
        ? `display: flex; align-items:center; justify-content: ${props.is_justify};`
        : ""}
    ${(props) => (props.center ? `text-align : center;` : "")}

`;

export default Grid;
