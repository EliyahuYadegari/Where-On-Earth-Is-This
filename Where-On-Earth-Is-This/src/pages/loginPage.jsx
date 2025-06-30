import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
   <div>
      <h1>Where On Earth Is This?!</h1>

      <button onClick={handleStartGame}>
        start game! {/* Button text */}
      </button>
    </div>

  );
}
export default LoginPage;



