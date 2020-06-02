/**
 * person.repository.js
 * En esta clase expondremos los metodos de acceso a datos asociados a el modelo person.model
 */
const PersonModel = require('../models/person.model')
module.exports = class PersonRepository {
  /**
   *
   * @param {object} filter: puede contener una o mas propiedades del documento en MongoDB por el cual se desea buscar
   */
  async findOne(filter) {
    return await PersonModel.findOne(filter)
  }

  /**
   *
   * @param {object} person: contiene las propiedades del documento que se desea guardar,
   * deberia coincidir con la colección people, con excepción del al propiedad _id que la
   * establece MongoDb automaticamente
   * @param {*} upsert: si es true (valor por defecto) indica que si no existe se inserte.
   */
  async save(person, upsert = true) {
    const filter = { index: person.index }
    const options = { upsert: upsert }
    await PersonModel.updateOne(filter, person, options)
  }
}
