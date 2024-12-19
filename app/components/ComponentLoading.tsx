import React from 'react';

const ComponentLoading = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-75 flex justify-center items-center z-50">
            <div className="flex flex-col items-center">
                <p className="text-xl font-semibold text-gray-700">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
};

export default ComponentLoading;
