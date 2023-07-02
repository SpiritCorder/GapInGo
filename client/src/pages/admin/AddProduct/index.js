import React, {useState, useRef} from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useFirebaseStorage from '../../../hooks/useFirebaseStorage';
import {createPortal} from 'react-dom';
import {Row, Col, Button, Form, InputGroup} from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ImageUploader from '../../../components/ImageUploader';
import ProductVariations from '../../../components/ProductVariations';
import ProductCustomSpecification from '../../../components/ProductCustomSpecification';
import Overlay from '../../../components/Overlay';
import RichTextEditor from '../../../components/RichTextEditor';
import ReactPlayer from 'react-player/youtube'
import { Country } from 'country-state-city';

import {toast} from 'react-toastify';

import './styles/style.css';
import ProductCountrySelector from '../../../components/AddProductComponenets/ProductCountrySelector';
import ProductShippingDetails from '../../../components/AddProductComponenets/ProductShippingDetails';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


const AddProduct = () => {

  const axiosPrivate = useAxiosPrivate();
  const {isUploading, uploadImages} = useFirebaseStorage();

  const urlInputRef = useRef();

  const materialInputRef = useRef();
  const brandInputRef = useRef();
  const countryInputRef = useRef();
  const colorInputRef = useRef();
  const itemTypeInputRef = useRef();

  const detailDescriptionInputRef = useRef();

  const [key, setKey] = useState('detailed_description');

  const [isVariationModelOpen, setIsVariationModelOpen] = useState(false);
  const [isCustomSpecificationModelOpen, setIsCustomSpecificationModelOpen] = useState(false);

  const [isProductCreating, setIsProductCreating] = useState(false);

  // product state
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [condition, setCondition] = useState('Brand New');
  const [recommendedSpecifications, setRecommendedSpecifications] = useState({
    material: '',
    brand: '',
    country: '',
    color: '',
    itemType: ''
  });
  const [customSpecifications, setCustomSpecifications] = useState([]);

  const [description, setDescription] = useState(''); // not required
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [inStock, setInStock] = useState(0); 

  const [url, setUrl] = useState(''); 

  const [images, setImages] = useState([]);
  const [variation, setVariation] = useState({
    name: 'Variations',
    variations: []
  });
  const [detaildDescriptionHtml, setDetailedDescriptionHtml] = useState('');

  // shipping countries state
  const [shippingCountries, setShippingCountries] = useState([]);
  const [countryShippingDetails, setCountryShippingDetails] = useState([]);
  const [handlingTime, setHandlingTime] = useState('');
  const [itemLocation, setItemLocation] = useState({
    country: '',
    state: ''
  });
  const [returns, setReturns] = useState({
    type: 'not-accepted',
    returnShippingCostPaidBy: ''
  });
    
  const closeModel = () => {
    if(isVariationModelOpen) {
      setIsVariationModelOpen(false);
    }

    if(isCustomSpecificationModelOpen) {
      setIsCustomSpecificationModelOpen(false);
    }
  }

  // const closeCustomSpecificationModel = () => {
  //   setIsCustomSpecificationModelOpen(false);
  // }

  const addRecommendedSpecifications = e => {
    const type = e.target.getAttribute('custom-add_type');

    switch(type) {
      case 'material':
        if(materialInputRef.current.value.trim() === '') return;
        return setRecommendedSpecifications(prev => ({
          ...prev,
          material: materialInputRef.current.value
        }))
      case 'brand':
        if(brandInputRef.current.value.trim() === '') return;
        return setRecommendedSpecifications(prev => ({
          ...prev,
          brand: brandInputRef.current.value
        }))
      case 'country':
        if(countryInputRef.current.value.trim() === '') return;
        return setRecommendedSpecifications(prev => ({
          ...prev,
          country: countryInputRef.current.value
        }))
      case 'color':
        if(colorInputRef.current.value.trim() === '') return;
        return setRecommendedSpecifications(prev => ({
          ...prev,
          color: colorInputRef.current.value
        }))
      case 'itemType':
        if(itemTypeInputRef.current.value.trim() === '') return;
        return setRecommendedSpecifications(prev => ({
          ...prev,
          itemType: itemTypeInputRef.current.value
        }))

      default:
        return;
    }
  }

  const removeRecommendedSpecifications = e => {
    const div = e.target.parentElement.parentElement.parentElement;
    const type = div.getAttribute('custom-remove_type');

    switch(type) {
      case 'material':
        return setRecommendedSpecifications(prev => ({...prev, material: ''}))
      case 'brand':
        return setRecommendedSpecifications(prev => ({...prev, brand: ''}))
      case 'country':
        return setRecommendedSpecifications(prev => ({...prev, country: ''}))
      case 'color':
        return setRecommendedSpecifications(prev => ({...prev, color: ''}))
      case 'itemType':
        return setRecommendedSpecifications(prev => ({...prev, itemType: ''}))
      default:
        return;
    }
  }

  const updateCustomSpecifications = (newSpecs) => {
    setCustomSpecifications(newSpecs);
  }

  // create new product handler
  const handleCreateProduct = async e => {
      e.preventDefault();

      setIsProductCreating(true);
      // validate product data
      if(
        !title.trim() ||
        !subTitle.trim() ||
        !condition.trim() ||
        +price < 0 ||
        +discount < 0 ||
        +inStock < 0 ||
        images.length <= 0
      ) {
        setIsProductCreating(false);
        alert('Invalid Input Data');
        return;
      }

      // check if no variations, then price and quantity must be there
      if(variation.variations.length <= 0 && (+price <= 0 || +inStock <= 0)) {
        setIsProductCreating(false);
        alert('Product has no variations, so please enter valid price and quantity');
        return;
      }

      // shipping data check

      if(shippingCountries.length <= 0 || countryShippingDetails.length <= 0) {
        toast.error('Please add shipping countries and shipping details');
        return;
      }

      if(shippingCountries.length !== countryShippingDetails.length) {
        toast.error('Please give shipping information for all selected countries');
        return;
      }

      if(!handlingTime) {
        toast.error('Handling time is required');
        return;
      }

      if(!itemLocation.country) {
        toast.error('Item location is required');
        return;
      }

      if((returns.type === 'accepted-within-7-days' || returns.type === 'accepted-within-15-days') && !returns.returnShippingCostPaidBy) {
        toast.error('Please enter who is going to pay return shipping cost');
        return;
      }

      // create new product object
      const newProduct = {
        title: title.trim(),
        subTitle: subTitle.trim(),
        variations: variation.variations.length,
        condition,
        recommendedSpecifications,
        customSpecifications,
        aboutDescription: description.trim(),
        regularPrice: +price,
        regularQuantity: +inStock,
        discount: +discount,
        detailedDescription: detaildDescriptionHtml,
        videoUrl: url.trim(),
        shippingCountries,
        countryShippingDetails,
        handlingTime,
        itemLocation,
        returns
      }

      try {
        const response = await axiosPrivate.post('/api/admin/products', JSON.stringify(newProduct));
       
        // upload product images
        const imageUrls = await uploadImages(response.data.product._id, images, variation.variations);
    
        // update variations image urls
        const newVariations = variation.variations.map((v, index) => {
          if(v.image) {
            return {
              ...v,
              image: {
                fileName: imageUrls[images.length + index].fileName,
                url: imageUrls[images.length + index].url
              }
            }
          }
          return v;
        })

        console.log(newVariations);

        const updateData = {
          images: imageUrls,
          variations: {
            name: variation.name,
            values: newVariations
          }
        }

        console.log(updateData);

        
        await axiosPrivate.put(`/api/admin/products/images/${response.data.product._id}`, JSON.stringify(updateData));
        setIsProductCreating(false);
        toast.success('Product added success');

      } catch (err) {
        console.log(err);
        setIsProductCreating(false);
      }

    }

    return (

      <>

      {isCustomSpecificationModelOpen && createPortal(
        <ProductCustomSpecification
          closeModel={closeModel}
          specs={customSpecifications}
          updateCustomSpecifications={updateCustomSpecifications}
        />,
        document.getElementById('portals')
      )}

      {isVariationModelOpen &&  createPortal(
      <ProductVariations 
        closeModel={closeModel} 
        variation={variation}
        updateVariationState={setVariation} 

      />, document.getElementById('portals'))}
             
      {(isVariationModelOpen || isCustomSpecificationModelOpen) && createPortal(<Overlay closeModel={closeModel} />, document.getElementById('overlay'))}
      
      {!isVariationModelOpen && (
          <Row>
          <Col>
              <h1 className='mt-3 mb-5 text-center'>Add a new product</h1>
              <Form onSubmit={handleCreateProduct}>
                  <Form.Group className='mb-5'>
                      <Form.Label>Product Title</Form.Label>
                      <Form.Control 
                          type='text' 
                          placeholder='Enter product title'
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                      ></Form.Control>
                  </Form.Group>


                  <Form.Group className='mb-5'>
                      <Form.Label>Product Sub Title</Form.Label>
                      <Form.Control 
                          type='text' 
                          placeholder='Enter product sub title'
                          value={subTitle}
                          onChange={e => setSubTitle(e.target.value)}
                      ></Form.Control>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label className='d-block'>If your product having variations you can add them</Form.Label>
                    <Button variant='dark' onClick={() => setIsVariationModelOpen(true)}>Add Variations</Button>
                  </Form.Group>

                  {variation.variations.length > 0 && (
                    <>
                    <small className='mb-2 d-block'>Already added variations</small>
                    <Paper
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                      }}
                      component="ul"
                    >
                      {variation.variations.map(v => (
                        <ListItem key={v.val} >
                          <Chip label={v.val} color='primary' variant='filled' />
                        </ListItem>
                      ))}
                      <ListItem>
                        <Chip label='see all' color='primary' variant='outlined' onClick={() => setIsVariationModelOpen(true)} />
                      </ListItem>
                    </Paper>
                    </>
                  )}

                  <div className='mb-5 mt-5'>
                      <Form.Label>Product Condition</Form.Label>
                      <Form.Check
                          defaultChecked
                          type='radio'
                          label='Brand New'
                          name='condition'
                          value='Brand New'
                          onChange={e => setCondition(e.target.value)}
                      />
                      <Form.Check
                          type='radio'
                          label='Open Box'
                          name='condition'
                          value='Open Box'
                          onChange={e => setCondition(e.target.value)}
                      />
                      <Form.Check
                          type='radio'
                          label='Already Used'
                          name='condition'
                          value='Already Used'
                          onChange={e => setCondition(e.target.value)}
                      />
                      
                  </div>

                  <Row className='mb-5'>
                    <Col>
                      <div className='product-specifications-container'>
                        <Form.Label className='mb-5'>Product Specifications</Form.Label>
                        <div className='recommended-specifications'>
                          <Form.Label>Recommended Specifications</Form.Label>
                          <Row>

                            <Col md={4} className='mb-4'>
                              <small className='specification-label'>Material</small>
                              <div className='specification'>
                                <input type='text' placeholder='material' ref={materialInputRef} disabled={recommendedSpecifications.material} />
                                <button type='button' custom-add_type="material" onClick={addRecommendedSpecifications} disabled={recommendedSpecifications.material}>Add</button>
                              </div>
                              {recommendedSpecifications.material && (
                                <div className='specification-chip-container' custom-remove_type='material'>
                                  <Chip label={recommendedSpecifications.material.toUpperCase()} color="primary" variant="filled" onDelete={removeRecommendedSpecifications} />
                                </div>
                              )}
                              
                            </Col>

                            <Col md={4}>
                              <small className='specification-label'>Brand</small>                              
                              <div className='specification'>
                                <input type='text' placeholder='brand' ref={brandInputRef} disabled={recommendedSpecifications.brand} />
                                <button type='button' custom-add_type="brand" onClick={addRecommendedSpecifications} disabled={recommendedSpecifications.brand}>Add</button>
                              </div>
                              {recommendedSpecifications.brand && (
                                <div className='specification-chip-container' custom-remove_type='brand'>
                                  <Chip label={recommendedSpecifications.brand.toUpperCase()} color="primary" variant="filled" onDelete={removeRecommendedSpecifications} />
                                </div>
                              )}
                            </Col>

                            <Col md={4}>
                              <small className='specification-label'>Country/Region of Manufacture</small>                              
                              <div className='specification'>
                                <input type='text' placeholder='country/region of manufacture' ref={countryInputRef} disabled={recommendedSpecifications.country} />
                                <button type='button' custom-add_type="country" onClick={addRecommendedSpecifications} disabled={recommendedSpecifications.country}>Add</button>
                              </div>
                              {recommendedSpecifications.country && (
                                <div className='specification-chip-container' custom-remove_type='country'>
                                  <Chip label={recommendedSpecifications.country.toUpperCase()} color="primary" variant="filled" onDelete={removeRecommendedSpecifications} />
                                </div>
                              )}
                            </Col>
                            <Col md={4}>
                              <small className='specification-label'>Color</small>                              
                              <div className='specification'>
                                <input type='text' placeholder='color' ref={colorInputRef} disabled={recommendedSpecifications.color} />
                                <button type='button' custom-add_type="color" onClick={addRecommendedSpecifications} disabled={recommendedSpecifications.color}>Add</button>
                              </div>
                              {recommendedSpecifications.color && (
                                <div className='specification-chip-container' custom-remove_type='color'>
                                  <Chip label={recommendedSpecifications.color.toUpperCase()} color="primary" variant="filled" onDelete={removeRecommendedSpecifications} />
                                </div>
                              )}
                            </Col>
                            <Col md={4}>
                              <small className='specification-label'>Item Type</small>                              
                              <div className='specification'>
                                <input type='text' placeholder='item type' ref={itemTypeInputRef} disabled={recommendedSpecifications.itemType} />
                                <button type='button' custom-add_type="itemType" onClick={addRecommendedSpecifications} disabled={recommendedSpecifications.itemType}>Add</button>
                              </div>
                              {recommendedSpecifications.itemType && (
                                <div className='specification-chip-container' custom-remove_type='itemType'>
                                  <Chip label={recommendedSpecifications.itemType.toUpperCase()} color="primary" variant="filled" onDelete={removeRecommendedSpecifications} />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </div>
                        <div className='custom-specifications mt-4'>
                          <Form.Label>Custom Specifications</Form.Label>
                          <button 
                            type='button' 
                            className='custom-specifications-add'
                            onClick={() => setIsCustomSpecificationModelOpen(true)}
                          >Add <AddIcon /> 
                          </button>
                          <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0.5,
                                m: 0,
                              }}
                              component="ul"
                              className='my-4'
                          >
                            {customSpecifications.length > 0 &&  customSpecifications.map(spec => (
                              
                                <ListItem key={spec.name} >
                                  <Chip label={spec.name} color='primary' variant='filled' />
                                </ListItem>
                              
                            ))}
                            <ListItem>
                                <Chip label="view all" color='primary' variant='outlined' onClick={() => setIsCustomSpecificationModelOpen(true)} />
                            </ListItem>
                          </Paper>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Form.Group className='mb-5'>
                      <Form.Label>About the product</Form.Label>
                      <Form.Control 
                          as='textarea' 
                          rows={5}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                      ></Form.Control>
                  </Form.Group>

                  <Form.Group className='mb-5'>
                      <Form.Label>Product Regular Price</Form.Label>
                      <Form.Control 
                          type='number' 
                          step=".01"
                          min="0.00"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          onWheel={e => e.target.blur()}
                      ></Form.Control>
                  </Form.Group>

                  <Form.Group className='mb-5'>
                      <Form.Label>Product Discount (will be taken as a percentage)</Form.Label>
                      <Form.Control 
                          type='number' 
                          step=".01"
                          min="0"
                          value={discount}
                          onChange={e => setDiscount(e.target.value)}
                          onWheel={e => e.target.blur()}
                      ></Form.Control>
                  </Form.Group>

                  <Form.Group className='mb-5'>
                      <Form.Label>Product available pices in stock (only accept integer values)</Form.Label>
                      <Form.Control 
                          type='number' 
                          step="1"
                          min="0"
                          value={inStock}
                          onChange={e => setInStock(e.target.value)}
                          onWheel={e => e.target.blur()}
                      ></Form.Control>
                  </Form.Group>

                  
                
                  {/* <Form.Group controlId="formFileMultiple" className="mb-4">
                      <Form.Label>Upload all images</Form.Label>
                      <Form.Control type="file" multiple />
                  </Form.Group> */}
                 
                  <Form.Label>Upload Product Images (maximum of 12)</Form.Label>
                  <ImageUploader updateImagesState={setImages} />
                 
                  

                  <Row className='mb-5'>
                    <Col>
                      <Form.Label className="d-block">Detailed Product Description</Form.Label>
                      <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                       
                      >
                        <Tab eventKey="detailed_description" title="Detailed Description">
                          <RichTextEditor
                            detailedDescription={detaildDescriptionHtml}
                            updateDetailedDescription={setDetailedDescriptionHtml} 
                          />
                        </Tab>

                        <Tab eventKey="detailed_description_html" title="HTML">
                          <div className='w-100'>
                            
                              <>
                                <textarea 
                                  className='w-100 py-2 px-3' 
                                  ref={detailDescriptionInputRef} 
                                  value={detaildDescriptionHtml} 
                                  onChange={e => setDetailedDescriptionHtml(e.target.value)}
                                  onselectstart="return false"
                                  onPaste={e => {
                                    e.preventDefault();
                                    return false;
                                  }}
                  
                                >
                                  {detaildDescriptionHtml}
                                </textarea>
                                {/* <button type='button' className='btn btn-info' onClick={() => setDetailedDescriptionHtml(detailDescriptionInputRef.current?.value)}>Update Changes</button> */}
                              </>
                            
                          </div>
                        </Tab>

                        <Tab eventKey="detailed_description_preview" title="Preview">
                          {!detaildDescriptionHtml ? (
                              <p>Please save to see the preview</p>
                            ) : (
                              <div dangerouslySetInnerHTML={{ __html: detaildDescriptionHtml }}>
                              </div>
                          )}
                        </Tab>
                        
                      </Tabs>
                      
                    </Col>
                  </Row>

                  <Row className='mb-5'>
                   
                      <Col>
                        <Form.Label>Add product video url</Form.Label>
                        <InputGroup className="mb-3" id="video-url-container">
                          <Form.Control
                            type='url'
                            placeholder="product video url"
                            aria-label="product_video_url"
                            aria-describedby="product_video_url"
                            className='border-none'
                            id="video-url-input"
                            ref={urlInputRef}
                          />
                          <Button 
                            type='button' 
                            variant="outline-secondary" 
                            id="button-addon2"
                            onClick={() => setUrl(urlInputRef.current.value)}
                          >
                            Add
                          </Button>
                        </InputGroup>
                      </Col>
                  </Row>
                      
                    {url && (
                      <Row className='mb-5'>
                        <Col>
                          <div className='video-output-container'>  
                            <ReactPlayer 
                              url={url} 
                              controls 
                              playing 
                                
                            />
                          </div>
                        </Col>
                      </Row>
                    )}

                  <hr></hr>
                      
                  {/* SHIPPING DETAILS */}
                  <Row className='mb-5'>
                    <Col md={12}>
                      <h1 className='m-0 p-0 mb-3'>Shipping Countries</h1>
                      <ProductCountrySelector setShippingCountries={setShippingCountries} alreadySelectedShippingCountries={shippingCountries} />
                    </Col>
                  </Row>

                  {shippingCountries.length > 0 && (
                    <Row className='mb-5'>
                        <Col md={12}>
                          <h1 className='mb-3 text-muted'>Shipping Details</h1>
                          <ProductShippingDetails shippingCountries={shippingCountries} setCountryShippingDetails={setCountryShippingDetails} />
                        </Col>
                    </Row>
                  )}
                  
                  <hr></hr>

                  <Row className='mb-5'>
                    <Col md={12}>
                      <div className='d-flex flex-column gap-2'>
                        <label style={{fontSize: '18px', fontWeight: '500'}}>Handling Time</label>
                        <select className='py-2 px-4' style={{width: 'max-content'}} value={handlingTime} onChange={e => setHandlingTime(e.target.value)} >
                          <option value='' className='text-start'>--Select Handling Time--</option>
                          <option value='1 business day' className='text-start'>1 business day</option>
                          <option value='2 business days' className='text-start'>2 business days</option>
                          <option value='3 business days' className='text-start'>3 business days</option>
                          <option value='4 business days' className='text-start'>4 business days</option>
                          <option value='5 business days' className='text-start'>5 business days</option>
                          <option value='6 business days' className='text-start'>6 business days</option>
                          <option value='7 business days' className='text-start'>7 business days</option>
                          <option value='10 business days' className='text-start'>10 business days</option>
                          <option value='15 business days' className='text-start'>15 business days</option>
                          <option value='20 business days' className='text-start'>20 business days</option>
                          <option value='30 business days' className='text-start'>30 business days</option>
                          <option value='40 business days' className='text-start'>40 business days</option>
                        </select>
                      </div>
                    </Col>
                  </Row>

                  <hr></hr>

                  <Row className='mb-5'>
                    <Col md={12}>
                      <div className='d-flex flex-column gap-3'>

                        <label style={{fontSize: '18px', fontWeight: '500'}}>Item Location</label>
                        <div>

                          <div className='d-flex flex-column gap-2'>
                            <label>Country or Region</label>
                            <select className='py-2 px-4' style={{width: 'max-content'}} value={itemLocation.country} onChange={e => setItemLocation(prev => ({...prev, country: e.target.value}))}>
                              <option value=''>--select the country--</option>
                              {Country.getAllCountries().map(c => (
                                <option key={c.isoCode} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className='d-flex flex-column gap-2 mt-3'>
                            <label>State/City</label>
                            <input type='text' style={{width: 'max-content'}} placeholder='state/city' className='py-2 px-3' value={itemLocation.state} onChange={e => setItemLocation(prev => ({...prev, state: e.target.value}))} />
                          </div>

                        </div>
                      </div>
                    </Col>
                  </Row>

                  <hr></hr>

                  <Row className='mb-5'>
                    <Col md={12}>
                      <div className='d-flex flex-column gap-3'>
                          <label style={{fontSize: '18px', fontWeight: '500'}}>Returns</label>

                          <select className='py-2 px-4' style={{width: 'max-content'}} value={returns.type} onChange={e => setReturns(prev => ({...prev, type: e.target.value}))}>
                            <option className='text-start' value='not-accepted'>Not Accepted</option>
                            <option className='text-start' value='accepted-within-7-days'>Accepted within 7 days</option>
                            <option className='text-start' value='accepted-within-15-days'>Accepted within 15 days</option>
                          </select>
                          <div>
                            <div className='d-flex align-items-center gap-2'>
                              <input type='radio' value='buyer' name='return-pay' onChange={e => setReturns(prev => ({...prev, returnShippingCostPaidBy: e.target.value}))} />
                              <label style={{fontSize: '15px'}}>Return shipping cost paid by buyer</label>
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                              <input type='radio' value='seller' name='return-pay' />
                              <label style={{fontSize: '15px'}}>Return shipping cost paid by seller</label>
                            </div>
                          </div>
                      </div>
                    </Col>
                  </Row>

                  <Button type='submit' className='my-5'>
                    {isProductCreating && !isUploading ? 'Product Creating...' : isProductCreating && isUploading ? 'Product images uploading...' : 'Create Product'}
                  </Button>
              </Form>
          </Col>
      </Row>
      )}

        

        </>
    );
}

export default AddProduct;