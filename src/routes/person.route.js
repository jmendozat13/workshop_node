/**
 * person.route.js
 * Expone los puntos de entrada a traves de endpoints, es el encargado de recibir las solicitudes http que los usuarios o clientes del api nos envia.
 * puede contener diferentes rutas usando combinaciones de diferentes verbos http y parametros
 * por ejemplo:
 * router.get('person/byIndex', '/:index', controller.getByIndex) maneja la solicitudes desde person/99 donde 99 es el valor del parametro index
 */
const KoaRouter = require('koa-router')
const PersonController = require('../controllers/person.controller')
const router = new KoaRouter({ prefix: '/person' })
const controller = new PersonController()

// GET /person/29
router.get('person/byIndex', '/:index', controller.getByIndex)

// POST
router.post('person/post', '/', controller.save)

module.exports = router
