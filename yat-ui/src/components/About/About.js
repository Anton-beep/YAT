import React, {useEffect, useState} from 'react';
import Img1 from "../../screenshots/DashboardScreenshot.png";
import Img2 from "../../screenshots/EventScreenshot.png";
import Img3 from "../../screenshots/EventFinished.png";
import Img4 from "../../screenshots/ActivityList.png";
import Img5 from "../../screenshots/wheel.png";


import {ReactComponent as Arrow} from "../../icons/arrow-down.svg";

import styles from './About.module.css';

function About() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            const windowHeight = window.innerHeight;
            const speed = 4;
            if (position > 0) {
                setIsScrolled(true);
                const opacity = Math.min(position / (windowHeight -
                    Math.min(position / speed, windowHeight) + 0.001), 1);
                setOpacity(opacity);
                if (opacity < 1) {
                    setTranslateY(-position / speed);
                }
            } else {
                setIsScrolled(false);
                setOpacity(0);
                setTranslateY(0);
            }
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (<div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div className={styles['title-container']}>
                <h1>Yet Another Tracker</h1>
                <p><em>― Упорядочивая задачи, упорядочивая жизнь</em></p>
            </div>
            {!isScrolled && <div className={styles['scroll-indicator']}><Arrow/></div>}
        </div>
        {isScrolled && (<div>
            <div>
                <img style={{opacity: opacity, transform: `translateY(${translateY}px)`}}
                     className={`${styles['fullscreen-image']}`} src={Img1} alt="Description 1"/>
            </div>
            <div style={{opacity: opacity, display: 'flex', alignItems: 'center'}}>
                <img className={`${styles['small-image']}`} src={Img2}/>
                <p className={`${styles['description']}`}>Каждое событие в списке снабжено иконкой, которая
                    визуально отражает его тип или приоритет.
                    Время начала и окончания события помогают вам планировать свое время и контролировать
                    продолжительность задачи. Средняя оценка события дает общее представление о его сложности
                    или значимости, помогая вам определить, насколько важно уделить внимание данному
                    событию.</p>
            </div>
            <div style={{opacity: opacity, display: 'flex', alignItems: 'center'}}>
                <p className={`${styles['description']}`}>Карточка события - это компактное и информативное
                    представление вашего события или задачи.
                    В каждой карточке указано название активности, которое дает общее представление о событии.
                    Даты начала и конца помогают вам планировать свое время и контролировать продолжительность
                    задачи.
                    Описание события дает дополнительную информацию и детали о задаче.
                    Список факторов и их оценка от 0 до 10 позволяют вам оценить сложность или значимость
                    события,
                    помогая вам определить, насколько важно уделить внимание данному событию.</p>
                <img className={`${styles['small-image']}`} src={Img3}/>
            </div>
            <div style={{opacity: opacity, display: 'flex', alignItems: 'center'}}>
                <img className={`${styles['small-image']}`} src={Img4}/>
                <p className={`${styles['description']}`}>Список активностей - это удобный инструмент для
                    отслеживания и управления вашими задачами и проектами.
                    Каждая активность в списке имеет уникальное имя, которое дает общее представление о ее
                    содержании или цели.
                    Иконка активности помогает визуально отличать разные типы активностей, делая ваш список
                    более организованным и понятным.
                    Используйте список активностей, чтобы оставаться на пути к достижению своих целей и
                    улучшению производительности.</p>
            </div>
            <div style={{opacity: opacity, display: 'flex', alignItems: 'center'}}>
                <p className={`${styles['description']}`}>RadarChart, или диаграмма-радар, - это визуальный
                    инструмент, который позволяет отображать многомерные данные на двумерной плоскости. Каждый
                    фактор представлено осью радара, и значения отображаются в виде точек на этих осях. Линии
                    соединяют эти точки, формируя 'веб' или 'радар'. Это делает RadarChart идеальным для
                    сравнения нескольких факторов или для отображения изменений в данных по времени. Он может
                    быть особенно полезен при анализе производительности, измерении качества или оценке сложных
                    наборов данных</p>
                <img className={`${styles['middle-image']}`} src={Img5}/>
            </div>
        </div>)}
    </div>);
}

export default About;