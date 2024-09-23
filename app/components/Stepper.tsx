import React from 'react'
import '@/app/besitter/besitter.scss';
const Stepper = () => {
    return (
        <div className='flex justify-center items-center'>
            <div className='circle-custom'>1</div>
            <div className='circle-hr'></div>
            <div className='circle-custom'>2</div>
            <div className='circle-hr'></div>
            <div className='circle-custom'>3</div>
            <div className='circle-hr'></div>
            <div className='circle-custom'>4</div>
        </div>
    )
}

export default Stepper