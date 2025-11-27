import RandomNumber from "../utils/randomNumber.js";
import Igralec from "../models/igralec.model.js";

export default async function ustvariIgralca(ime = null) {
  const imeIgralca = ime || await "player" + RandomNumber(4);

  const igralec = new Igralec({
    ime: imeIgralca && imeIgralca.trim() !== ""
      ? imeIgralca
      : "Player" + UniqueRandomNumber(),
    ready: false,
    jeImposter: false,
    glasovalZa: null,
    izlocen: false
  });

  await igralec.save(); 

  return igralec; 
}
