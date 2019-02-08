import React from 'react';
import './status.scss';

function Status(props) {
  let status;
  let className;

  if (props.winner) { // = winning color!
    status = 'Winner: ' + props.winner + '!!!';
    className = 'status ' + props.winner;
    return (
      <div className={className}>
        <p className='text'>
          {status}
        </p>
      </div>
    );
  }

  else {
    let color = (props.p1Next ? props.p1Color : props.p2Color);
    status = 'Next player: ' + color;
    className = color + ' text';
    return (
      <div className='status'>
        <p className={className}>
          {status}
        </p>
      </div>
    );
  }

}


export default Status;