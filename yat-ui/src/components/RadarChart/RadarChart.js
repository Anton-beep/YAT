import React from 'react';
import {ResponsiveRadar} from '@nivo/radar';

const MyRadarChart = ({data, keys, indexBy}) => {
    return (<ResponsiveRadar
            data={data}
            keys={keys}
            indexBy={indexBy}
            maxValue={10}
            margin={{top: 50, right: 10, bottom: 10, left: 10}}
            curve="linearClosed"
            borderWidth={2}
            borderColor={{from: 'color'}}
            gridLevels={5}
            gridShape="circular"
            gridLabelOffset={40}
            enableDots={true}
            dotSize={10}
            dotColor={{theme: 'background'}}
            dotBorderWidth={2}
            dotBorderColor={{from: 'color'}}
            enableDotLabel={true}
            dotLabelYOffset={-12}
            colors={() => 'lightblue'}
            fillOpacity={0.25}
            blendMode="multiply"
            animate={false}
            motionConfig="wobbly"
            isInteractive={true}
        />);
}

export default MyRadarChart;