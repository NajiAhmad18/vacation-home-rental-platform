import React, { useState } from "react";
import { sampleHomes } from "../const/sampleWishlist.js";
import Wishlist from "../components/user/whislist.jsx";

function App() {
  // Initialize wishlist with all sampleHomes
  const [wishlist, setWishlist] = useState(
    sampleHomes.map((home, index) => ({
      ...home,
      priority: index + 1,
      addedDate: new Date().toISOString(),
    }))
  );

  const removeFromWishlist = (homeId) => {
    const newWishlist = wishlist
      .filter((item) => item.id !== homeId)
      .map((item, index) => ({ ...item, priority: index + 1 }));
    setWishlist(newWishlist);
  };

  const reorderWishlist = (newOrder) => {
    setWishlist(newOrder);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Wishlist
        wishlist={wishlist}
        onRemoveFromWishlist={removeFromWishlist}
        onReorderWishlist={reorderWishlist}
        onBackToHomes={() => {}}
      />
    </div>
  );
}

export default App;
