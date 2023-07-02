import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';

const SearchBox = () => {

    const [keyword, setKeyword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();

        if(keyword.trim()) {
            navigate(`/search/${keyword}`); // search result
        } else {
            navigate('/'); // home page
        }
    }

    return (
        <Form onSubmit={handleSubmit} style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
            <Form.Control 
                type='text' 
                placeholder='Search for anything...'
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
            ></Form.Control>
            <Button type='submit' variant='primary'>Search</Button>
        </Form>
    );
}

export default SearchBox;