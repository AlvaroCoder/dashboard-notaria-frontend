import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Loader2 } from 'lucide-react';

export default function CardIndicatorLoading({
    indicator={}
}) {
  return (
    <div className="flex items-center justify-between bg-[#0C1019] text-white rounded-sm px-4 py-3 shadow-md w-full max-w-sm">
        <div className='flex-1 flex justify-center items-center'>
            <Loader2 className='animate-spin' />
        </div>
        <div>
            <MoreVertIcon className='text-[#AAB0D0] text-xl'/>
        </div>
    </div>
  )
}
