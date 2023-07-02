import {useState} from 'react';
import {Row, Col, Button, Table} from 'react-bootstrap';

import {MdDeleteForever} from 'react-icons/md';

import {toast} from 'react-toastify';

import "./styles/productVariations.css";


const ProductVariations = ({variation, updateVariationState, closeModel}) => {

    const [name, setName] = useState(variation.name);
    const [variations, setVariations] = useState(variation.variations);
    const [currentVariation, setCurrentVariation] = useState(null);

    const handleImageUpload = e => {
        const file = e.target.files[0];
        
        const reader = new FileReader();
        reader.onload = () => {
            setCurrentVariation(prev => ({...prev, image: {file, data_url: reader.result}}))
        }
        reader.readAsDataURL(file);
    }

   
    const handleCreateNewVariation = () => {
        setCurrentVariation({
            val: '',
            qty: 0,
            price: 0,
            discount: 0,
            image: null
        })
    }

    const handleAddNewVariation = () => {
        if(!currentVariation?.val.trim() || +currentVariation?.qty <= 0 || +currentVariation?.price <= 0 || +currentVariation?.discount < 0) {
            alert('Invalid Variation Inputs');
            return;
        }

        // check for duplicate variation names
        const duplicate = variations.find(v => v.val === currentVariation.val);
        if(duplicate) {
            alert('Variation name already added');
            return;
        }

        setVariations([...variations, currentVariation]);
        setCurrentVariation(null);
    }

    const handleCancelNewVariation = () => {
        setCurrentVariation(null);
    }

    const handleDeleteVariation = val => {
        setVariations(prev => prev.filter(v => v.val !== val));
    }

    const saveEverything = () => {
        if(name.trim() === '') {
            toast.error('Variation Name is required');
            return;
        }

        updateVariationState({
            name,
            variations
        });
        toast.success('variation details saved');
        closeModel();

    }


    return (
        <div className='product-variation-container'>
            <div className='product-variation-container-content'>
                <button className='product-variation-model-close-btn' onClick={closeModel}>x</button>
                <div className='product-variation-container-content-scroll'>
                    <Row>
                        <Col>
                            <div className='d-flex flex-column'>
                                <label>Variation Name (default value is Variations)</label>
                                <input type='text' className='py-2 px-3' value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                    <Row className='py-3'>
                        <Col>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Variation Name</th>
                                        <th>Variation Quantity</th>
                                        <th>Variation Price</th>
                                        <th>Variation Discount</th>
                                        <th>Variation Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variations.map(v => (
                                        <tr key={v.val}>
                                            <td>{v.val}</td>
                                            <td>{v.qty}</td>
                                            <td>{v.price}</td>
                                            <td>{v.discount}</td>
                                            <td>
                                                <div className='product-variation-image'>
                                                    {v.image && <img src={v.image.data_url} alt='variation' />}
                                                    {!v.image && <small>No Image Added</small>}
                                                </div>
                                            </td>
                                            <td>
                                                <button className='btn btn-danger btn-sm product-variation-delete-btn' onClick={() => handleDeleteVariation(v.val)}><MdDeleteForever /></button>
                                            </td>
                                        </tr>
                                    ))}

                                    {currentVariation && (
                                        <tr>
                                            <td>
                                                <input type='text' value={currentVariation.val} onChange={e => setCurrentVariation(prev => ({...prev, val: e.target.value.trim()}))} />
                                            </td>
                                            <td>
                                                <input type='number' min='1' step='.00' value={currentVariation.qty} onChange={e => setCurrentVariation(prev => ({...prev, qty: e.target.value}))} />
                                            </td>
                                            <td>
                                                <input type='number' min='1' step='.01' value={currentVariation.price} onChange={e => setCurrentVariation(prev => ({...prev, price: e.target.value}))} />
                                            </td>
                                            <td>
                                                <input type='number' min='0' step='.01' value={currentVariation.discount} onChange={e => setCurrentVariation(prev => ({...prev, discount: e.target.value}))} />
                                            </td>
                                            <td>
                                                <input type='file' accept='image/jpeg' onChange={handleImageUpload} />
                                            </td>
                                            
                                        </tr>
                                    )}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className='py-3'>
                        <Col>
                            <div className='d-flex align-items-center gap-3'>
                                {!currentVariation && <Button className='btn btn-dark' onClick={handleCreateNewVariation}>Create New Variation</Button>}
                                {!currentVariation &&  <button className='btn btn-info ml-3' onClick={saveEverything}>Save Everything</button>}
                                {currentVariation && <Button className='btn btn-dark' onClick={handleAddNewVariation} >Add New Variation</Button>}
                                {currentVariation && <Button className='btn btn-danger ml-3' onClick={handleCancelNewVariation} >Cancel New Variation</Button>}
                            </div>
                        </Col>
                    </Row>
                    
                </div>
            </div>
                
        
        </div>
    );
}

export default ProductVariations;
