
import './styles/overlay.css';

const Overlay = ({closeModel}) => {

    return (
        <div className="overlay" onClick={() => closeModel()}>
        </div>
    );
}

export default Overlay;