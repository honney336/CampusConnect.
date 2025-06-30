import React, { useState } from 'react';

const Product = () => {
  const [modelNumber, setModelNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data
    console.log('Model Number:', modelNumber);
    console.log('Manufacturer:', manufacturer);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Model Number:</label>
        <input className='border border-gray-300 m-2 p-1 rounded-2xl'
          type="text" 
          placeholder='Enter Model Number'
          value={modelNumber}
          onChange={(e) => setModelNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Manufacturer:</label>
        <input  className='border border-gray-300 m-2 p-1 rounded-2xl'
          type="text" 
          placeholder='Enter Manufacturer'
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />
      </div>
      <button className='bg-blue-600 hover:bg-blue-700 rounded-2xl px-4 py-2 text-white' type="submit">Submit</button>
    </form>
  );
};

export default Product;


