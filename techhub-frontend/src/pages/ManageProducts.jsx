import { useState } from "react";
import { Link } from "react-router-dom";

import { useInventory } from "../context/InventoryContext";

const API = "http://localhost:8080";

const CATEGORIES = [
  "Office Laptop",
  "Gaming Laptop",
  "PC",
  "Custom PC",
  "Components",
  "Accessories",
];

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  category: CATEGORIES[0],
  brand: "",
  image: "",
  description: "",
  specs: "",
};

function ManageProducts() {

  const { inventory, loading, refreshInventory } = useInventory();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("techhub-token");

  const categoryOptions = [
    ...new Set([...CATEGORIES, form.category]),
  ];

  const visibleProducts = inventory.filter((product) => {
    const text = search.toLowerCase().trim();

    return (
      product.name.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text) ||
      (product.brand || "").toLowerCase().includes(text)
    );
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (product) => {

    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      brand: product.brand || "",
      image: product.image || "",
      description: product.description || "",
      // specs are stored with "|" and edited one per line
      specs: (product.specs || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .join("\n"),
    });

    setEditingId(product.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Upload a picture from the computer
  const handleUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(
        `${API}/api/products/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Could not upload the image.");
        return;
      }

      setForm((current) => ({
        ...current,
        image: data.url,
      }));

      alert("Image uploaded. Now save the product.");

    } catch (error) {
      console.error(error);
      alert("Could not upload the image. Is the backend running?");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a whole number, 0 or more.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price,
      stock,
      category: form.category,
      brand: form.brand.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      specs: form.specs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("|"),
    };

    setSaving(true);

    try {
      const response = await fetch(
        editingId
          ? `${API}/api/products/${editingId}`
          : `${API}/api/products`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        alert("Could not save the product. Check the details.");
        return;
      }

      alert(
        editingId
          ? "Product updated."
          : "Product added."
      );

      resetForm();
      refreshInventory();

    } catch (error) {
      console.error(error);
      alert("Could not save the product. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {

    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Could not delete the product.");
        return;
      }

      if (editingId === product.id) {
        resetForm();
      }

      alert("Product deleted.");
      refreshInventory();

    } catch (error) {
      console.error(error);
      alert("Could not delete the product. Is the backend running?");
    }
  };

  return (
    <main className="page manage-products-page">

      <section className="page-header">
        <span>EMPLOYEE</span>
        <h1>Manage Products</h1>
        <p>Add, edit and remove products and their pictures.</p>
      </section>

      <Link to="/dashboard" className="back-products">
        ← Back to Dashboard
      </Link>

      <section className="manage-form-card">

        <h2>
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="checkout-grid">

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                step="any"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Picture</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading && <small>Uploading...</small>}
            </div>

          </div>

          <div className="form-group">
            <label>
              Image link or path (filled automatically after upload)
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://... or /images/products/name.jpg"
            />
          </div>

          {form.image && (
            <img
              className="manage-preview"
              src={form.image}
              alt="Product preview"
            />
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Specifications (one per line)</label>
            <textarea
              name="specs"
              rows="4"
              value={form.specs}
              onChange={handleChange}
              placeholder={"16GB RAM\n512GB SSD\n15.6-inch display"}
            />
          </div>

          <div className="profile-buttons">

            <button
              type="submit"
              className="checkout-btn"
              disabled={saving || uploading}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="compare-clear"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}

          </div>

        </form>

      </section>

      <section className="manage-list-card">

        <div className="manage-list-top">

          <h2>All Products ({inventory.length})</h2>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="manage-table-wrap">

            <table className="manage-table">

              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>

                    <td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        "📦"
                      )}
                    </td>

                    <td>{product.name}</td>

                    <td>{product.category}</td>

                    <td>
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    <td
                      className={
                        product.stock <= 5 ? "stock-low-cell" : ""
                      }
                    >
                      {product.stock}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="manage-edit"
                        onClick={() => startEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="cancel-order-btn"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}

export default ManageProducts;
