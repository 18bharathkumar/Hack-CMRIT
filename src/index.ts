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

// app.get("/government/cases", async (req, res) => {
//   const cases = await prisma.case.findMany({ include: { finalReport: true } });
//   res.json(cases);
// });

// CFSL ENDPOINTS

app.post("/addFSL", async (req, res) => {
  const { address, ipfsHash, cfslId } = req.body;
  const fsl = await prisma.fSL.create({ data: { address, ipfsHash, cfslId } });
  res.json(fsl);
});

// app.get("/cfsl/:cfslId/cases", async (req, res) => {
//   const cases = await prisma.case.findMany({ where: { fsl: { cfslId: req.params.cfslId } }, include: { finalReport: true } });
//   res.json(cases);
// });

// FSL ENDPOINTS

app.post("/addFSLMember", async (req, res) => {
  const { address, ipfsHash, fslId } = req.body;
  const member = await prisma.fSLMember.create({ data: { address, ipfsHash, fslId } });
  res.json(member);
});

app.post("/acceptCASE", async (req, res) => {
  const { caseId, fslId } = req.body;
  const updated = await prisma.case.update({ where: { id: caseId }, data: { accepted: true, fslId } });
  res.json(updated);
});


// app.post("/fsl/report", async (req, res) => {
//   const { id, caseId, headId, memberIds } = req.body;
//   const report = await prisma.report.create({
//     data: {
//       id,
//       caseId,
//       headId,
//       members: { connect: memberIds.map((id: any) => ({ id })) },
//     },
//   });
//   res.json(report);
// });

// app.post("/fsl/final-report", async (req, res) => {
//   const { caseId, ipfsHash } = req.body;
//   const report = await prisma.finalReport.create({ data: { caseId, ipfsHash } });
//   res.json(report);
// });

// app.get("/fsl/reports", async (req, res) => {
//   const reports = await prisma.report.findMany({ include: { members: true, head: true } });
//   res.json(reports);
// });

// app.get("/fsl/final-report/:caseId", async (req, res) => {
//   const final = await prisma.finalReport.findUnique({
//     where: { caseId: req.params.caseId },
//     include: {
//       reports: { include: { head: true, members: true, signedBy: true } },
//     },
//   });
//   res.json(final);
// });

app.post("/addpoliceStation", async (req, res) => {
  const { address, ipfsHash, fslId } = req.body;
  const policeStation = await prisma.policeStation.create({ data: { address, ipfsHash, fslId } });
  res.json(policeStation);  
});




// POLICE STATION ENDPOINTS

// app.post("/police/case", async (req, res) => {
//   const { id, ipfsHash, policeId } = req.body;
//   const newCase = await prisma.case.create({ data: { id, ipfsHash, policeId } });
//   res.json(newCase);
// });

// app.get("/police/final-report/:caseId", async (req, res) => {
//   const report = await prisma.finalReport.findUnique({ where: { caseId: req.params.caseId }, include: { reports: true } });
//   res.json(report);
// });

// FSL MEMBER ENDPOINTS

// app.get("/member/reports/:memberId", async (req, res) => {
//   const memberId = req.params.memberId;
//   const headed = await prisma.report.findMany({ where: { headId: memberId }, include: { members: true } });
//   const member = await prisma.report.findMany({ where: { members: { some: { id: memberId } } }, include: { members: true } });
//   res.json({ headed, member });
// });

// app.post("/member/signature", async (req, res) => {
//   const { reportId, memberId } = req.body;
//   const report = await prisma.report.update({
//     where: { id: reportId },
//     data: { signedBy: { connect: { id: memberId } } },
//   });
//   res.json(report);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
