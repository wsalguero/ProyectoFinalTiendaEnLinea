const { Schema, model } = require('mongoose');
const facturaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del usuario es obligatorio']
    },
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
           required: [true, 'el id  es obligatorio']
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad  es obligatoria'],
            default: 1
        },
        precio: {
            type: Number,
            required: [true, 'El precio  obligatorio']
        }
    }],
    fecha: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = model('Factura', facturaSchema);