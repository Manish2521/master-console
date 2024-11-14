import React, { useState } from 'react';

const Card = () => {
  // Define an array of card data
  const cardData = [
    { StoreName: "Power House", address: "Delhi" },
    { StoreName: "Combat", address: "Bihar" },
    { StoreName: "Gill Gym", address: "Patna" }
  ];

  // State to manage the visibility of the confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // Function to handle the shutdown button click
  const handleShutdownClick = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedStore(null);
  };

  // Function to confirm shutdown
  const confirmShutdown = () => {
    console.log(`Store ${selectedStore.StoreName} has been shut down.`);
    closeModal();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white p-4 space-y-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="relative flex flex-col items-start justify-between p-8 bg-gray-900 text-center rounded-2xl shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[60%]"
        >
          {/* Shutdown Store button in top right */}
          <button
            type="button"
            className="absolute top-4 right-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
            onClick={() => handleShutdownClick(card)}
          >
            Shutdown Store
          </button>

          <h2 className="text-3xl font-bold text-white mb-4">{card.StoreName}</h2>
          <p className="text-lg text-white mb-6">{card.address}</p>
          <p className="text-lg text-white mb-6">Type - {card.address}</p>

          {/* Buttons in one line */}
          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Visit Store
            </button>
            <button
              type="button"
              className="focus:outline-none text-white bg-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium  dark:focus:ring-yellow-900 rounded-lg text-sm px-5 py-2.5"
            >
              Admin Panel
            </button>
          </div>
        </div>
      ))}

      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to shutdown this store "{selectedStore?.StoreName}" ?</h3>
            <div className="flex justify-between">
              <button
                onClick={confirmShutdown}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Yes, Shutdown
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
