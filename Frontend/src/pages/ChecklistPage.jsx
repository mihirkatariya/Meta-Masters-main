import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaPlus, FaEdit, FaTrash, FaDotCircle, FaGripVertical, FaImage } from 'react-icons/fa';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChecklistSection from '../components/ChecklistSection';

// Extended sample data
const initialCategories = [
  {
    id: 1,
    name: '🧼 Hygiene',
    items: [
      { id: 101, name: 'Toothbrush', quantity: 1, status: 'packed', assignedTo: 'Sarah Wilson', notes: '', image: null },
      { id: 102, name: 'Shampoo', quantity: 1, status: 'pending', assignedTo: null, notes: 'Travel size', image: null },
      { id: 103, name: 'Sunscreen', quantity: 1, status: 'pending', assignedTo: 'Michael Brown', notes: 'SPF 50+', image: null },
    ]
  },
  {
    id: 2,
    name: '🔌 Tech',
    items: [
      { id: 201, name: 'Phone Charger', quantity: 2, status: 'packed', assignedTo: 'Sarah Wilson', notes: '', image: null },
      { id: 202, name: 'Camera', quantity: 1, status: 'pending', assignedTo: null, notes: 'With extra battery', image: null },
      { id: 203, name: 'Power Bank', quantity: 1, status: 'delivered', assignedTo: 'Michael Brown', notes: '', image: null },
    ]
  },
  {
    id: 3,
    name: '🍽️ Food',
    items: [
      { id: 301, name: 'Snacks', quantity: 5, status: 'pending', assignedTo: null, notes: 'Non-perishable', image: null },
      { id: 302, name: 'Water Bottles', quantity: 3, status: 'packed', assignedTo: 'Sarah Wilson', notes: '', image: null },
    ]
  }
];

function ChecklistPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(initialCategories[0].id);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    if (sourceIndex === destIndex) return;
    
    // Find the current category 
    const categoryIndex = categories.findIndex(c => c.id === activeCategory);
    if (categoryIndex === -1) return;
    
    const newCategories = [...categories];
    const items = [...newCategories[categoryIndex].items];
    
    // Reorder the items
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, removed);
    
    newCategories[categoryIndex].items = items;
    setCategories(newCategories);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      id: Date.now(),
      name: newCategoryName,
      items: []
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    setActiveCategory(newCategory.id);
  };

  const handleDeleteCategory = (categoryId) => {
    if (categories.length <= 1) {
      alert("You can't delete the only category. Please add another category first.");
      return;
    }
    
    const newCategories = categories.filter(c => c.id !== categoryId);
    setCategories(newCategories);
    
    // If we're deleting the active category, select another one
    if (activeCategory === categoryId) {
      setActiveCategory(newCategories[0].id);
    }
  };

  const toggleEditItem = (item = null) => {
    setEditingItem(item);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header eventName="Summer Camping Trip" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Packing Checklist</h1>
            
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="btn-primary flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Category
            </button>
          </div>
          
          {/* Category Tabs with Edit/Delete Options */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-l-md whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="ml-2 bg-white px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-700">
                    {category.items.length}
                  </span>
                </button>
                
                {activeCategory === category.id && (
                  <div className="flex bg-primary-100 rounded-r-md overflow-hidden">
                    <button 
                      onClick={() => { /* Edit category logic */ }} 
                      className="px-2 py-2 text-primary-700 hover:bg-primary-200"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)} 
                      className="px-2 py-2 text-red-500 hover:bg-primary-200"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Category Form */}
            {isAddingCategory && (
              <form onSubmit={handleAddCategory} className="flex items-center">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="px-4 py-2 border border-primary-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="px-3 py-2 bg-primary-500 text-white rounded-r-md hover:bg-primary-600"
                >
                  <FaPlus />
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="ml-2 px-3 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
          
          {/* Checklist with Drag and Drop */}
          <div className="bg-white rounded-lg shadow p-6">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {categories.find(c => c.id === activeCategory)?.name || 'Items'}
                </h2>
                
                <Droppable droppableId="items">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {categories.find(c => c.id === activeCategory)?.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-gray-50 rounded-lg p-3 flex items-center"
                            >
                              <div {...provided.dragHandleProps} className="mr-2 text-gray-400">
                                <FaGripVertical />
                              </div>
                              
                              <div className="flex-1 flex items-center">
                                <span className={`mr-3 flex-shrink-0 h-2 w-2 rounded-full ${
                                  item.status === 'packed' ? 'bg-green-500' : 
                                  item.status === 'delivered' ? 'bg-blue-500' : 
                                  'bg-yellow-500'
                                }`}></span>
                                <div>
                                  <div className="font-medium text-gray-800">{item.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.assignedTo ? `Assigned to: ${item.assignedTo}` : 'Unassigned'} · 
                                    Qty: {item.quantity}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {item.image && (
                                  <FaImage className="text-primary-500" />
                                )}
                                
                                <select
                                  value={item.status}
                                  onChange={(e) => { /* Update status logic */ }}
                                  className="text-sm rounded-full px-2 py-1 border-0"
                                  style={{
                                    backgroundColor: 
                                      item.status === 'packed' ? '#dcfce7' : 
                                      item.status === 'delivered' ? '#dbeafe' : 
                                      '#fef9c3',
                                    color: 
                                      item.status === 'packed' ? '#166534' : 
                                      item.status === 'delivered' ? '#1e40af' : 
                                      '#854d0e'
                                  }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="packed">Packed</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                                
                                <button 
                                  onClick={() => toggleEditItem(item)}
                                  className="text-primary-600 hover:text-primary-800 p-1"
                                >
                                  <FaEdit />
                                </button>
                                
                                <button 
                                  onClick={() => { /* Delete item logic */ }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
            
            {/* Add Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <form className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    className="input-field"
                    required
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="input-field"
                    required
                  />
                </div>
                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select className="input-field">
                    <option value="">Unassigned</option>
                    <option value="1">Sarah Wilson</option>
                    <option value="2">Michael Brown</option>
                    <option value="3">Emma Davis</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary h-10">
                  Add Item
                </button>
              </form>
            </div>
          </div>
          
          {/* Item Edit Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Item</h2>
                
                <form>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <input
                        type="text"
                        defaultValue={editingItem.name}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        defaultValue={editingItem.quantity}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select defaultValue={editingItem.status} className="input-field">
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                      <select defaultValue={editingItem.assignedTo || ""} className="input-field">
                        <option value="">Unassigned</option>
                        <option value="Sarah Wilson">Sarah Wilson</option>
                        <option value="Michael Brown">Michael Brown</option>
                        <option value="Emma Davis">Emma Davis</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        defaultValue={editingItem.notes}
                        className="input-field min-h-[80px]"
                        placeholder="Add any special notes or requirements"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:bg-primary-50 file:text-primary-700 file:border-0 file:font-medium hover:file:bg-primary-100"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleEditItem()}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ChecklistPage; 