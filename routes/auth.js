const { Router } = require('express');
const { check } = require('express-validator');
const { login, registrarUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos
] ,login);


router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos
] ,registrarUsuario);

module.exports = router;