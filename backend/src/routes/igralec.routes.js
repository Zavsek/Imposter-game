import express from 'express';
import Igralec from "../models/igralec.model.js";
import ustvariIgralca from '../controllers/igralec.controller.js';
import checkCookie from '../midlleware/CheckCookie.js';

const router = express.Router();




const checkIgralec = (req, res) => {
  try {
    console.log(req.igralec); 
    res.status(200).json(req.igralec);
  } catch (error) {
    console.log("Error in checkIgralec controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Zdaj route-i, ki jih uporabljajo
router.post("/ustvari-igralca", async (req, res) => {
  try {
    const igralec = await ustvariIgralca(req.body.ime);
    res.cookie("_id", igralec._id.toString(), {
      httpOnly: true,        
      secure: false,         
      sameSite: "lax",      
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return res.json({
      ime: igralec.ime,
      _id: igralec._id
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ napaka: "Nepričakovana napaka pri ustvarjanju igralca" });  
  }
});

router.get("/check", checkCookie, checkIgralec);

export default router;