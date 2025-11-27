import mongoose from 'mongoose'

const igraSchema = new mongoose.Schema({
    koda: { type: String, required: true, unique: true },
stanje: { type: String, enum: ['lobby','igra','glasovanje','rezultat','koncano'], default: 'lobby' },
igralci: [{type: mongoose.Schema.Types.ObjectId, ref:'Igralec'}],
runde: [{type: mongoose.Schema.Types.ObjectId, ref:'Runda'}],
trenutnaRunda: {type: mongoose.Schema.Types.ObjectId, ref:'Igralec'},
izlocenImposter: { type: Boolean, default: false }
}, { timestamps: true });
const Igra = mongoose.model("Igra", igraSchema);

export default Igra;