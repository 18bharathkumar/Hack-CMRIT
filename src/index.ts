// Express API Endpoints for Forensic Investigation DApp

import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GOVERNMENT ENDPOINTS

app.get("/user/:address", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { address: req.params.address } });
  res.json({ user: user || null });
});


app.post("/addCFSL", async (req, res) => {
  const { address, ipfsHash } = req.body;
  const cfsl = await prisma.cFSL.create({ data: { address, ipfsHash } });
  res.json(cfsl);
});

app.get("/getCFSLS", async (req, res) => {
  const cfsls = await prisma.cFSL.findMany();
  res.json(cfsls);
});


app.get("/getCFSL/:address", async (req, res) => {
  try {
    const cfsls = await prisma.cFSL.findFirst({
      where: { address: req.params.address },
    });
    res.json(cfsls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CFSL" });
  }
});


// CFSL ENDPOINTS

app.post("/addFSL", async (req, res) => {
  const { address, ipfsHash, cfslId } = req.body;
  const fsl = await prisma.fSL.create({ data: { address, ipfsHash, cfslId } });
  res.json(fsl);
});

app.get("/getFSLs/:cfslAddress", async (req, res) => {
  const fsl = await prisma.fSL.findMany({ where: { cfslId: req.params.cfslAddress } });
  res.json(fsl);
});



// FSL ENDPOINTS

app.post("/addFSLMember", async (req, res) => {
  const { address, ipfsHash, fslId } = req.body;
  const member = await prisma.fSLMember.create({ data: { address, ipfsHash, fslId } });
  res.json(member);
});

app.get("/getFSLMembers/:fslAddress", async (req, res) => {
  const members = await prisma.fSLMember.findMany({ where: { fslId: req.params.fslAddress } });
  res.json(members);
});




app.post("/addpoliceStation", async (req, res) => {
  const { address, ipfsHash, fslId } = req.body;
  const policeStation = await prisma.policeStation.create({ data: { address, ipfsHash, fslId } });
  res.json(policeStation);  
});


app.get("/getPoliceStations/:fslAddress", async (req, res) => {
  const policeStations = await prisma.policeStation.findMany({ where: { fslId: req.params.fslAddress } });
  res.json(policeStations);
}
);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
