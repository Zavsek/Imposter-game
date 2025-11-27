import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import generirajEdinstvenoKodo from './utils/codeGenerator.js';
import izberiImposter from './utils/izberiImpostor.js';
import sanitizirajIgro from './utils/sanitizirajIgro.js';
import ustvariIgralca from './controllers/igralec.controller.js'
import { connectDB } from './lib/db.js';
import igralecRoutes from './routes/igralec.routes.js'
import checkCookie from './midlleware/CheckCookie.js';
import Igra from './models/igra.model.js';


dotenv.config();


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const server = http.createServer(app);
const io = new SocketIO(server, {
cors: {
origin: "http://localhost:5173",
methods: ['GET', 'POST'],
credentials: true
}
});


app.use(express.json());
app.use(cookieParser());
app.use('/api/igralec', igralecRoutes)


app.post('/api/ustvari-igro', checkCookie, async (req, res) => {
  try {   
    const igralec = req.igralec ;
    const koda = await generirajEdinstvenoKodo(4);
    const novaIgra = new Igra({ koda, igralci: [igralec], stanje: 'lobby', runde: [] });
    await novaIgra.save();
    return res.status(200).json(novaIgra);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Nepričakovana napaka pri ustvarjanju igre' });
  }
});

app.post("/api/pridruzi", async (req, res) => {
  try {
    const { koda, ime } = req.body;
    if (!koda)
      return res.status(400).json({ napaka: "Manjka koda" });

    const igra = await Igra.findOne({ koda });
    if (!igra)
      return res.status(404).json({ napaka: "Igra ne obstaja" });

    let _id = req.cookies._id;

    let igralec = igra.igralci.find((p) => p._id === _id);

    if (!igralec) {
      igralec =  req.igralec || ustvariIgralca(ime);
      igra.igralci.push(igralec);
      await igra.save();
    }



    // Pošlji posodobitev preko Socket.IO
    io.to(koda).emit("posodobitevIgre", sanitizirajIgro(igra));

    return res.json({
      koda,
      _id: igralec._id,
      ime: igralec.ime,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ napaka: "Nepričakovana napaka pri pridružitvi" });
  }
});

// Vrni stanje igre (javno, anonimizirano)
app.get('/api/igra/:koda', async (req, res) => {
  try {
    const igra = await Igra.findOne({ koda: req.params.koda }).lean();
    if (!igra) return res.status(404).json({ napaka: 'Igra ne obstaja' });
    return res.json(sanitizirajIgro(igra));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Nepričakovana napaka' });
  }
});

io.on("connection", (socket) => {
  console.log("Socket povezan:", socket.id);

  socket.on("joinRoom", async ({ koda, _id, ime }) => {
    try {
      if (!koda) return;

      socket.join(koda);
      socket.data._id = _id;

      let igra = await Igra.findOne({ koda });
      if (!igra) return;

      // Poišči igralca v igri
      let igralec = igra.igralci.find((p) => p._id === _id);

      // Če ga ni, ustvari novega
      if (!igralec) {
        igralec = ustvariIgralca(ime, _id);
        igra.igralci.push(igralec);
        await igra.save();
      }

      // Zabeleži socket povezavo
      if (igralec._id) {
        onlineMap.set(igralec._id, socket.id);
      }

      // Pošlji posodobljeno stanje vsem v sobi
      io.to(koda).emit("posodobitevIgre", sanitizirajIgro(igra));
    } catch (err) {
      console.error("joinRoom napaka", err);
    }
  });

  socket.on("disconnect", () => {
    const pid = socket.data._id;
    if (pid) onlineMap.delete(pid);
    console.log("Socket odklopljen:", socket.id, "_id:", pid);
  });
});

async function zacetekRunde(koda) {
  const igra = await Igra.findOne({ koda });
  if (!igra) return;

  const imposterId = izberiImposter(igra.igralci);
  const pair = izberiBesedo();

  // ponastavi glasove in nastavi imposter
  for (const p of igra.igralci) {
    if (!p.izlocen) p.ready = false; // za naslednjo rundo
    p.glasovalZa = null;
    p.jeImposter = (p._id === imposterId);
  }

  const novaRunda = {
    stevilka: (igra.runde ? igra.runde.length + 1 : 1),
    beseda: pair.beseda,
    namig: pair.namig,
    imposterId,
    glasovi: [],
    rezultat: null
  };

  igra.trenutnaRunda = novaRunda;
  igra.stanje = 'igra';
  await igra.save();

  // Pošlji splošno posodobitev (anonimizirano)
  io.to(koda).emit('posodobitevIgre', sanitizirajIgro(igra));

  // Pošlji vsakemu igralcu LOČNO njegovo vlogo (privatno)
  for (const p of igra.igralci) {
    const sid = onlineMap.get(p._id);
    if (!sid) continue; // če ni povezan

    if (p.jeImposter) {
      io.to(sid).emit('igraZacela', { vloga: 'imposter', namig: pair.namig });
    } else {
      io.to(sid).emit('igraZacela', { vloga: 'player', beseda: pair.beseda });
    }
  }
}

async function zakljucakGlasovanja(koda) {
  const igra = await Igra.findOne({ koda });
  if (!igra || !igra.trenutnaRunda) return;

  const glasovi = igra.trenutnaRunda.glasovi;
  const stevci = {};
  for (const g of glasovi) {
    stevci[g.kandidatId] = (stevci[g.kandidatId] || 0) + 1;
  }

  // poišči največ glasov
  let max = 0;
  let kandidatNaj = null;
  for (const [k, v] of Object.entries(stevci)) {
    if (v > max) { max = v; kandidatNaj = k; }
    else if (v === max) { /* tie -> lahko obravnavamo posebej */ }
  }

  let bilImposter = false;
  if (kandidatNaj) {
    // najdi igralca in označi izločen
    const target = igra.igralci.find(p => p._id === kandidatNaj);
    if (target) {
      target.izlocen = true;
      bilImposter = target.jeImposter === true;
    }
  }

  // shranimo rezultat v rundo
  igra.trenutnaRunda.rezultat = { izlocenId: kandidatNaj, bilImposter };
  igra.runde.push(igra.trenutnaRunda);

  // posodobimo stanje
  igra.stanje = 'rezultat';
  igra.izlocenImposter = bilImposter;

  // Po koncu runde lahko odločimo, ali je igra končana ali se nadaljuje
  // Preprosto pravilo: če je bil izločen imposter -> končano
  if (bilImposter) {
    igra.stanje = 'koncano';
  } else {
    // če niso izločili impostorja, lahko nadaljujemo (ponastavi ready zastavice)
    igra.stanje = 'lobby';
    for (const p of igra.igralci) {
      if (!p.izlocen) p.ready = false;
      p.jeImposter = false; // odstrani označbo
      p.glasovalZa = null;
    }
    igra.trenutnaRunda = null;
  }

  await igra.save();

  // obvestimo vse v sobi s končnim rezultatom
  io.to(koda).emit('rezultatiGlasovanja', {
    izlocenId: kandidatNaj,
    bilImposter,
    stanje: igra.stanje
  });

  // posodobitev igre (anonimizirano)
  io.to(koda).emit('posodobitevIgre', sanitizirajIgro(igra));
}



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server teče na portu ${PORT}`));
connectDB(); 