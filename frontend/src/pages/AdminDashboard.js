import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Footer from '../components/Footer';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('view-products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    newName: '',
    description: '',
    brand: '',
    price: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    if (activeSection === 'view-products') fetchProducts();
    if (activeSection === 'access-users') {
      fetchUsers();
      fetchAllOrders();
    }
  }, [activeSection]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/v1/products/getproducts');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await api.get('/orders/admin'); // assumes this returns all orders
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchUserOrders = async (userId, username) => {
    try {
      const res = await api.get(`/orders/admin/user/${userId}`);
      setSelectedUser(username);
      setSelectedUserOrders(res.data);
      setActiveSection('user-orders');
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.post(`/orders/${orderId}/status`, { status });
      alert('Order status updated');
      const user = users.find(u => u.name === selectedUser);
      if (user) fetchUserOrders(user.id, user.name);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('brand', formData.brand);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      await api.post('/v1/products/addproduct', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product added successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('newName', formData.newName);
    data.append('description', formData.description);
    data.append('brand', formData.brand);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (formData.image) data.append('image', formData.image);

    try {
      await api.put('/v1/products/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (name) => {
    try {
      await api.delete('/v1/products/delete', { params: { name } });
      alert(`Deleted product: ${name}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const groupByCategory = (items) => {
    return items.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'add-product':
        return (
          <div>
            <h3>Add Product</h3>
            <form onSubmit={handleAddProduct} style={formStyle}>
              <input name="name" placeholder="Product Name" required onChange={handleChange} />
              <textarea name="description" placeholder="Description" onChange={handleChange} />
              <input name="brand" placeholder="Brand" required onChange={handleChange} />
              <input name="price" type="number" placeholder="Price" required onChange={handleChange} />
              <input name="category" placeholder="Category" required onChange={handleChange} />
              <input name="image" type="file" accept="image/*" onChange={handleChange} />
              <button type="submit">Add Product</button>
            </form>
          </div>
        );

      case 'view-products':
        const grouped = groupByCategory(products);
        return (
          <div>
            <h3>All Products</h3>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h4>{category}</h4>
                <div style={productGrid}>
                  {items.map((product) => (
                    <div key={product.id} style={productCard}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }}
                        onError={(e) => (e.target.src = '/placeholder.png')}
                      />
                      <h4>{product.name}</h4>
                      <p><strong>Brand:</strong> {product.brand}</p>
                      <p><strong>Price:</strong> ₹{product.price}</p>
                      <p><strong>Description:</strong> {product.description}</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => {
                            setFormData({
                              name: product.name,
                              newName: product.name,
                              description: product.description || '',
                              brand: product.brand || '',
                              price: product.price || '',
                              category: product.category || '',
                              image: null,
                            });
                            setActiveSection('update-product');
                          }}
                          style={actionButton}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.name)}
                          style={{ ...actionButton, backgroundColor: '#ff3f6c' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'update-product':
        return (
          <div>
            <h3>Update Product</h3>
            <form onSubmit={handleUpdateProduct} style={formStyle}>
              <input name="name" placeholder="Current Product Name" value={formData.name} onChange={handleChange} required />
              <input name="newName" placeholder="New Product Name" value={formData.newName} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
              <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
              <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
              <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
              <input name="image" type="file" accept="image/*" onChange={handleChange} />
              <button type="submit">Update Product</button>
            </form>
          </div>
        );

      case 'access-users':
        const start = (currentPage - 1) * usersPerPage;
        const paginatedUsers = users.slice(start, start + usersPerPage);
        return (
          <div>
            <h3>Users</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Username</th>
                  <th style={tableHeader}>Email</th>
                  <th style={tableHeader}>Orders</th>
                  <th style={tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={tableCell}>{user.name}</td>
                    <td style={tableCell}>{user.email}</td>
                    <td style={tableCell}>
                      {
                        orders.filter(order => order.userId === user.id).length
                      }
                    </td>

                    <td style={tableCell}>
                      <button
                        onClick={() => fetchUserOrders(user.id, user.name)}
                        style={actionButton}
                      >
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    backgroundColor: currentPage === index + 1 ? '#ff3f6c' : '#f0f0f0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        );

      case 'user-orders':
        return (
          <div>
            <h3>{selectedUser} User Orders</h3>
            {selectedUserOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              selectedUserOrders.map((order) => (
                <div key={order.id} style={orderCard}>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <div>
                    <label>Update Status: </label>
                    <select
                      defaultValue={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <hr />
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Main content: sidebar + content */}
    <div style={{ display: 'flex', flex: 1 }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Admin Panel</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {['view-products', 'add-product', 'update-product', 'access-users', 'user-orders'].map((section) => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                style={getButtonStyle(activeSection === section)}
              >
                {section.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>
    </div>

    {/* Footer aligned to bottom */}
    <div style={{ marginTop: 'auto',padding: '20px' }}>
      <Footer />
    </div>
  </div>
);
}

// Styles
const sidebarStyle = {
  width: '250px',
  backgroundColor: '#f5f5f5',
  padding: '20px',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
};

const getButtonStyle = (isActive) => ({
  width: '100%',
  padding: '10px',
  textAlign: 'left',
  background: isActive ? '#ff3f6c' : 'none',
  color: isActive ? '#fff' : '#333',
  border: 'none',
  cursor: 'pointer',
  marginBottom: '5px',
  fontWeight: isActive ? 'bold' : 'normal',
  borderRadius: '4px',
});

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '500px',
};

const productGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px',
  marginTop: '10px',
};

const productCard = {
  border: '1px solid #ccc',
  padding: '15px',
  borderRadius: '8px',
  background: '#fff',
};

const actionButton = {
  padding: '6px 12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const tableHeader = {
  padding: '10px',
  borderBottom: '2px solid #ddd',
  textAlign: 'left',
};

const tableCell = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const orderCard = {
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '10px',
};

export default AdminDashboard;
