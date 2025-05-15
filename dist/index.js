// Express API Endpoints for Forensic Investigation DApp
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
// GOVERNMENT ENDPOINTS
app.get("/user/role/:address", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { address: req.params.address } });
    res.json({ role: (user === null || user === void 0 ? void 0 : user.role) || null });
}));
app.post("/government/cfsl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, ipfsHash } = req.body;
    const cfsl = yield prisma.cFSL.create({ data: { address, ipfsHash } });
    res.json(cfsl);
}));
app.get("/government/cfsls", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cfsls = yield prisma.cFSL.findMany();
    res.json(cfsls);
}));
app.get("/government/cases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cases = yield prisma.case.findMany({ include: { finalReport: true } });
    res.json(cases);
}));
// CFSL ENDPOINTS
app.post("/cfsl/fsl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, ipfsHash, cfslId } = req.body;
    const fsl = yield prisma.fSL.create({ data: { address, ipfsHash, cfslId } });
    res.json(fsl);
}));
app.get("/cfsl/:cfslId/cases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cases = yield prisma.case.findMany({ where: { fsl: { cfslId: req.params.cfslId } }, include: { finalReport: true } });
    res.json(cases);
}));
// FSL ENDPOINTS
app.post("/fsl/member", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, ipfsHash, fslId } = req.body;
    const member = yield prisma.fSLMember.create({ data: { address, ipfsHash, fslId } });
    res.json(member);
}));
app.post("/fsl/accept-case", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caseId, fslId } = req.body;
    const updated = yield prisma.case.update({ where: { id: caseId }, data: { accepted: true, fslId } });
    res.json(updated);
}));
app.post("/fsl/report", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, caseId, headId, memberIds } = req.body;
    const report = yield prisma.report.create({
        data: {
            id,
            caseId,
            headId,
            members: { connect: memberIds.map((id) => ({ id })) },
        },
    });
    res.json(report);
}));
app.post("/fsl/final-report", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caseId, ipfsHash } = req.body;
    const report = yield prisma.finalReport.create({ data: { caseId, ipfsHash } });
    res.json(report);
}));
app.get("/fsl/reports", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield prisma.report.findMany({ include: { members: true, head: true } });
    res.json(reports);
}));
app.get("/fsl/final-report/:caseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const final = yield prisma.finalReport.findUnique({
        where: { caseId: req.params.caseId },
        include: {
            reports: { include: { head: true, members: true, signedBy: true } },
        },
    });
    res.json(final);
}));
// POLICE STATION ENDPOINTS
app.post("/police/case", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, ipfsHash, policeId } = req.body;
    const newCase = yield prisma.case.create({ data: { id, ipfsHash, policeId } });
    res.json(newCase);
}));
app.get("/police/final-report/:caseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield prisma.finalReport.findUnique({ where: { caseId: req.params.caseId }, include: { reports: true } });
    res.json(report);
}));
// FSL MEMBER ENDPOINTS
app.get("/member/reports/:memberId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.params.memberId;
    const headed = yield prisma.report.findMany({ where: { headId: memberId }, include: { members: true } });
    const member = yield prisma.report.findMany({ where: { members: { some: { id: memberId } } }, include: { members: true } });
    res.json({ headed, member });
}));
app.post("/member/signature", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId, memberId } = req.body;
    const report = yield prisma.report.update({
        where: { id: reportId },
        data: { signedBy: { connect: { id: memberId } } },
    });
    res.json(report);
}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
