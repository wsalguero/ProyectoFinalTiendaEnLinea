//Importacion
const { response, request } = require('express');
//Modelos
const Factura = require('../models/factura');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const obtenerFactura = async (req = request, res = response) => {
    try {
        const facturas = await Factura.find();
        
        res.status(200).json({
            msg: 'GET API de Facturas',
            facturas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const obtenerFacturaPorId = async (req = request, res = response) => {

    const { usuarioId } = req.params;

    const facturas = await Factura.find({ usuario: usuarioId }).populate('productos.producto');

    res.json(facturas);

}

const crearFactura = async (req = request, res = response) => {
  try {
    const factura = new Factura({
      usuario: req.body.usuario,
      productos: req.body.productos,
    });
    
    // Buscar los productos por sus IDs
    const productos = await Producto.find({
      _id: { $in: factura.productos.map(producto => producto.producto) }
    });

    const usuario = await Usuario.findById(factura.usuario);
    if (!usuario) {
      return res.status(400).json({ mensaje: 'El usuario no existe.' });
    }

    // Verificar si se encontraron todos los productos
    if (productos.length !== factura.productos.length) {
      return res.status(400).json({ mensaje: 'No se encontraron todos los productos.' });
    }

    // Asignar los productos encontrados a la factura y calcular el total
    let total = 0;
    factura.productos = factura.productos.map(producto => {
      const prod = productos.find(p => p._id.toString() === producto.producto.toString());
      total += producto.cantidad * prod.precio;
      return {
        producto: prod,
        cantidad: producto.cantidad,
        precio: prod.precio
      };
    });

    factura.total = total;

    // Guardar la nueva factura en la base de datos
    await factura.save();

    res.json(factura);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Hubo un error al crear la factura.' });
  }

  
}

const actualizarFactura = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const factura = await Factura.findById(id);

    if (!factura) {
      return res.status(404).json({ mensaje: 'La factura no existe.' });
    }

    factura.usuario = req.body.usuario;
    factura.productos = req.body.productos;

    const productos = await Producto.find({
      _id: { $in: factura.productos.map(producto => producto.producto) }
    });

    // Verificar si se encontraron todos los productos
    if (productos.length !== factura.productos.length) {
      return res.status(400).json({ mensaje: 'No se encontraron todos los productos.' });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(factura.usuario);
    if (!usuario) {
      return res.status(400).json({ mensaje: 'El usuario no existe.' });
    }

    // Verificar si los productos existen
    for (const producto of factura.productos) {
      const encontrado = productos.find(p => p._id.toString() === producto.producto.toString());
      if (!encontrado) {
        return res.status(400).json({ mensaje: `El producto ${producto.producto} no existe.` });
      }
    }

    // Asignar los productos encontrados a la factura
    factura.productos = factura.productos.map(producto => {
      const encontrado = productos.find(p => p._id.toString() === producto.producto.toString());
      return {
        producto: encontrado,
        cantidad: producto.cantidad,
        precio: encontrado.precio,
      };
    });

    // Calcular el total de la factura
    const total = factura.productos.reduce((sum, producto) => {
      return sum + producto.cantidad * producto.precio;
    }, 0);
    factura.total = total;

    // Guardar la factura actualizada en la base de datos
    await factura.save();

    res.json(factura);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Hubo un error al actualizar la factura.' });
  }
}

const obtenerFacturasPorUsuario = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    // Buscar las facturas por el ID del usuario
    const facturas = await Factura.find({ usuario: id });

    // Verificar si se encontraron facturas
    if (!facturas || facturas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron facturas para este usuario.' });
    }

    res.json(facturas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener las facturas del usuario.' });
  }
}


const eliminarFactura= async (req = request, res = response) => {

    const { id } = req.params;

    try {
        const facturaEliminada = await Factura.findByIdAndDelete(id);
        if (!facturaEliminada) {
          return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }
        res.json({ mensaje: 'Factura eliminada correctamente' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar la factura' });
      }

}



module.exports = {
    obtenerFacturasPorUsuario,
    obtenerFactura,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura
}