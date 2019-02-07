import React from 'react';
import './settings.scss';


function Settings(props) {
  let sidebarClass = 'sidebar';
  let bgClass = 'sidebar-background';
  let contentClass = 'sidebar-content';

  if (props.landscapePassive) {
    sidebarClass += ' landscapePassive';
    contentClass += ' landscapePassive';
  }

  if (props.portraitActive) {
    bgClass += ' portraitActive';
    contentClass += ' portraitActive';
  }

  return (
    <div className={sidebarClass} onClick={props.onSideClick}>
        <button className="sidebar-trigger" onClick={props.onClick}>
          &#9881;
        </button>

        {/* A mock background layer to hide the sidebar by clicking on it: */}
        <div className={bgClass} onClick={props.onClick} />

        {/* The content of the sidebar: */}
        <div className={contentClass} >
            <div className='sidebar-name'>Settings</div>
            <hr className='line' />
            <div className='padding'>
              <button>&times; Close</button>
              <button>&#9776; Navigation</button>
              <button>&#9881; Settings</button>
            </div>
        </div>
    </div>
  );
}


export default Settings;