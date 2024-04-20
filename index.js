import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';

import { services } from './data/services.data.js';

const app = express();
const __dirname = import.meta.dirname;


// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use('/assets/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/assets/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/services', (req, res) => {
    res.render('services', { services });
});

app.get('/services/:service', (req, res) => {
    const { service } = req.params;
    const serviceData = services.find(item => item.url === `/services/${service}`);

    if (!serviceData) {
        return res.status(404).render('404', { title: 'Service Not Found' });
    }

    res.render('service', { service: serviceData });
});

app.use('*', (req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
