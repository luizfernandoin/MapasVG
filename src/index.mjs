import express from 'express';
import cors from 'cors';
import path from 'path';
import router from './routes/main.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(router);


app.use(express.static(path.join(process.cwd(), 'src/public')));

app.get('/', (request, response) => {
    response.sendFile(path.join(process.cwd(), 'src/public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});