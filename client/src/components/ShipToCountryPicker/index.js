import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectShipTo, updateShipTo} from '../../app/slices/shipToSlice';

import {MdKeyboardArrowDown, MdKeyboardArrowUp} from 'react-icons/md';

import './styles/shipToCountryPicker.css';

const shippingCountries = [
    {isoCode: "US", name: "United States", image: 'united_states.jpg'},
    {isoCode: "GB", name: "United Kingdom", image: 'united_kingdom.jpg'},
    {isoCode: "AU", name: "Australia", image: 'australia.jpg'},
    {isoCode: "CA", name: "Canada", image: 'canada.jpg'},
    {isoCode: "NO", name: "Norway", image: 'norway.jpg'},
    {isoCode: "BE", name: "Belgium", image: 'belgium.jpg'},
    {isoCode: "FR", name: "France", image: 'france.jpg'},
    {isoCode: "DE", name: "Germany", image: 'germany.jpg'},
    {isoCode: "IT", name: "Italy", image: 'italy.jpg'},
    {isoCode: "PL", name: "Poland", image: 'poland.jpg'},
    {isoCode: "PT", name: "Portugal", image: 'portugal.jpg'},
    {isoCode: "ES", name: "Spain", image: 'spain.jpg'},
    {isoCode: "IE", name: "Ireland", image: 'ireland.jpg'},
    {isoCode: "NL", name: "Netherlands", image: 'netherlands.jpg'},
    {isoCode: "AT", name: "Austria", image: 'austria.jpg'},
    {isoCode: "BG", name: "Bulgaria", image: 'bulgaria.jpg'},
    {isoCode: "HR", name: "Croatia", image: 'croatia.jpg'},
    {isoCode: "CZ", name: "Czech Republic", image: 'czech_republic.jpg'},
    {isoCode: "DK", name: "Denmark", image: 'denmark.jpg'},
    {isoCode: "EE", name: "Estonia", image: 'estonia.jpg'},
    {isoCode: "FI", name: "Finland", image: 'finland.jpg'},
    {isoCode: "GR", name: "Greece", image: 'greece.jpg'},
    {isoCode: "HU", name: "Hungary", image: 'hungary.jpg'},
    {isoCode: "LV", name: "Latvia", image: 'latvia.jpg'},
    {isoCode: "LU", name: "Luxembourg", image: 'luxembourg.jpg'},
    {isoCode: "RO", name: "Romania", image: 'romania.jpg'},
    {isoCode: "SK", name: "Slovakia", image: 'slovakia.jpg'},
    {isoCode: "SI", name: "Slovenia", image: 'slovenia.jpg'},
    {isoCode: "SE", name: "Sweden", image: 'sweden.jpg'},
    
]


const ShipToCountryPicker = ({closeModel}) => {

    const shipTo = useSelector(selectShipTo);
    const [isCountryListOpen, setIsCountryListOpen] = useState(false);
    const [currentSelected, setCurrentSelected] = useState({...shipTo, name: shipTo.country});

    const dispatch = useDispatch();

    const handleCurrentSelection = country => {
        setCurrentSelected(country);
        setIsCountryListOpen(false);
    }

    const handleSave = () => {
        if(shipTo.isoCode === currentSelected.isoCode) return closeModel();

        dispatch(updateShipTo({
            country: currentSelected.name,
            isoCode: currentSelected.isoCode,
            image: currentSelected.image
        }));
        closeModel();
    }

    return (
        <div className="shipToCountryPicker">
            <p className='shipToCountryPicker-title'>Select your shipping location</p>

            <div className='shipToCountryPicker-select-container'>

                <div className='shipToCountryPicker-current-selected-country border'>
                    <div>
                        <img src={`${window.location.origin}/images/country_flags/${currentSelected.image}`} alt='country' />
                        <p>{currentSelected.name}</p>
                    </div>
                    <button onClick={() => setIsCountryListOpen(prev => !prev)}>{isCountryListOpen ? (<MdKeyboardArrowUp />) : (<MdKeyboardArrowDown />)}</button>
                </div>

                {isCountryListOpen && (
                    <div className='shipToCountryPicker-select-list'>
                        {/* <button>
                            <img src='images/country_flags/australia.jpg' alt='country' />
                            <span>Australia</span>
                        </button>
                        <button>
                            <img src='images/country_flags/australia.jpg' alt='country' />
                            <span>United Kingdom</span>
                        </button> */}
                        {shippingCountries.map(country => (
                            <button key={country.isoCode} onClick={() => handleCurrentSelection(country)}>
                                <img src={`${window.location.origin}/images/country_flags/${country.image}`} alt='country' />
                                <span>{country.name}</span>
                            </button>
                        ))}
                    </div>
                )}
                

            </div>

            <div className='shipToCountryPicker-controls'>
                <button className='shipToCountryPicker-save btn btn-primary btn-sm' onClick={handleSave}>Save</button>
                <button className='shipToCountryPicker-cancel btn btn-danger btn-sm' onClick={closeModel}>Cancel</button>
            </div>
        </div>
    );
}

export default ShipToCountryPicker;