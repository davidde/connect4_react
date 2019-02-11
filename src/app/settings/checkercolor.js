import React from 'react';
import './settings_content.scss';


function CheckerColor(props) {

  return (
    <form>
      <label className='fontColor'>{props.player} &nbsp;
        <select name='checkercolor' value={props.color} onChange={props.setCheckerColor(props.player)} >
          <option value='yellow'>yellow</option>
          <option value='orange'>orange</option>
          <option value='red'>red</option>
          <option value='green'>green</option>
          <option value='cyan'>cyan</option>
          <option value='blue'>blue</option>
          <option value='purple'>purple</option>
        </select>
      </label>
    </form>
  );
}


export default CheckerColor;