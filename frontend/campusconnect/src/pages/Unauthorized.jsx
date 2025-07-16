import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <ShieldX className="h-24 w-24 text-red-500" />
        </div>
        
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h1>
        
        <p className="mt-4 text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
        
        <p className="mt-2 text-sm text-gray-500">
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;