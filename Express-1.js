const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

let vehicles = [];
let nextVehicleId = 1;

let users = [];

app.post('/vehicles', (req, res) => {
    const { modelo, marca, ano, cor, preco } = req.body;
    const id = nextVehicleId++;
    const vehicle = { id, modelo, marca, ano, cor, preco };
    vehicles.push(vehicle);
    res.status(201).json(vehicle);
});

app.get('/vehicles', (req, res) => {
    res.json(vehicles);
});

app.get('/vehicles/:marca', (req, res) => {
    const marca = req.params.marca;
    const filteredVehicles = vehicles.filter(vehicle => vehicle.marca === marca);
    res.json(filteredVehicles);
});

app.put('/vehicles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { cor, preco } = req.body;
    const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === id);
    if (vehicleIndex === -1) {
        res.status(404).send("Veículo não encontrado. O usuário deve voltar para o menu inicial depois");
    } else {
        vehicles[vehicleIndex].cor = cor;
        vehicles[vehicleIndex].preco = preco;
        res.send("Veículo atualizado com sucesso");
    }
});

app.delete('/vehicles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === id);
    if (vehicleIndex === -1) {
        res.status(404).send("Veículo não encontrado. O usuário deve voltar para o menu inicial depois");
    } else {
        vehicles.splice(vehicleIndex, 1);
        res.send("Veículo removido com sucesso");
    }
});

app.post('/users', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        res.status(400).send("Todos os campos devem ser preenchidos");
    } else {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const user = { nome, email, senha: hashedPassword };
        users.push(user);
        res.send("Usuário criado com sucesso");
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        res.status(400).send("Todos os campos devem ser preenchidos");
    } else {
        const user = users.find(user => user.email === email);
        if (!user) {
            res.status(401).send("Usuário não encontrado");
        } else {
            const passwordMatch = await bcrypt.compare(senha, user.senha);
            if (passwordMatch) {
                res.send("Login bem-sucedido");
            } else {
                res.status(401).send("Senha incorreta");
            }
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});