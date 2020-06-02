<h1 align="center">Workshop contruyendo una Api Rest con Node.js</h1>

<h2 align="center">
Episodio 1: Creando mi primera API rest en Node.js y MongoDB.
</h2>

## Tabla de Contenido

- [Tabla de Contenido](#tabla-de-contenido)
- [Objetivo General](#objetivo-general)
- [Objetivos Específicos](#objetivos-específicos)
  - [Como lo haremos:](#como-lo-haremos)
- [Pasos para implementar](#pasos-para-implementar)
- [Probemos nuestra Api](#probemos-nuestra-api)
- [Configuración de ESlint y Prettier](#configuración-de-eslint-y-prettier)
  - [EsLint](#eslint)
  - [Prettier](#prettier)

## Objetivo General

Implementar una api rest usando node.js y koa.js la cual nos permita crear o actualziar los datos de una persona en una base de datos en MongoDB. Asimismo, implementar una búsqueda simple.

## Objetivos Específicos

1. Crear la estuctura del proyecto.
2. Configuraciones iniciales.
3. Implementar un endpoint de búsqueda por el campo index que nos devuelva los datos de una única persona.
4. Implementar un endpoint que permita crear o actualizar los datos de una persona.
5. Configurar el uso de ESlint y Prettier.
6. Implementar un endpoint que permita buscar aquellas personas mediante varios parametros (al menos 3) por color de ojos (eyeColor), país (country), genero (gender). Puedes recibir los parametros via params, query string o body (post). Mejor si el resultado es paginado.

### Como lo haremos:

Comenzaremos estructurando nuestro proyecto, inicializando el proyecto con npm, descargando las librerias npm que usaremos. También inicializaremos el repositorio git, el cual nos permitira tener una rama por cada episodio, de esta manera nuestro proyeco puede ir evolucionando sin perder el trabajo que vayamos construtendo en cada episodio.

Asimismo, crearemos las carpetas y los archivos de código necesarios para poner a andar nuestra api.

Aunque puedes encontrar el proyecto es muy simple, esto tiene el proposito de ayudarte a comprender los pasos y la relación entre cada uno de los elemntos.

## Pasos para implementar

Bueno basta de tanta introducción ha llegado la hora de echar código :running:

1. Creemos la carpeta raíz de nuestro proyecto, sugiero algo como <kbd>api-rest-nodejs</kbd>
2. Abramos la carpeta con Visual Studio Code
3. Abre el terminal (puede ser de VS Code o el de tu preferencia pero debes dentro de la carpeta) e inicializa el nuevo proyecto npm, con el comando:

```bash
npm init -y
```

4. Instalemos las principales dependencias que usaremos (<kbd>koa</kbd> y algunas del su ecosistema, <kbd>mongoose</kbd> para conectarnos a MongoDB, <kbd>yenv</kbd> para manejar la configuarción en un yaml y <kbd>cross-env</kbd> para facilitar el manejo de la variable de entorno <kbd>NODE_ENV</kbd>), ejecuta el siguiente comando:

```bash
npm i koa koa-router koa-bodyparser koa-logger koa-json mongoose yenv cross-env
```

6. Instalemos <kbd>nodemon</kbd> para que escuche si cambiamos nuestro codigo y se reinicie nuestro servidor node, pero la instalaremos como _dependencia de desarrollo_ con el siguiente comando:

```bash
npm i --save-dev nodemon
```

7. Inicialicemos ahora un nuevo repositorio git para congelar el codigo de cada episodio, usando el comando:

```bash
git init
```

8. Ahora agreguemos el archivo _.gitignore_ necesario para no subir al repositorio archivos innecsarios como los modulos npm, apoyate en el pluging gitignore que instalamos en los requisitos. Abre la Paleta de Comandos (<kbd>control + shift + p</kbd>) y escribe <kbd>gitignore</kbd>, y selecciona <kbd>Add gitignore</kbd> y luego escribe <kbd>node</kbd> en el cuadro de texto.
9. Agreguemos el archivo _.editorconfig_. Abre de nuevo la Paleta de Comandos (<kbd>control + shift + p</kbd>) y escribe <kbd>editor</kbd> y selecciona la opción <kbd>Generate .editorconfig</kbd>. Este archivo nos permite especificar por ejemplo cuantos espacios tendran nuestros tabs para identar nuestro código.
10. Editemos el archivo <kbd>.editorconfig</kbd> y cambia el valor de <kbd>indent_size</kbd> a **2**
11. Ok, ahora creemos las carpetas que usaremos para estructurar nuestro proyecto:
12. Crea la carpeta <kbd>src</kbd> en la raiz del proyecto
13. Dentro de la carpeta _src_ creamos las siguientes carpetas vacias para ir estructurando nuestro proyecto:

- <kbd>models</kbd>
- <kbd>repositories</kbd>
- <kbd>controllers</kbd>
- <kbd>routes</kbd>

14. Dentro de la carpeta _models_ creamos <kbd>person.model.js</kbd> con el siguiente código:

```javascript
/**
 * person.model.js
 * Nos permite gestionar los datos de la colección people de MongoDB
 */
const mongoose = require('mongoose')
const schema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    eyeColor: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  {
    collection: 'people',
  },
)

const PersonModel = mongoose.model('PersonModel', schema)
module.exports = PersonModel
```

15. Dentro de la carpeta _repositories_ creamos <kbd>person.repository.js</kbd> con el siguiente código:

```javascript
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
```

16. Dentro de la carpeta _controllers_ creamos <kbd>person.controller.js</kbd> con el siguiente código:

```javascript
/**
 * person.controller.js
 * Responsable por recibir las solicitudes http desde el router person.route.js
 */
const PersonRepository = require('../repositories/person.repository')
const repository = new PersonRepository()

module.exports = class PersonController {
  /**
   *
   * @param {object} ctx: contexto de koa que contiene los parameteros de la solicitud, en este caso
   * desde el url de donde sacaremos el valor del parametro index (ctx.params.index)
   */
  async getByIndex(ctx) {
    const index = ctx.params.index && !isNaN(ctx.params.index) ? parseInt(ctx.params.index) : 0
    if (index > 0) {
      const filter = { index: index }
      const data = await repository.findOne(filter)
      if (data) {
        ctx.body = data
      } else {
        ctx.throw(404, `No se ha encontrado la persona con el indice ${index}`)
      }
    } else {
      ctx.throw(422, `Valor ${ctx.params.index} no soportado`)
    }
  }

  /**
   *
   * @param {object} ctx: contexto de koa que contiene los parameteros de la solicitud, en este caso desde el body,
   * obtendremos las propiedades de la persona a guardar a traves de ctx.request.body
   */
  async save(ctx) {
    const person = ctx.request.body
    await repository.save(person, true)
    ctx.body = person
  }
}
```

17. Dentro de la carpeta _routes_ creamos <kbd>person.route.js</kbd> con el siguiente código:

```javascript
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
```

18. Ahora necesitaos un par de archivos más para poner andar el proyecto :walking:, creamos el archivo <kbd>routes.js</kbd> dentro de _src_ con el siguiente codigo:

```javascript
/**
 * Expone una coleccion de todos los routes de nuestra api, a pesar de que aqui solo se se expone personRoute en la vida real debería exponer todos .
 */
const personRoute = require('./routes/person.route')
// aqui podria exponer todos los routes, por ejemplo module.exports = [personRoute, route2, route3, routen]
module.exports = [personRoute]
```

19. Ahora crearemos el archivo responsable por inicial la aplicación :zap:, creamos el archivo <kbd>server.js</kbd> dentro de _src_

```javascript
/**
 * server.js
 * Responsable por inciar nuestra api, inicializa koa con todos sus middleware y tambien inicialzia la conexión de bd
 */
const Koa = require('koa')
const json = require('koa-json')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const yenv = require('yenv')
const mongoose = require('mongoose')

const env = yenv()
const routes = require('./routes')

// Inicializar nuestro servidor usando koa (similar a express)
const app = new Koa()
// Inicializar los middleware
app.use(bodyParser()).use(json()).use(logger())

// cargar los routes que escucharan las peticiones http
routes.map((item) => {
  app.use(item.routes()).use(item.allowedMethods())
})
// abrir la conexión con MongoDB
mongoose
  .connect(env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    // iniciar el servidor koa para que empiece a escuchar peticiones
    app.listen(env.PORT, () => {
      console.log(`Escuchando en el puerto ${env.PORT}`)
    })
  })
  .catch((error) => {
    console.error(error)
  })
```

20. Agreguemos el archivo de configuración <kbd>env.yaml</kbd> a la raiz del proyecto, con el siguiente coódigo:

```yaml
development:
  PORT: 3000
  MONGODB_URL: 'mongodb+srv://tu-usuario:tu-contraseña@cluster0-8hxu4.mongodb.net/contacts?retryWrites=true&w=majority'
production:
  PORT: 3000
  MONGODB_URL: 'mmongodb+srv://tu-usuario:tu-contraseña@cluster0-8hxu4.mongodb.net/contacts?retryWrites=true&w=majority'
```

:speech_balloon: **Nota:** solicita el usuario y contraseña para que los reemplaces en el <kbd>env.yaml</kbd>.

21. Ahora agregaremos el nombre del archivo <kbd>env.yaml</kbd> al archivo <kbd>.gitignore</kbd>, esto es una mejor practica, ya que nunca debemos exponer credenciales o datos sensibles a repositorios publicos. Simplemente abre el archivo y agrega en una linea nueva _env.yaml_

## Probemos nuestra Api

Bien hasta aquí hemos implementado el código para construir nuestra api, pero y como :smiling_imp: puedo ponerla en marcha y probarla!!

1. Abrimos el archivo <kbd>package.json</kbd> que esta en la raiz y agrega dentro de la sección <kbd>scripts</kbd> la siguiente linea:

```json
"start": "cross-env NODE_ENV=development nodemon ./src/server.js",
```

2. Para iniciar nuestra aplicación ejecutamos el comando:

```bash
npm start
```

Si todo sale bien :v:

```bash
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./src/server.js`
(node:13568) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use
the new Server Discover and Monitoring engine, pass option
{ useUnifiedTopology: true } to the MongoClient constructor.
Escuchando en el puerto 3000
```

:speech_balloon: **Nota**: Recordemos que hemos implementado dentro de person.route un GET para buscar una persona por el index y un POST que nos permite crear o actualizar los datos de una persona.

3. Para probar nuetros _GET_ abre por el browser o por postman el siguiente link

```
http://localhost:3000/person/29
```

4. Si hicimos todo bien, entonces veremos un json con los datos de la persona buscada:

```json
{
  "_id": "5dc88091ffc42b829564b160",
  "index": 29,
  "age": 36,
  "eyeColor": "green",
  "name": "Beach Rutledge",
  "gender": "male",
  "company": "URBANSHEE",
  "country": "PE",
  "email": "beachrutledge@urbanshee.com",
  "phone": "+1 (900) 521-2063",
  "address": "921 Karweg Place, Connerton, Arkansas, 3696"
}
```

5. Para probar el _POST_, debemos acceder por <kbd>Postman</kbd>, selecciona en la lista de verbos <kbd>POST</kbd>.

6. Selecciona <kbd>Body</kbd>, luego la opción <kbd>raw</kbd> y luego en la lista de la derecha seleciona <kbd>JSON</kbd>, pega el siguiente codigo:

```json
{
  "index": 1001,
  "age": 36,
  "eyeColor": "green",
  "name": "Beach Rutledge",
  "gender": "male",
  "company": "URBANSHEE",
  "country": "PE",
  "email": "beachrutledge@urbanshee.com",
  "phone": "+1 (900) 521-2063",
  "address": "921 Karweg Place, Connerton, Arkansas, 3696"
}
```

:speech_balloon: **Nota**: si ya existe una persona con index usado entonce se actualizaran los datos, de lo contrario se creará, aqui puedes probar con diferentes valores.

## Configuración de ESlint y Prettier

### EsLint

1. Instalemos <kbd>eslint</kbd> como dependencia de desarrollo:

```bash
npm i --save-dev eslint
```

2. Inicialicemos eslint con el siguiente comando:

```bash
npx eslint --init
```

:speech_balloon: **Nota:**
_npx_ nos permite ejecutar scripts de paquetes que se encuentra dentro del proyecto (carpeta _node_modules_) la cual es donde se instalan las librerias que instalemos con npm i o npm install.

3. Cuando ejecutamos el comando anterior, se nos presenta una serie de preguntas que debemos elegir, para efectos de este demos, seleccionar los siguiente:

- To check syntax, find problems, and enforce code style
- CommonJs
- Node of these
- Does your project use TypeScript (N)
- Desmarcar Browser () y marcar Node (x)
- Use a popular style guide
- Estilo: (Standart)
- (Formato del archivo de configuración) (YAML)
- Instalar dependencias necesarass (Y)

### Prettier

Recuerda haber instalado el plugin de prettier (mencionado en los requisitos)

4. Instalamos <kbd>Prettier</kbd> como dependencia de desarrollo:

```bash
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

5. Creemos el archivo <kbd>.prettierrc.js</kbd> en la raiz del proyecto y lo editamos con el siguiente codigo:

```javascript
module.exports = {
  endOfLine: 'lf',
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  endOfLine: 'auto',
}
```

6. Editemos el archivo de configuración de eslint <kbd>.eslintrc.yml</kbd> para que tenga los plugins y las extensiones de prettier, reemplaza el contenido por:

```yaml
env:
  commonjs: true
  es6: true
  node: true
extends:
  - standard
  - eslint:recommended
  - prettier
  - plugin:prettier/recommended
globals:
  Atomics: readonly
  SharedArrayBuffer: readonly
parserOptions:
  ecmaVersion: 11
  sourceType: module
plugins:
  - prettier
rules: {}
```

7. Edita el archivo <kbd>package.json</kbd> y agrega las siguientes lineas a la sección <kbd>scripts</kbd>, las cuales nos permitiran ejecutar la comprobación si nuestro codigo cumple con los estandares y reglas de eslint:

```json
"lint:show": "eslint src/ -f stylish",
"lint:fix": "eslint --fix --ext .js .",
```

8. Revisemos si tenemos errores que no satisfagan las reglas de eslint, ejecutemos el comando:

```bash
npm run lint:show
```

:speech_balloon: **Nota**: si tenemos errores se mostraran como resultado en la consola, donde se nos indicaran el archivo y la linea.

8. Si tenemos errores, intentemos arreglarlos automaticamente ejecutando el script:

```bash
npm run lint:fix
```

9. Vuelve a ejecutar el comando: <kbd>npm run lint:show</kbd> y veras que no tienes errores o bajo la cantidad
10. Probemos nuestro código de nuevo: ejecuta <kbd>npm start</kbd> y accede por postman o el browser a http://localhost:3000/person/29
