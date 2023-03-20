const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Producto = require('../models/producto');
const Factura = require('../models/factura');
const { model } = require('mongoose');

//Validamos en contro de la db si ese correo ya existe
const emailExiste = async( correo = '' ) => {
    //Verficar si el correo existe
    const existeEmailDeUsuario = await Usuario.findOne( { correo } );
    if ( existeEmailDeUsuario) {
        throw new Error(`El correo ${ correo }, ya esta registrado en la DB `);
    }
}

const esRoleValido = async( rol = '') => {
    //Verificar si el rol es valido y existe en la DB
    const existeRolDB = await Role.findOne( { rol } );
    if ( !existeRolDB ) {
        throw new Error(`El rol ${ rol }, no existe en la DB `);
    }
}


const existeUsuarioPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfUser = await Usuario.findById( id );
    if ( !existIdOfUser ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeCategoriaPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfCategory = await Categoria.findById( id );
    if ( !existIdOfCategory ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeProductoPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfProduct = await Producto.findById( id );
    if ( !existIdOfProduct ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeFacturaPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfFacture = await Factura.findById( id );
    if ( !existIdOfFacture ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const validarStock = async (req, res, next) => {
    const { id} = req.body;
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    if (!producto.stock) {
      return res.status(400).json({ message: 'El producto está agotado' });
    }
    next();
  };
  

module.exports = {
    validarStock,
    emailExiste,
    esRoleValido,
    existeFacturaPorId,
    existeProductoPorId,
    existeUsuarioPorId,
    existeCategoriaPorId
}