import Igra from '../models/igra.model.js'

const ustvariKodo =  (dolzina) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let out = '';
    for (let i = 0; i < dolzina; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

const  generirajEdinstvenoKodo = async (dolzina) =>{
let koda;
let tries = 0;
do {
koda = ustvariKodo(dolzina);
const obstaja = await Igra.findOne({ koda }).lean();
if (!obstaja) return koda;
tries++;
} while (tries < 10);
return generirajEdinstvenoKodo(dolzina + 1);
}
export default generirajEdinstvenoKodo;
