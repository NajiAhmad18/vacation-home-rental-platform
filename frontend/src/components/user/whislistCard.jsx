import React from 'react';
import { Heart, Star, Users, Bed, Bath, GripVertical, X } from 'lucide-react';


const WishlistCard = ({
  item,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-move ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex">
        <div className="relative flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-48 h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 bg-blue-700 text-white px-2 py-1 rounded-full text-xs font-medium">
            Priority #{item.priority}
          </div>
        </div>
        
        <div className="flex-1 p-4 relative">
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="pr-16">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {item.title}
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{item.location}</p>
            
            <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{item.guests}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span>{item.bedrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4" />
                <span>{item.bathrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{item.rating}</span>
                <span className="text-gray-400">({item.reviews})</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {item.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {item.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.amenities.length - 3}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  ${item.price}
                </span>
                <span className="text-gray-600 text-sm">/night</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            Added on {new Date(item.addedDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
