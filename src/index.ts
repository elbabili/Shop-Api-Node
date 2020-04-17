import "reflect-metadata";
import {createKoaServer} from 'routing-controllers';
import {ProductController} from "./web/ProductController";
import {CategoryController} from "./web/CategoryController";
import {OrderController} from "./web/OrderController";

var cors = require('kcors');

const app = createKoaServer({
    controllers: [ProductController,CategoryController,OrderController] // we specify controllers we want to use
});
 
app.use(cors());

const port = process.env.PORT || 3000;

app.listen(port);

//ToDo ajouter des insertions de catégories et produits automatisés
