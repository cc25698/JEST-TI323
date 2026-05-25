// ponto de declaração das API´s

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// fazemos uma entrada para ver se o servidor está no AR
app.get('/health', (req, res) => { 
    res.json(
        { 
            status: 'ok',
            timestamp: new Date().toISOString()
        }
    );
});

app.post('/api/calcular', (req, res) => {
    try {
        const { calcularArea, calcularPerimetro } = require('./services/calculo');
        const dados = req.body;

        if (!dados || typeof dados !== 'object') {
            return res.status(400).json({ error: 'Dados de entrada inválidos' });
        }

        const altura = parseFloat(dados.altura);
        const largura = parseFloat(dados.largura);

        if (isNaN(altura) || altura <= 0) {
            return res.status(400).json({ error: 'Altura deve ser maior que zero' });
        }
        if (isNaN(largura) || largura <= 0) {
            return res.status(400).json({ error: 'Largura deve ser maior que zero' });
        }

        const area = calcularArea(altura, largura);

        res.json({ success: true, data: area }); // ✅ typo corrigido

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = app;
