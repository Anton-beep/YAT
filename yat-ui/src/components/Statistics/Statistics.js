import React from 'react';
import Layout from "../Layout";
import MyRadarChart from "../RadarChart/RadarChart";

const Statistics = () => {
    const data = [
        {
            taste: "fruity",
            chardonay: -3 + 10
        },
        {
            taste: "bitter",
            chardonay: 8 + 10
        },
        {
            taste: "heavy",
            chardonay: 0 + 10
        },
        {
            taste: "strong",
            chardonay: 5 + 10
        },
        {
            taste: "sunny",
            chardonay: 4 + 10
        }
    ];

    const keys = ["chardonay"];
    const indexBy = "taste";


    return (
        <Layout>
            <h1 style={{marginLeft: "25px"}}>Статистика</h1>

            <MyRadarChart data={data} keys={keys} indexBy={indexBy} />

        </Layout>
    );
}

export default Statistics;