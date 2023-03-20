
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const validarUsuarioProducto = async (req, res, next) => {
    // Obtener los ObjectIDs del usuario y el producto del cuerpo de la petición
    const { usuarioId, productoId } = req.body;
    
    // Buscar los registros que coinciden con los ObjectIDs de usuario y producto en cada modelo de MongoDB
    const usuario = await Usuario.findById(usuarioId);
    const producto = await Producto.findById(productoId);
    
    // Si se encontraron registros en ambos modelos, continuar con la operación POST, PUT o DELETE
    if (usuario && producto) {
      next();
    } else {
      //Validacion de producente en la base de Datos 
      res.status(404).json({ error: 'El usuario y/o producto no existen en la base de datos' });
    }
  };


  module.exports = {
    validarUsuarioProducto
  }