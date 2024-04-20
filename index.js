import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { services } from './services.data.js';

const app = express();
const __dirname = import.meta.dirname;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/assets/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', engine());
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/services', (req, res) => {
    res.render('services', { services });
});

app.get('/services/:service', (req, res) => {
    const { service } = req.params;
    const selectedService = services.find(serv => serv.url === `/services/${service}`);

    if (!selectedService) {
        res.status(404).render('404');
        return;
    }

    res.render('service', { service: selectedService });
});

// Ruta 404
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});