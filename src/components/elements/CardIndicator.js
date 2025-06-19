import React from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import Title1 from './Title1'
import { Users } from 'lucide-react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function CardIndicator({
    indicator={}
}) {
    const Icon = indicator?.icon;
  return (
    <div className="flex items-center justify-between bg-[#0C1019] text-white rounded-sm px-4 py-3 shadow-md w-full max-w-sm">
        <div className='flex items-center gap-4'>
            <div className='rounded-full p-3 bg-[#F6DF9B] text-[#0C1019]'>
                {Icon ? <Icon /> : <Users/> }
            </div>
            <div>
                <Title1 className='text-white'>{indicator?.title}</Title1>
                <p className="text-sm text-[#AAB0D0]">{indicator?.value}</p>
            </div>
        </div>
        <div>
            <MoreVertIcon className='text-[#AAB0D0] text-xl'/>
        </div>
    </div>
  )
};
