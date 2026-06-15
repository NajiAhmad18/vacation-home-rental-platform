import React, { useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import WishlistCard from '../../components/user/whislistCard.jsx';


const Wishlist = ({
  wishlist,
  onRemoveFromWishlist,
  onReorderWishlist,
  onBackToHomes
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newWishlist = [...wishlist];
    const draggedItem = newWishlist[draggedIndex];
    
    // Remove the dragged item
    newWishlist.splice(draggedIndex, 1);
    
    // Insert at new position
    newWishlist.splice(dropIndex, 0, draggedItem);
    
    // Update priorities
    const updatedWishlist = newWishlist.map((item, index) => ({
      ...item,
      priority: index + 1
    }));
    
    onReorderWishlist(updatedWishlist);
    setDraggedIndex(null);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBackToHomes}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Homes</span>
          </button>
        </div>
        
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Start browsing homes and add your favorites to your wishlist!
          </p>
          <button
            onClick={onBackToHomes}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200"
          >
            Browse Homes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToHomes}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Homes</span>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Wishlist</h2>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Drag and drop the cards to reorder your wishlist by priority. 
          Your most important properties should be at the top!
        </p>
      </div>
      
      <div className="space-y-4">
        {wishlist.map((item, index) => (
          <WishlistCard
            key={item.id}
            item={item}
            index={index}
            onRemove={onRemoveFromWishlist}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggedIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
