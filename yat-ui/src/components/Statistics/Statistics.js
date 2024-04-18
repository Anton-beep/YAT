import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import MyRadarChart from "../RadarChart/RadarChart";
import Auth from "../../pkg/auth";

const Statistics = () => {
    const [factorNames, setFactorNames] = useState({});
    const [factorValues, setFactorValues] = useState({});
    const [radarData, setRadarData] = useState({});

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/factors')
            .then(response => {
                const new_factors = response.data.factors.reduce((acc, factor) => ({
                    ...acc, [factor.id]: factor.name,
                }), {});
                setFactorNames(new_factors);
            })
            .catch(error => {
                console.error(error);
            })
    }, []);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/statistics/wheel')
            .then(response => {
                const new_factors = response.data.factors.reduce((acc, factor) => {
                    const [key, value] = Object.entries(factor)[0];
                    return {...acc, [key]: value + 10};
                }, {});
                setFactorValues(new_factors);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    useEffect(() => {
        setRadarData(Object.keys(factorNames).map(key => ({
            name: factorNames[key], value: factorValues[key]
        })));
    }, [factorNames, factorValues]);


    return (
        <Layout>
        <h1 style={{marginLeft: "25px"}}>Статистика</h1>
        <MyRadarChart data={radarData} keys={["value"]} indexBy="name"/>
    </Layout>);
}

export default Statistics;