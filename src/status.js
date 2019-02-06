import React from 'react';
import './status.scss';

function Status(props) {
  let status;
  if (props.winner) {
    status = 'Winner: ' + props.winner + '!!!';
    if (props.winner === 'red')
      return (<div id='status'><h3 className='winner red'>{status}</h3></div>);
    else
      return (<div id='status'><h3 className='winner yellow'>{status}</h3></div>);
  } else {
    status = 'Next player: ' + (props.p1Next ? 'red' : 'yellow');
    if (props.p1Next)
      return (<div id='status'><p className='status red'>{status}</p></div>);
    else
      return (<div id='status'><p className='status yellow'>{status}</p></div>);
  }
}


export default Status;