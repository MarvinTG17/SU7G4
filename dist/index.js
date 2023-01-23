"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
// primera ruta
app.get('/', (req, res) => {
    res.send('HOLA!!');
});
// crear Usuarios
app.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, date_born } = req.body;
    const passwordHash = yield bcryptjs_1.default.hash(password, 10);
    const result = yield prisma.usuarios.create({
        data: {
            name: name,
            email: email,
            password: passwordHash,
            date_born: date_born,
        },
    });
    // Retorna la informacion
    res.json(result);
}));
// crear Playlist
app.post("/playlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, useremail } = req.body;
    const result = yield prisma.playlist.create({
        data: {
            name: name,
            user: { connect: { email: useremail } },
        },
    });
    res.json(result);
}));
// crear canciones
app.post("/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genre, duration, nameplaylist } = req.body;
    const result = yield prisma.song.create({
        data: {
            name: name,
            artist: artist,
            album: album,
            year: year,
            genre: genre,
            duration: duration,
            playlist: { connect: { name: nameplaylist } },
        },
    });
    res.json(result);
}));
exports.create_song = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genre, duration, namePlaylist } = req.body;
    const result = yield prisma.song.create({
        data: {
            name: name,
            artist: artist,
            album: album,
            year: year,
            genre: genre,
            duration: duration,
            playlist: { connect: { name: namePlaylist } },
        },
    });
    return res.json(result);
});
// la funcion flecha es anonima
app.listen(port, () => {
    console.log(`Aplicación de ejemplo en el puerto ${port}`);
});
