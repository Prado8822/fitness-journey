import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Stats = ({ data }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d946ef" stopOpacity={1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#a855f7', fontSize: 12 }} 
            axisLine={{ stroke: '#4c1d95' }}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fill: '#a855f7', fontSize: 12 }} 
            axisLine={{ stroke: '#4c1d95' }}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(147, 51, 234, 0.1)' }}
            contentStyle={{ 
              backgroundColor: 'rgba(19, 7, 46, 0.85)', 
              borderColor: 'rgba(147, 51, 234, 0.4)', 
              borderRadius: '12px',
              color: '#f8fafc',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: '#d946ef', fontWeight: 'bold' }}
            labelStyle={{ color: '#a855f7', marginBottom: '4px' }}
          />
          <Bar 
            dataKey="duration" 
            fill="url(#colorDuration)" 
            radius={[6, 6, 0, 0]} 
            barSize={32}
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(217,70,239,0.4))' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;