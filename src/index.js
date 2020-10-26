import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import io from "socket.io-client";
import "./styles.css";



const children = ({ remainingTime }) => {
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">
        {hours}:{minutes}:{seconds}
      </div>
      <div className="text">seconds</div>
    </div>
  );
};


function App() {
  const [tag, setTag] = useState(false);
  const [yourID, setYourID] = useState();
  const socketRef = useRef();
  
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000");
    socketRef.current.on("your id", (id) =>{
      setYourID(id);
    })

    socketRef.current.on("timer start", (message) => {
      console.log(message);
      setTag(true);
    })
  },[])

  function sendTimerSign(bool){
    if(bool) socketRef.current.emit("timer start sign", "timer start!!");
    else socketRef.current.emit("timer stop sign", "timer stop!!");
  }

  return (
    <div className="App">
      <h1>
        CountdownCircleTimer
        <br />
        React Component
      </h1>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying={tag}
          duration={70}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [true, 1000]}
        >
          {children}
        </CountdownCircleTimer>
      </div>
      <div>
      <button onClick={()=> sendTimerSign(true)}>
        START
      </button>

    </div>
      <p className="info">
        Change component properties in the code filed on the right to try
        difference functionalities
      </p>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
