//Importacion
const { response, request } = require('express');
//Modelos
const Factura = require('../models/factura');
const Prodcuto = require('../models/producto');
const Carrito = require('../models/carrito')



 const crearCarrito = async (req, res) => {
    try {
      const carrito = new Carrito(req.body);
      await carrito.save();
      res.status(201).send(carrito);
    } catch (error) {
      res.status(400).send(error);
    }
  };


  const crearCompra =  async (req, res) => {
    try {
      // Busca el carrito en la base de datos
      const carrito = await Carrito.findById(req.body.carrito_id).populate('productos.producto');
  
      // Calcula el precio total de todos los productos en el carrito
      let total = 0;
      for (const item of carrito.productos) {
        total += item.producto.precio * item.cantidad;
      }
  
      // Crea la factura en la base de datos
      const factura = new Factura({
        usuario: carrito.usuario,
        productos: carrito.productos,
        total: total
      });
      await factura.save();
  
      // Devuelve la respuesta HTTP con el objeto de la factura generada
      res.status(201).send(factura);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  

  const editarCarrito = async (req, res) => {
    const { id } = req.params;
    const { productos, total } = req.body;
  
    try {
      const facturaActualizada = await Factura.findOneAndUpdate(
        { _id: id },
        { productos, total },
        { new: true } // Para que devuelva la factura actualizada en lugar de la antigua
      );
  
      res.status(200).json(facturaActualizada);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la factura' });
    }
  };

  const eliminarCarrito = async (req, res) => {
    const { id } = req.params;
  
    try {
      const facturaEliminada = await Factura.findOneAndDelete({ _id: id });
  
      if (!facturaEliminada) {
        return res.status(404).json({ message: 'Factura no encontrada' });
      }
  
      res.status(200).json({ message: 'Factura eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la factura' });
    }
  };

module.exports = {
    crearCarrito,
    crearCompra,
    editarCarrito,
    eliminarCarrito
}