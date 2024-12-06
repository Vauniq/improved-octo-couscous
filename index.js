import express from 'express';
import mongoose from 'mongoose';
import router from './router.js'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_URL = "mongodb://localhost:27017/Maistrishina";
const PORT = 8080;

const app = express();

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: DB_URL }),
    cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.use('/api', router);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Платформа для координації волонтерської допомоги * Landing Page' });
});

// index.js
app.get('/edit/:id', async (req, res) => {
    const documentId = req.params.id;
    try {
        const document = await YourModel.findById(documentId); // Замените YourModel на вашу модель
        if (!document) {
            return res.status(404).send('Document not found');
        }
        res.render('edit', { document, collectionName: 'yourCollectionName' }); // Передача необходимых данных
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.get('/collections', (req, res) => {
    res.render('collections', { title: 'Collections Page' });
});

app.get('/unit', (req, res) => {
    res.render('unit', { title: 'Unit Page' });
});

app.get('/unitCasual', (req, res) => {
    res.render('unitCasual', { title: 'Unit Casual Page' });
});

async function startApp() {
    try {
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();

export default DB_URL;

