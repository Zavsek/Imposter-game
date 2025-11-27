import Igralec from "../models/igralec.model.js";


const checkCookie = async (req, res, next) => {
  try {
    const playerId = req.cookies._id; 
    if (!playerId) {
      req.igralec = null; 
      return next();
    }
    const igralec = await Igralec.findById(playerId);
    req.igralec = igralec || null;
    next();
  } catch (error) {
    console.error("Napaka pri /check:", error);
    req.igralec = null;
    next();
  }
};

export default checkCookie;