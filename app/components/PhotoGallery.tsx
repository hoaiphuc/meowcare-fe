'use client'

import 'yet-another-react-lightbox/styles.css';
import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import { ProfilePicture } from '../constants/types/homeType';
// import dynamic from 'next/dynamic';
// const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
//     ssr: false, // Disable SSR for this component
// });
// import { Zoom } from 'yet-another-react-lightbox/plugins';

const PhotoGallery = ({ photos }: { photos?: ProfilePicture[] }) => {

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return null; // or a fallback UI
    }

    const handleClick = (index: number) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-1 w-[710px] max-h-[300px]">
                {/* Display images in a grid */}
                {photos.slice(0, 3).map((photo, index) => (
                    <div key={index} className="relative cursor-pointer h-[150px]">
                        <Image
                            src={photo.imageUrl}
                            alt={`Photo ${index + 1}`}
                            width={350}
                            height={150}
                            className="object-cover rounded-lg h-[150px]"
                            onClick={() => handleClick(index)}
                        />
                    </div>
                ))}

                {photos.length > 3 && (
                    <div className="relative cursor-pointer max-h-[150px]" onClick={() => handleClick(3)}>
                        <Image
                            src={photos[3].imageUrl}
                            alt="View All Photos"
                            width={350}
                            height={150}
                            className="object-cover rounded-lg h-[150px]"
                        />
                        {/* Overlay with 'View All Photos' text */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg w-[350px]">
                            <span className="text-white text-xl">+{photos.length - 3} more</span>
                        </div>
                    </div>
                )}
            </div>

            {open && (
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    slides={photos.map((photo) => ({ src: photo.imageUrl }))}
                    index={currentIndex}
                // plugins={[Zoom]}

                />
            )}
        </div>
    );
};

export default PhotoGallery;

