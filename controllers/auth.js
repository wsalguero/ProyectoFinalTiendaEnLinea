const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({
                msg: 'Correo de usuario no existe en la base de datos 404'
            });
        }

        //Si el usuario esta activo (usuario.estado === false)
        if (usuario.estado === false) {
            return res.status(400).json({
                msg: 'La cuenta del usuario esta inactivo'
            });
        }

        //Verificar la password el usuario    //comporeSync, encripta ambas passwords y las compara
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'La password es incorrecta'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login Auth Funciona!',
            correo, password,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }


}

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;
        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'Este correo electrónico ya está registrado' });
        }

        // Si el usuario no existe, lo creamos con el rol de "cliente"
        const nuevoUsuario = new Usuario({ nombre, correo, password, rol: 'CLIENTE_ROL' });

        const salt = bcryptjs.genSaltSync();
        nuevoUsuario.password = bcryptjs.hashSync(password, salt);
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Ocurrió un error al registrar el usuario' });
    }
};


module.exports = {
    login,
    registrarUsuario
}