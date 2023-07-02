// import ImageGallery from 'react-image-gallery';
import {useState, useRef, useEffect} from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import './styles/productImageSlider.css';

// const images = [
//     // {
//     //   original: 'https://picsum.photos/id/1018/1000/600/',
//     //   thumbnail: 'https://picsum.photos/id/1018/250/150/',
//     // },
//     // {
//     //   original: 'https://picsum.photos/id/1015/1000/600/',
//     //   thumbnail: 'https://picsum.photos/id/1015/250/150/',
//     // },
//     // {
//     //   original: 'https://picsum.photos/id/1019/1000/600/',
//     //   thumbnail: 'https://picsum.photos/id/1019/250/150/',
//     // },
//     {
//       original: 'http://localhost:3000/images/iphone/1.jpg',
//       thumbnail: 'https://picsum.photos/id/1018/250/150/',
//     },
//     {
//       original: 'http://localhost:3000/images/iphone/2.png',
//       thumbnail: 'https://picsum.photos/id/1015/250/150/',
//     },
//     {
//       original: 'http://localhost:3000/images/iphone/3.jpg',
//       thumbnail: 'https://picsum.photos/id/1019/250/150/',
//     },
//     {
//         original: 'http://localhost:3000/images/iphone/4.jpg',
//         thumbnail: 'https://picsum.photos/id/1018/250/150/',
//       },
//       {
//         original: 'http://localhost:3000/images/iphone/5.jpg',
//         thumbnail: 'https://picsum.photos/id/1015/250/150/',
//       },
//       {
//         original: 'http://localhost:3000/images/iphone/6.jpg',
//         thumbnail: 'https://picsum.photos/id/1019/250/150/',
//       },
//       {
//         original: 'http://localhost:3000/images/iphone/7.jpg',
//         thumbnail: 'https://picsum.photos/id/1018/250/150/',
//       },
//       {
//         original: 'http://localhost:3000/images/iphone/8.png',
//         thumbnail: 'https://picsum.photos/id/1015/250/150/',
//       },
//       {
//         original: 'http://localhost:3000/images/iphone/9.png',
//         thumbnail: 'https://picsum.photos/id/1019/250/150/',
//       },
//       {
//         original: 'http://localhost:3000/images/iphone/10.jpg',
//         thumbnail: 'https://picsum.photos/id/1019/250/150/',
//       },
//   ];

const ProductImageSlider = ({images, currentVariationImage}) => {

    const imagesContainer = useRef();
    const thumbnailContainer = useRef();
    const [current, setCurrent] = useState(1);
    const [cw, setCw] = useState(null);
    const [isCwSet, setIsCwSet] = useState(false);



    useEffect(() => {
        setCw(imagesContainer.current.clientWidth);
        setIsCwSet(true);
    }, [])

    useEffect(() => {
        if(current === 1 || current === images.length) {
            imagesContainer.current.style.transition = 'transform .4s ease-in';
        }

        if((current) === 2 || current === 1) {
            thumbnailContainer.current.style.transform = `translateX(${0}px)`;
        }

        if((current) === 3) {
            thumbnailContainer.current.style.transform = `translateX(${-1 * 64.5}px)`;
        }

        if((current) > 3 && (current - 1) !== images.length) {
            thumbnailContainer.current.style.transform = `translateX(${(-(current - 3) * 140) - 64.5}px)`;
        }

    }, [current, images]);

    useEffect(() => {
        
        if(currentVariationImage && currentVariationImage.image && currentVariationImage?.image.fileName) {
            let index;
            images.forEach((ele, i) => {
                if(ele.fileName === currentVariationImage.image.fileName) {
                    index = i+1;
                    return;
                }
            });
            setCurrent(index);
        } else if(currentVariationImage && !currentVariationImage._id) {
            setCurrent(1);
        }
        
    }, [currentVariationImage, images])

    const handlePrev = () => {
        if(current === 0) {
            return;
        } 

        if(current === 1) {
            thumbnailContainer.current.style.transform = `translateX(${(-(images.length - 3) * 140) - 64.5}px)`
        }

        if((current) === 3) {
            thumbnailContainer.current.style.transform = `translateX(${0}px)`;
        }

        if((current) > 3) {
            thumbnailContainer.current.style.transform = `translateX(${-(((current-1) - 3) * 140) - 64.5}px)`;
        }

        setCurrent(current - 1);
    }

    const handleNext = () => {
        if(current === images.length + 1) {
            return;
        }

        if(current === images.length) {
            thumbnailContainer.current.style.transform = `translateX(${0}px)`
        }
        
        if((current + 1) === 3) {
            thumbnailContainer.current.style.transform = `translateX(${-1 * 64.5}px)`;
        }

        if((current + 1) > 3 && current !== images.length) {
            thumbnailContainer.current.style.transform = `translateX(${(-(current+1 - 3) * 140) - 64.5}px)`;
        }

        setCurrent(current + 1);
    }

    const handleTransitionEnd = () => {

        if(current === 0) {
            imagesContainer.current.style.transition = 'none';
            imagesContainer.current.style.transform = `translateX(${-images.length * cw}px)`;
            setCurrent(images.length);
            //imagesContainer.current.style.transition = 'transform .4s ease-in';

        }

        if(current === images.length + 1) {
            imagesContainer.current.style.transition = 'none';
            imagesContainer.current.style.transform = `translateX(${-1 * cw}px)`;
            
            setCurrent(1);
            //imagesContainer.current.style.transition = 'transform .4s ease-in';
        }

    }

    const handleThumbnailClick = (val) => {
        setCurrent(val);
    }

    return (
         
            <div className='product-image-slider-container'>
                <div className='product-image-slider-top'>
                    <div 
                        className='images-container' 
                        ref={imagesContainer} 
                        style={{transform: isCwSet && cw && `translateX(${-current * imagesContainer.current.clientWidth}px)`}} 
                        onTransitionEnd={handleTransitionEnd}
                    >
                        
                        {cw && isCwSet && (
                            <>
                            <img src={images[images.length - 1].url} alt="p-start" />
                            {images.map((image, index) => (
                                <img src={image.url} alt={`p-${index}`} key={index} />
                            ))}
                            <img src={images[0].url} alt="p-end" />
                            </>
                        )}                       
                    </div>
                    {cw &&  (<button className='prev-btn' onClick={handlePrev}><KeyboardArrowLeftIcon /></button>)}
                    {cw && (<button className='next-btn' onClick={handleNext}><KeyboardArrowRightIcon /></button>)}
                    
                    
                </div>
                <div className='product-image-slider-bottom'>
                    {/* <button className='thumbnail-prev'><KeyboardArrowLeftIcon /></button> */}
                    {/* <button className='thumbnail-next'><KeyboardArrowRightIcon /></button> */}
                    <div className='thumbnail-container' ref={thumbnailContainer}>
                        {images.map((image, index) => (
                            <button 
                                className='thumbnail' 
                                key={index} 
                                onClick={e => handleThumbnailClick(index+1)}
                                style={{outline: (current === (index + 1)) && '3px solid #333'}}
                            >
                                <img src={image.url} alt="" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        
    );
}

export default ProductImageSlider;
