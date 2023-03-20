const { Router } = require('express');
const { check } = require('express-validator');
const { crearCarrito, crearCompra } = require('../controllers/carrito');



// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/agregarCarrito', [
    validarJWT,
    validarCampos],
    crearCarrito)

router.post('/Comprar', [

    validarJWT,

    validarCampos
],crearCompra ); 


router.put('/editar/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    validarCampos,
    validarJWT
]);

//////////////////////////////

router.delete('/eliminar/:id',
    validarJWT
);

module.exports = router;