import React, {useState, useEffect} from 'react';
import styles from './ClockIcon.module.css';

const ClockIcon = ({initialSeconds}) => {
    const secondsDegrees = ((initialSeconds % 60 / 60) * 360) + 90;
    const minutesDegrees = (((initialSeconds / 60) % 60 / 60) * 360) + ((initialSeconds % 60 / 60) * 6) + 90;
    const hoursDegrees = (((initialSeconds / 3600) % 24 / 12) * 360) + (((initialSeconds / 60) % 60 / 60) * 30) + 90;

    return (
        <div className={styles.clock}>
            <div className={`${styles.hand} ${styles.hour}`} style={{transform: `rotate(${hoursDegrees}deg)`}}/>
            <div className={`${styles.hand} ${styles.minute}`} style={{transform: `rotate(${minutesDegrees}deg)`}}/>
            <div className={`${styles.hand} ${styles.second}`} style={{transform: `rotate(${secondsDegrees}deg)`}}/>
            <div className={styles.centerPoint}/>
        </div>
    );
}

export default ClockIcon;