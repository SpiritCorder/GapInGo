import React, {useState, useRef} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import './style.css';

const ImageUploader = ({updateImagesState}) => {

    const [images, setImages] = useState([]);
    //const max = 12;

    const fileInput = useRef();

    const handleOpenFileUpload = () => {
        fileInput.current.click();
    }

    const handleUploadedFiles = e => {
        const newImages = [...images];
        const selected = Array.from(e.target.files);
        selected.forEach(file => {
            newImages.push(file);
        })
        setImages(newImages);
        updateImagesState(newImages);
    }

    const handleDeleteSelectedImage = index => {
        setImages(images.filter((item, i) => i != index));
        updateImagesState(images.filter((item, i) => i != index));
    }

    return (
        <Container>
            <Row className='mb-4 mt-4'>
                <Col md={6} className='left'>
                    <div className='left-btn-container'>
                        <button type='button' onClick={handleOpenFileUpload} id='upload-open-btn' disabled={images.length === 12}>
                            <AddIcon />
                        </button>
                        <input type="file" multiple accept='image/jpeg' id="upload-input" ref={fileInput} onChange={handleUploadedFiles} />
                    </div>
                </Col>

                <Col md={6} className='right'>
                    <div className='right-grid'>
                        {Array.from({length: 12}).map((item, index) => (
                            <div key={index} className='grid-item'>
                                {images[index] ? (
                                    <>
                                        <button type='button' onClick={() => handleDeleteSelectedImage(index)}>x</button>
                                        <img src={URL.createObjectURL(images[index])} />
                                    </>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                                
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
    );
    
}

export default ImageUploader;