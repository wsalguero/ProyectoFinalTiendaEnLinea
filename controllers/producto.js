//Importacion
const { response, request } = require('express');
//Modelos
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');


const obtenerProductos = async (req = request, res = response) => {

    //Condición, me busca solo los categorias que tengan estado en true
    const query = { stock: true };
    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        
    ]);

    res.json({
        msg: 'GET API de Producto',
        listaProductos
    });


}

const obtenerProductosAgotados = async (req = request, res = response) => {

    //Condición, me busca solo los categorias que tengan estado en true
    const query = { stock: false };
    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        
    ]);

    res.json({
        msg: 'GET API de Producto',
        listaProductos
    });


}
const obtenerProductosMasVendidos = async (req = request, res = response) => {

    //Condición, me busca solo los categorias que tengan estado en true
    const query = { popular: true };
    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        
    ]);

    res.json({
        msg: 'GET API de Producto',
        listaProductos
    });


}

const obtenerProductoPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)

    res.json({
        msg: 'Producto por id',
        producto: producto
    });

}


const crearProducto = async (req = request, res = response) => {

    const { nombre, proveedor, categoria, cantidad, precio } = req.body;
    const productoDB = new Producto({ nombre, proveedor, categoria, cantidad, precio });

    //Validación para encontrar una categoria por nombre en la DB
    //Generar la data a guardar

    //Guardar en DB
    await productoDB.save();

    res.status(201).json({
        msg: 'Post de Producto',
        productoDB
    });

}



const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    //Ignoramos el _id, rol, estado y google al momento de editar y mandar la petición en el req.body
    const { _id, stock, ...resto } = req.body;


    //editar y guardar
    const productoEditado = await Producto.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de Prodcuto',
      productoEditado
    });

}


const eliminarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const productoEliminado = await Producto.findByIdAndUpdate(id, { stock: false });

    res.json({
        msg: 'delete Producto',
        productoEliminado
    });

}



module.exports = {
    obtenerProductosAgotados,
    obtenerProductosMasVendidos,
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}