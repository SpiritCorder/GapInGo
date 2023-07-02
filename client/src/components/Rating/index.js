

const Rating = ({rating, reviews}) => {

    return (
        <div className='rating'>
            <span>
                <i style={{color: '#f8e825'}} className={rating >= 1 ? 'fa-solid fa-star' : rating >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star' }></i>
            </span>
            <span>
                <i style={{color: '#f8e825'}} className={rating >= 2 ? 'fa-solid fa-star' : rating >= 1.5 ? 'fas fa-star-half-alt' : 'far fa-star' }></i>
            </span>
            <span>
                <i style={{color: '#f8e825'}} className={rating >= 3 ? 'fa-solid fa-star' : rating >= 2.5 ? 'fas fa-star-half-alt' : 'far fa-star' }></i>
            </span>
            <span>
                <i style={{color: '#f8e825'}} className={rating >= 4 ? 'fa-solid fa-star' : rating >= 3.5 ? 'fas fa-star-half-alt' : 'far fa-star' }></i>
            </span>
            <span>
                <i style={{color: '#f8e825'}} className={rating >= 5 ? 'fa-solid fa-star' : rating >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star' }></i>
            </span>
            <span className='ml-3'>{reviews} reviews</span>
        </div>
    );
}

export default Rating;