const { Schema, model } = require('mongoose');
const Categoria = require('../models/categoria');

const ProductoSchema = Schema({
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio']
    },
    proveedor: {
      type: String,
      required: [true, 'El proveedor es obligatorio']
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      default: '640ba34156b44ff10607353f'
    },
    stock: {
      type: Boolean,
      default: true
    },
    popular: {
      type: Boolean,
      default: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio']
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria']
    }
  });

module.exports = model('Producto', ProductoSchema)