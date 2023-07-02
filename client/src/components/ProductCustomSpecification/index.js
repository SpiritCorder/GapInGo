import {useState, useRef} from 'react';
import {Row, Col, Button, ListGroup} from 'react-bootstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles/productCustomSpecification.css';

const ProductCustomSpecification = ({specs=[], closeModel, updateCustomSpecifications}) => {

    const nameRef = useRef();
    const valueRef = useRef();

    const [specifications, setSpecifications] = useState(specs);
    const [currentSpecification, setCurrentSpecification] = useState(null);

    const createNewSpecification = () => {
        setCurrentSpecification({name: '', value: ''});
    }

    const addNewSpecification = () => {
        const name = nameRef.current.value.trim();
        const value = valueRef.current.value.trim();
        
        if(!name || !value) {
            return;
        }

        const newSpecification = {
            name,
            value
        }
        const updatedSpecifications = [...specifications, newSpecification];
        setSpecifications(updatedSpecifications);
        setCurrentSpecification(null);
        updateCustomSpecifications(updatedSpecifications);
    }

    const deleteAddedSpecification = (name) => {
        const updatedSpecifications = specifications.filter(spec => spec.name !== name);
        setSpecifications(updatedSpecifications);
        updateCustomSpecifications(updatedSpecifications);
    }

    return (
        <div className='product-custom-specification-container'>
            <div className='product-custom-specification-content'>
                <button type='button' className='product-custom-specification-close-btn' onClick={closeModel}>x</button>
                <Row>
                    <Col>
                        <div className='product-custom-specification-scroll'>
                            <h3>Add custom product specifications</h3>
                            {!currentSpecification && <Button type='button' variant='dark' className='my-4' onClick={createNewSpecification}>Create new specification</Button>}
                            
                            {currentSpecification && (
                                <div className='custom-specification-input-container my-4'>
                                    <div className='custom-specification-input-name'>
                                        <label>specification name</label>
                                        <input type='text' placeholder='name of the specification' ref={nameRef} />
                                    </div>
                                    <span></span>
                                    <div className='custom-specification-input-value'>
                                        <label>specification value</label>
                                        <input type='text' placeholder='value of the specification' ref={valueRef} />
                                    </div>
                                    <button type='button' onClick={addNewSpecification}>Add</button>
                                </div>
                            )}

                            {specifications.length > 0 && (
                                <>
                                    <hr></hr>
                                    <h4 className='my-4'>Already added specifications</h4>
                                    <ListGroup className='w-100'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Name</Col>
                                                <Col>Value</Col>
                                                <Col></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {specifications.map(spec => (
                                            <ListGroup.Item key={spec.name}>
                                                <Row>
                                                    <Col className='d-flex align-items-center'>{spec.name}</Col>
                                                    <Col className='d-flex align-items-center'>{spec.value}</Col>
                                                    <Col><button type='button' className='custom-specification-delete-btn' onClick={() => deleteAddedSpecification(spec.name)}><DeleteIcon /></button></Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </>
                            )}

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ProductCustomSpecification;