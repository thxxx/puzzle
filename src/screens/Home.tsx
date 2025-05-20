import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      This is my Home
      <button
        onClick={() => {
          navigate("/scene");
        }}
      >
        click here
      </button>
    </div>
  );
};

export default Home;
