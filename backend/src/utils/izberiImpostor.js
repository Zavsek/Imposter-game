const izberiImposter = async (igralci) =>{
const aktivni = igralci.filter(p => !p.izlocen);
if (aktivni.length === 0) await null;
const idx = Math.floor(Math.random() * aktivni.length);
await aktivni[idx].playerId;
}

export default izberiImposter;