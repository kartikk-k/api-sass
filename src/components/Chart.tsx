'use client';

import { Card, AreaChart, Title, Text } from '@tremor/react';

const data = [
    {
        Month: 'Aug 16',
        Requests: 5,
        Cost: 5 * 0.25
    },
    {
        Month: 'Aug 17',
        Requests: 2,
        Cost: 2 * 0.25
    },
    {
        Month: 'Aug 18',
        Requests: 8,
        Cost: 8 * 0.25
    }
];

export default function Example() {
    return (
        <Card className="mt-8">
            <Title>Requests</Title>
            <Text>Chart of your requests</Text>
            <AreaChart
                className="mt-4 h-80"
                data={data}
                categories={['Requests', 'Cost']}
                index="Month"
                colors={['indigo', 'emerald']}
                valueFormatter={(number: number) =>
                    `${Intl.NumberFormat('us').format(number).toString()}`
                }
                yAxisWidth={60}
            />
        </Card>
    );
}