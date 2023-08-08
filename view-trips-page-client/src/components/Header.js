import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrain } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <Link to="/" className="logo">
          <FontAwesomeIcon icon={faTrain} />
          <span style={{ marginLeft: '8px' }}>Japan Planner</span>
        </Link>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
