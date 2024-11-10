import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

interface StatsCardProps {
    number: number;
    title: string;
    icon: IconDefinition;
    date: string;
    className?: string;
}

const CardChart: React.FC<StatsCardProps> = ({ number, title, icon, date, className }) => {
    return (
        <div
            className={`flex flex-col border w-80 h-36 text-white p-5 rounded-md gap-3 ${className}`}
        >
            <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={icon} size="3x" />
                <div>
                    <h1 className="font-semibold text-4xl">{number}</h1>
                    <h1>{title}</h1>
                </div>
            </div>
            <hr />
            <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faClock} />
                <h1>Cập nhật ngày: {date}</h1>
            </div>
        </div>
    );
};

export default CardChart;
