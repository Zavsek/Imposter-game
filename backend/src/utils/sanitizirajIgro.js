const sanitizirajIgro= (igraDoc, zaPlayerId = null)=> {
// Vrne kopijo igre, primerna za javno objavo (brez skrivnosti: namig, beseda, imposterId)
if (!igraDoc) return null;
const obj = JSON.parse(JSON.stringify(igraDoc));
obj.igralci = obj.igralci.map(p => ({
playerId: p.playerId,
ime: p.ime,
ready: p.ready,
izlocen: p.izlocen
// ne vračamo jeImposter ali glasovalZa (lahko pa vrnemo boolean ali status)
}));
if (obj.trenutnaRunda) {
// odstranimo skrivne podatke
delete obj.trenutnaRunda.beseda;
delete obj.trenutnaRunda.namig;
delete obj.trenutnaRunda.imposterId;
// glasovi lahko ostanejo anonymizirani ali štetje
obj.trenutnaRunda.steviloGlasov = obj.trenutnaRunda.glasovi ? obj.trenutnaRunda.glasovi.length : 0;
delete obj.trenutnaRunda.glasovi; // odstrani surove glasove
}
return obj;
}
export default sanitizirajIgro;