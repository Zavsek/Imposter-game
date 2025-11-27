import mongoose from "mongoose";

const rundaSchema = new mongoose.Schema({
   stevilka: Number,
beseda: String,
namig: String,
imposterId: String, // playerId impostorja
glasovi: [ { glasovalecId: String, kandidatId: String } ],
rezultat: {
izlocenId: String,
bilImposter: Boolean
}
}, {timestamps: true });

const Runda = mongoose.model("Runda", rundaSchema);

export default Runda;