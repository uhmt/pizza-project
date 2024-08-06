"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurante';
mongoose_1.default.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('Conexión a MongoDB establecida correctamente');
})
    .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});
const PedidoSchema = new mongoose_1.default.Schema({
    nombreCliente: { type: String, required: true },
    numeroMesa: { type: Number, required: true },
    tipoPizza: { type: String, required: true },
    cantidad: { type: Number, required: true },
    descripcion: { type: String, required: false },
});
const PedidoModel = mongoose_1.default.model('Pedido', PedidoSchema);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta 'site'
app.use(express_1.default.static(path_1.default.join(__dirname, 'site')));
app.post('/pedido', async (req, res) => {
    try {
        const { nombreCliente, numeroMesa, tipoPizza, cantidad, descripcion } = req.body;
        const nuevoPedido = new PedidoModel({
            nombreCliente,
            numeroMesa,
            tipoPizza,
            cantidad,
            descripcion,
        });
        await nuevoPedido.save();
        res.status(201).json({ mensaje: 'Pedido recibido y guardado correctamente.' });
    }
    catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ mensaje: 'Ha ocurrido un error al procesar el pedido.' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
