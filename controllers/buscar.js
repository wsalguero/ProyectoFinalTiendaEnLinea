const { request, response } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/usuario');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];


const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( usuario ) ? [ usuario ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or: [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
    });

    res.json({
        results: usuarios
    })

}


const buscarProducto = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( producto ) ? [ producto ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const producto = await Producto.find({
        $or: [ { nombre: regex }, { proveedor: regex } ],
        $and: [ { stock: true } ]
    });

    res.json({
        results: producto
    })

}

const buscarCategoria = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( categoria ) ? [ categoria ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const categoria = await Categoria.find({
        $or: [ { nombre: regex } ],
        $and: [ { estado: true } ]
    });

    res.json({
        results: categoria
    })

}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
           buscarCategoria(termino, res);
        break;
        case 'productos':
            buscarProducto(termino,res);
        break;
        default:
            res.status(500).json({
                msg: 'Busqueda No realizada'
            });
        break;
    }

}
 ////Nuevos Metodos de Busqueda 

module.exports = {
    buscar
}