import { Link } from 'react-router-dom';

const Planner = () => {
  return (
    <>
      <h2>Planner page</h2>

      <Link to="/trip">Plan Trip Routes</Link>
      <Link to="/pass">Plan Passes</Link>
    </>
  );
};

export default Planner;