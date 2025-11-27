import mongoose from "mongoose";

const igralecSchema = new mongoose.Schema({
ime: { type: String, default: 'Anon' },
ready: { type: Boolean, default: false },
jeImposter: { type: Boolean, default: false },
glasovalZa: { type: String, default: null },
izlocen: { type: Boolean, default: false }
});
const Igralec = mongoose.model("Igralec", igralecSchema);

export default Igralec;
