import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import MyRadarChart from "../RadarChart/RadarChart";
import Auth from "../../pkg/auth";
import MyPieChart from "../PieChart/PieChart";
import MyResponsiveTimeRange from "../TimeRangeChart/TimeRangeChart";
import EventsList from "../EventList";
import TasList from "../TaskList/TaskList";

const Statistics = () => {
    const [factorNames, setFactorNames] = useState({});
    const [factorValues, setFactorValues] = useState({});
    const [radarData, setRadarData] = useState({});
    const [pieData, setPieData] = useState([]);
    const [timeRangeData, setTimeRangeData] = useState([]);

    const [startDate, setStartDate] = useState(localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : (() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    })());
    const [endDate, setEndDate] = useState(localStorage.getItem('endDate') ? new Date(localStorage.getItem('endDate')) : new Date());

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/factors/', {
            data: {
                start_date: startDate.toISOString().substr(0, 10), end_date: endDate.toISOString().substr(0, 10),
            }
        })
            .then(response => {
                const new_factors = response.data.factors.reduce((acc, factor) => ({
                    ...acc, [factor.id]: factor.name,
                }), {});
                setFactorNames(new_factors);
            })
            .catch(error => {
                console.error(error);
            })
    }, [startDate, endDate]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/statistics/wheel/', {
            data: {
                start_date: startDate.toISOString().substr(0, 10), end_date: endDate.toISOString().substr(0, 10),
            }

        })
            .then(response => {
                const new_factors = response.data.factors.reduce((acc, factor) => {
                    const [key, value] = Object.entries(factor)[0];
                    return {...acc, [key]: value};
                }, {});
                setFactorValues(new_factors);
            })
            .catch(error => {
                console.log(error);
            })
    }, [startDate, endDate]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/statistics/activity_duration/', {
            data: {
                start_date: startDate.toISOString().substr(0, 10), end_date: endDate.toISOString().substr(0, 10),
            }

        })
            .then(response => {
                setPieData(response.data.activities);
            })
            .catch(error => {
                console.error(error);
            })
    }, [startDate, endDate]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/statistics/event_count/', {
            data: {
                start_date: startDate.toISOString().substr(0, 10), end_date: endDate.toISOString().substr(0, 10),
            }

        })
            .then(response => {
                setTimeRangeData(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [startDate, endDate]);

    useEffect(() => {
        setRadarData(Object.keys(factorNames).map(key => ({
            name: factorNames[key], value: factorValues[key]
        })));
    }, [factorNames, factorValues]);

    useEffect(() => {
        localStorage.setItem('startDate', startDate.toISOString());
        localStorage.setItem('endDate', endDate.toISOString());
    }, [startDate, endDate]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/users/user/')
            .catch(() => {
                window.location.href = '/login';
            });
    }, []);

    const width = window.innerWidth * 0.5;

    return (<Layout>
        <h1 style={{marginLeft: "25px"}}>Статистика</h1>
        <div className="date-picker-container">
            <label style={{marginLeft: "10px"}}>Выберите даты:</label>
            {" "}
            <input
                type="date"
                value={startDate.toISOString().substr(0, 10)}
                onChange={event => {
                    setStartDate(new Date(event.target.value));
                    window.location.reload();
                }}
                className="date-picker"
            />
            {" "}-{" "}
            <input
                type="date"
                value={endDate.toISOString().substr(0, 10)}
                onChange={event => {
                    setEndDate(new Date(event.target.value));
                    window.location.reload();
                }}
                className="date-picker"
            />
        </div>

        {radarData && <div style={{height: `${width}px`, width: "auto"}}>
            <MyRadarChart data={radarData} keys={["value"]} indexBy="name"/>
        </div>}
        {pieData && <div style={{height: `${width}px`, width: "auto"}}>
            <MyPieChart data={pieData}/>
        </div>}
        {timeRangeData && <div style={{height: `${width}px`, width: "auto"}}>
            <MyResponsiveTimeRange data={timeRangeData} startDate={startDate} endDate={endDate}/>
        </div>}

        <div className="row">
            <div className="col-6">
                <EventsList created={Math.floor(startDate.getTime() / 1000)}
                            finished={Math.floor(endDate.getTime() / 1000)}
                            onMain={false}
                />
            </div>
            <div className="col-6">
                <TasList created={Math.floor(startDate.getTime() / 1000)}
                         finished={Math.floor(endDate.getTime() / 1000)}
                         done="all"
                         onMain={false}
                />
            </div>
        </div>
    </Layout>);
}

export default Statistics;
