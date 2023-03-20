//Importacion
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

//Modelos
const Usuario = require('../models/usuario');


const getUsuarios = async (req = request, res = response) => {

    //Condición, me busca solo los usuarios que tengan estado en true
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'GET API de usuarios',
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuarioDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuarioDB.password = bcryptjs.hashSync(password, salt);

    //Guardar en Base de datos
    await usuarioDB.save();

    res.status(201).json({
        msg: 'POST API de usuario',
        usuarioDB
    });

}

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;

    //Ignoramos el _id, rol, estado y google al momento de editar y mandar la petición en el req.body
    const { _id, rol, estado, ...resto } = req.body;

    // //Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);

    //editar y guardar
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de usuario',
        usuarioEditado
    });

}


const deleteUsuario = async (req, res) => {
  const id = req.params.id;
  const uid = req.uid; // id del usuario que hace la petición

  try {
    // Buscamos el usuario que se quiere borrar
    const usuarioDB = await Usuario.findById(id);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }

    // Si el usuario que hace la petición es cliente
    if (req.rol === "CLIENTE_ROL") {   //CLIENTE_ROL
      // Solo puede borrar su propio usuario
      if (uid !== id) {
        return res.status(403).json({
          ok: false,
          msg: "No tiene privilegios para borrar este usuario",
        });
      }
    }
    // Si el usuario que hace la petición es admin
    else if (req.rol === "ADMIN_ROL") {
      // Si el usuario que se quiere borrar es un admin
      if (usuarioDB.rol === "ADMIN_ROL") {
        // Solo puede ser borrado por otro admin
        if (uid !== id) {
          return res.status(403).json({
            ok: false,
            msg: "No tiene privilegios para borrar este usuario",
          });
        }
      }
    }

  

    // No podemos Eliminar Usuario Admin 
    await Usuario.findByIdAndDelete(id);

    res.json({
      ok: false,
      msg: "Admin No puede Eliminar a otro admin",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar el usuario",
    });
  }
};





module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}