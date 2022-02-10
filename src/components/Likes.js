import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HeartImg from "../assets/filledheart.png";
import EmptyHeartImg from "../assets/emptyhearted.png";


const HeartButton = ({ like, onClick }) => {
  return <Heart src={like ? HeartImg : EmptyHeartImg} onClick={onClick} />;
};

const Heart = styled.img`
width: 20px;
height: 20px;
`;

export default HeartButton;
