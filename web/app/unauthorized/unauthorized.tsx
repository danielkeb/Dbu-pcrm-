import { NextPage } from 'next';

const Unauthorized: NextPage = () => {
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};

export default Unauthorized;
