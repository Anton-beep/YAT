import React, { useState } from 'react';
import './Dashboard.css';
import Layout from "./../Layout";
import EventsList from "../EventList";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = ({created, finished}) => {
    const [startDate, setStartDate] = useState(new Date());
    const data = [
        ['Task', 'Hours per Day'],
        ['Work',     11],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 2],
        ['Sleep',    7]
    ];

    const timelineData = [
        ['Term', 'Start', 'End'],
        ['Term 1', new Date(2022, 0, 1), new Date(2022, 0, 31)],
        ['Term 2', new Date(2022, 1, 1), new Date(2022, 1, 28)],
    ];

    return (
        <Layout>
            <div className="dashboard-container">


                <div className="left-side">
                    {/*<DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />*/}
                    <div className="event-list-container">
                        <EventsList />
                        <EventsList />
                    </div>
                </div>
                <div className="right-side">
                    <Chart
                        width={'500px'}
                        height={'500px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={data}
                        options={{
                            title: 'My Daily Activities',
                            pieHole: 0.4,
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </div>
            </div>
            <Chart
                style={{marginLeft: '10px'}}
                width={'90%'}
                height={'400px'}
                chartType="Timeline"
                loader={<div>Loading Timeline</div>}
                data={timelineData}
                options={{
                    showRowNumber: true,
                }}
                rootProps={{ 'data-testid': '2' }}
            />
        </Layout>
    );
};

export default Dashboard;
