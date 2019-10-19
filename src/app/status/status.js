import React from 'react';
import './status.scss';
import TimerDisplay from './timer-display';


function Status(props) {
  let gameOverMessage;
  let statusMessage;
  let statusClass;
  let color;

  if (props.gameOver) {
    if (props.winner) {
      color = props.winner; // winning color
      gameOverMessage = 'Winner: ' + props.winner + '!!!';
      statusMessage = '';
      
      statusClass = color + ' status';
    } else {
      gameOverMessage = 'Game over!';
      statusClass = 'draw status';
    }
  } else {
    color = (props.p1Next ? props.p1Color : props.p2Color);
    gameOverMessage = '';
    statusMessage = color + "'s turn";
    
    statusClass = 'status'
  }

  return (
    <div className={statusClass}>

        {/* '#timerDisplay' displays invisually after win, which pushes the win message to the right: */}
        <span id='timerDisplay' className={color}>
          {
            (props.timer && !props.gameOver) ? // Conditionally render TimerDisplay when a timer is set:
                <TimerDisplay
                  p1Next={props.p1Next}
                  changeTurn={props.changeTurn}
                  timer={props.timer}
                /> : null
          }
        </span>

        <span id='gameOverMessage'>
          {gameOverMessage}
        </span>

        <span id='statusMessage' className={color}>
          {statusMessage}
        </span>
    </div>
  );

}


export default Status;