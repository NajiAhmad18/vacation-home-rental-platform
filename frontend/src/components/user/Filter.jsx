import React, { useState } from 'react';
import { SlidersHorizontal, Home, DollarSign, MapPin } from 'lucide-react';

const FilterBar = ({ properties }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const propertyTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'house', label: 'House' },
    { id: 'condo', label: 'Condo' },
    { id: 'townhouse', label: 'Townhouse' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Any Price' },
    { id: '1000', label: 'Under $1,000' },
    { id: '1000-2000', label: '$1,000 - $2,000' },
    { id: '2000-3000', label: '$2,000 - $3,000' },
    { id: '3000+', label: '$3,000+' }
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-gray-500" />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {propertyTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>

            <button className="flex items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-blue-300 transition-colors duration-200">
              <SlidersHorizontal className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{properties.length}</span> properties found
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;