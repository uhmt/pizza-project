import express, { Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface Pedido {
    nombreCliente: string;
    numeroMesa: number;
    tipoPizza: string;
    cantidad: number;
    descripcion: string;
}

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurante';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(() => {
        console.log('Conexión a MongoDB establecida correctamente');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

const PedidoSchema = new mongoose.Schema({
    nombreCliente: { type: String, required: true },
    numeroMesa: { type: Number, required: true },
    tipoPizza: { type: String, required: true },
    cantidad: { type: Number, required: true },
    descripcion: { type: String, required: false },
});

const PedidoModel = mongoose.model<Pedido & mongoose.Document>('Pedido', PedidoSchema);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'site')));

app.post('/pedido', async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ mensaje: 'Ha ocurrido un error al procesar el pedido.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
