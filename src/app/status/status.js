import React from 'react';
import './status.scss';


function Status(props) {
  let statusMessage;
  let statusClass;
  let textClass;

  if (props.winner) { // = winning color!
    statusMessage = 'Winner: ' + props.winner + '!!!';
    statusClass = 'status ' + props.winner;
    textClass = 'text';
  }

  else {
    let color = (props.p1Next ? props.p1Color : props.p2Color);
    statusMessage = 'Player: ' + color;
    statusClass = 'status';
    textClass = color + ' text';
  }

  return (
    <div className={statusClass}>
      <p className={textClass}>
        {statusMessage}
        {/* <span id='counterDisplay'></span>
            <span id='filler'>&nbsp;</span>
            <span id='statusMessage'>&nbsp;{statusMessage}</span> */}
      </p>
    </div>
  );

}


export default Status;