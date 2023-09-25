import React from "react";
import chatboxStyles from '@/styles/chatbox.module.css';

//Taken from https://dev.to/kirteshbansal/bouncing-dots-loader-in-react-4jng
const BouncingDots = () => {
  return (
      <div className={chatboxStyles.bouncingloader}>
        <div></div>
        <div></div>
        <div></div>
      </div>
  );
};

export default BouncingDots;