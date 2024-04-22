import React, {useState, useEffect} from 'react';
import styles from './ClockIcon.module.css';

const ClockIcon = ({initialSeconds}) => {
    const secondsDegrees = initialSeconds * 6;
    const minutesDegrees = initialSeconds;
    const hoursDegrees = initialSeconds / 60;

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