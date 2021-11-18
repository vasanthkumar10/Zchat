import './InfoBar.css';

import React from 'react';
import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';

const InfoBar = ({ room, removeUser }) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <img className="onlineIcon" src={onlineIcon} alt="online icon" />
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/" onClick={removeUser}><img src={closeIcon} alt="close icon" /></a>
        </div>
    </div>
);

export default InfoBar;