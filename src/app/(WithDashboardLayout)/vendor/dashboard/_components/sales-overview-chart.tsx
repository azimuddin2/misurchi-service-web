'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Sample data
const data = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
    { name: 'Apr', uv: 2780, pv: 3908 },
    { name: 'May', uv: 1890, pv: 4800 },
    { name: 'Jun', uv: 2390, pv: 3800 },
    { name: 'Jul', uv: 3490, pv: 4300 },
    { name: 'Aug', uv: 3200, pv: 4100 },
    { name: 'Sep', uv: 2800, pv: 3700 },
    { name: 'Oct', uv: 4000, pv: 4500 },
    { name: 'Nov', uv: 4200, pv: 4600 },
    { name: 'Dec', uv: 3800, pv: 4300 },
];

// Custom Tooltip for hover
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white border rounded shadow-md">
                <p className="font-medium text-gray-800">{label}</p>
                {payload.map((entry: any) => (
                    <p key={entry.dataKey} style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const SalesOverviewChart = () => {
    const [year, setYear] = useState(String(new Date().getFullYear()));

    return (
        <Card className="w-full border-none shadow my-5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-xl font-semibold text-ns-title">
                    Sales Overview
                </CardTitle>
                <div className="flex items-center gap-4">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="py-5">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            {/* ---------------------------------- Chart ---------------------------------- */}
            <div className="w-full h-[400px]">
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        barCategoryGap="20%" // spacing between groups
                        barGap={4} // spacing between bars in each group
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="pv"
                            fill="#B9DDFF"
                            name="PV"
                            radius={[6, 6, 0, 0]}
                            activeBar={<Rectangle fill="#0D3C6B" stroke="#0D3C6B" />}
                        />
                        <Bar
                            dataKey="uv"
                            fill="#0D3C6B"
                            name="UV"
                            radius={[6, 6, 0, 0]}
                            activeBar={<Rectangle fill="#B9DDFF" stroke="#B9DDFF" />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default SalesOverviewChart;
