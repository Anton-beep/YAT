import {ResponsiveTimeRange} from '@nivo/calendar'

const MyResponsiveTimeRange = ({data, startDate, endDate}) => {
    return (<ResponsiveTimeRange
            data={data}
            from={startDate}
            to={endDate}
            emptyColor="#eeeeee"
            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
            margin={{top: 40, right: 40, bottom: 100, left: 40}}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[{
                anchor: 'bottom-right',
                direction: 'row',
                justify: false,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left',
                translateX: -60,
                translateY: -60,
                symbolSize: 20
            }]}
        />);
}

export default MyResponsiveTimeRange;
