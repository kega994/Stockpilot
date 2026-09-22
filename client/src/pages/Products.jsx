import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getBrands } from "../services/brandService";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10;

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Fetch brands
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error loading brands:", error);
        setError("Failed to fetch brands. Please try again later.");
      }
    };

    loadBrands();
  }, []);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      }
    };

    loadCategories();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, brandFilter]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const sku = product.sku.toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      name.includes(search) || sku.includes(search);

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    const matchesBrand =
      brandFilter === "" || product.brand === brandFilter;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  // Keep current page valid after products are deleted
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1 && totalPages > 0) {
      setCurrentPage(1);
    }     
  }, [totalPages]);

  // Loading page while products are being fetched
  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Delete product
  const deleteAProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setDeleteError(null);

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteError("Failed to delete product. Please try again later.");
    } finally {
      setDeletingId(null);
    }
  };

  // Search products
  const handleSearch = (e) => {
    e.preventDefault();
    setDeleteError(null);
    setSearchQuery(searchTerm);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCategoryFilter("");
    setBrandFilter("");
    setCurrentPage(1);
    setDeleteError(null);
  };

  return (
    <>
      {deleteError && <div>{deleteError}</div>}

      <form onSubmit={handleSearch}>
        <input
          placeholder="Search products..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      <button onClick={clearSearch}>Clear</button>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
      >
        <option value="">All Brands</option>

        {brands.map((brand) => (
          <option key={brand.id} value={brand.name}>
            {brand.name}
          </option>
        ))}
      </select>

      <button onClick={() => navigate("/products/add")}>
        Add Product
      </button>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td><button onClick={() => navigate(`/products/${product.id}`)}>{product.name}</button></td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/products/edit/${product.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAProduct(product.id)}
                  disabled={deletingId !== null}
                >
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 ? (
            <tr>
              <td colSpan="7">No products available.</td>
            </tr>
          ) : filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="7">No results found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <p>
        Page {currentPage} of {totalPages}
      </p>

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </>
  );
}

export default Products;