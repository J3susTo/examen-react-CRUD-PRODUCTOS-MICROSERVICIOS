import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const ProductList = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
    fetchProducts();
    }, []);

    const fetchProducts = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_PRODUCTOS}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
    } catch (err) {
        console.error('Error fetching products', err);
    }
    };

    const handleSearch = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_PRODUCTOS}/buscar?query=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
    } catch (err) {
        console.error('Error searching products', err);
    }
    };

    const handleCreate = () => {
    setCurrentProduct({});
    setIsEdit(false);
    setShowModal(true);
    };

    const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEdit(true);
    setShowModal(true);
    };

    const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
        try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL_PRODUCTOS}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
        } catch (err) {
        console.error('Error deleting product', err);
        }
    }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isEdit) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL_PRODUCTOS}/${currentProduct.id}`, currentProduct, {
            headers: { Authorization: `Bearer ${token}` }
        });
        } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL_PRODUCTOS}`, currentProduct, {
            headers: { Authorization: `Bearer ${token}` }
        });
        }
        setShowModal(false);
        fetchProducts();
    } catch (err) {
        console.error('Error saving product', err);
    }
    };

    const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
    };

    return (
    <div className="container mt-5">
        <h2 className="text-center mb-4">Gestión de Productos</h2>
        <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleCreate}>Crear Producto</Button>
        <div className="d-flex">
            <Form.Control type="text" placeholder="Buscar por nombre" value={search} onChange={(e) => setSearch(e.target.value)} className="me-2" />
            <Button variant="outline-secondary" onClick={handleSearch}>Buscar</Button>
        </div>
        </div>
        <table className="table table-hover">
        <thead className="table-dark">
            <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => (
            <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nombre}</td>
                <td>${product.precio}</td>
                <td>{product.categoria}</td>
                <td>{product.descripcion}</td>
                <td><img src={product.imagenUrl} alt="Producto" style={{width: '50px'}} /></td>
                <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(product)} className="me-2">Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>


        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>{isEdit ? 'Editar Producto' : 'Crear Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="nombre" value={currentProduct.nombre || ''} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" name="precio" value={currentProduct.precio || ''} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Control name="categoria" value={currentProduct.categoria || ''} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" name="descripcion" value={currentProduct.descripcion || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>URL Imagen</Form.Label>
                <Form.Control name="imagenUrl" value={currentProduct.imagenUrl || ''} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
                {isEdit ? 'Actualizar' : 'Crear'}
            </Button>
            </Form>
        </Modal.Body>
        </Modal>
    </div>
    );
};

export default ProductList;