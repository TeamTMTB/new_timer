import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import io from "socket.io-client";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import "./styles.css";


function App() {
  const [tag, setTag] = useState(false);
  const [yourID, setYourID] = useState();
  const [role, setRole] = useState('');
  const [study, setStudy] = useState(1500);
  const [breakTime, setBreak] = useState(300);
  const [key, setKey] = useState(0);
  const socketRef = useRef();
  const [remainingTime, setRemainingTime] = useState();
  const [open, setOpen] = React.useState(false);
  const [timer, setTimer] =useState();
  const [term, setTerm] = useState(1);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const children = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60    
    console.log("count");
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

  function handleStudyTime(e){

    setStudy(e.target.value * 60);
    setRemainingTime(study);
    setKey(!key);
  }

  function handleBreakTime(e){
    setBreak(e.target.value*60000);
    setKey(!key);
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
          onComplete={() => {
            setTerm(preTerm => preTerm +1)
            console.log("term: ", term);
            setOpen(true);
            setTimeout(handleClose, 3000);
            return [true, breakTime] 
          }}
        >
          {children}
          
        </CountdownCircleTimer>
        
      </div>
      {/* <div>
        <h4>Role</h4>
        <button onClick={()=> setRole('client')}>Client</button>
        <button onClick={()=> setRole('server')}>Server</button>
      </div> */}
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"쉬는시간 시작"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            공부 끝! 쉬는 시간 시작입니다-!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      
      <div>
        <input
          type="number"
          min="1"
          max="60"
          name="study"
          placeholder="Study time"
          onChange={handleStudyTime}
        />
        <input
          type="number"
          min="1"
          max="60"
          name="break"
          placeholder="Break time"
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