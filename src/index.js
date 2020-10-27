import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import io from "socket.io-client";
import "./styles.css";



const children = ({ remainingTime }) => {
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">
       {minutes}:{seconds}
      </div>
      <div className="text">minutes</div>
    </div>
  );
};

function App() {
  const [tag, setTag] = useState(false);
  const [yourID, setYourID] = useState();
  const [role, setRole] = useState('');
  const [study, setStudy] = useState(1500);
  const [breakTime, setBreak] = useState(300);
  const [key, setKey] = useState(0);
  const socketRef = useRef();
  const time=0;
  
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

  useEffect(()=>{
    console.log(study);
  },[study]);

  function handleStudyTime(e){
    console.log(e.target.value);
    setStudy(e.target.value);
    setKey(!key);
    console.log("!",study);
  }

  function handleBreakTime(e){

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
          duration={study}
          key={key}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [true, 1000]}
        >
          {children}
        </CountdownCircleTimer>
      </div>
      <div>
        <h4>Role</h4>
        <button onClick={()=> setRole('client')}>Client</button>
        <button onClick={()=> setRole('server')}>Server</button>
      </div>
      <div>
        <input
          type="number"
          min="1"
          max="60"
          name="study"
          onChange={handleStudyTime}
        />
        <input
          type="number"
          min="1"
          max="60"
          name="break"
          onChange={handleBreakTime}
        />
      <button onClick={()=> sendTimerSign(true)}>
        START
      </button>
    </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
