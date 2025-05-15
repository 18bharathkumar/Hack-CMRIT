-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "fslId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CFSL" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,

    CONSTRAINT "CFSL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FSL" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "cfslId" TEXT NOT NULL,

    CONSTRAINT "FSL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FSLMember" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "fslId" TEXT NOT NULL,

    CONSTRAINT "FSLMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliceStation" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "fslId" TEXT NOT NULL,

    CONSTRAINT "PoliceStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "policeId" TEXT NOT NULL,
    "fslId" TEXT,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalReport" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "headId" TEXT NOT NULL,
    "finalReportId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReportMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReportMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SignedReports" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SignedReports_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "CFSL_address_key" ON "CFSL"("address");

-- CreateIndex
CREATE UNIQUE INDEX "FSL_address_key" ON "FSL"("address");

-- CreateIndex
CREATE UNIQUE INDEX "FSLMember_address_key" ON "FSLMember"("address");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceStation_address_key" ON "PoliceStation"("address");

-- CreateIndex
CREATE UNIQUE INDEX "FinalReport_caseId_key" ON "FinalReport"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_caseId_key" ON "Report"("caseId");

-- CreateIndex
CREATE INDEX "_ReportMembers_B_index" ON "_ReportMembers"("B");

-- CreateIndex
CREATE INDEX "_SignedReports_B_index" ON "_SignedReports"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fslId_fkey" FOREIGN KEY ("fslId") REFERENCES "FSL"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FSL" ADD CONSTRAINT "FSL_cfslId_fkey" FOREIGN KEY ("cfslId") REFERENCES "CFSL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FSLMember" ADD CONSTRAINT "FSLMember_fslId_fkey" FOREIGN KEY ("fslId") REFERENCES "FSL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceStation" ADD CONSTRAINT "PoliceStation_fslId_fkey" FOREIGN KEY ("fslId") REFERENCES "FSL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_policeId_fkey" FOREIGN KEY ("policeId") REFERENCES "PoliceStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_fslId_fkey" FOREIGN KEY ("fslId") REFERENCES "FSL"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalReport" ADD CONSTRAINT "FinalReport_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_headId_fkey" FOREIGN KEY ("headId") REFERENCES "FSLMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_finalReportId_fkey" FOREIGN KEY ("finalReportId") REFERENCES "FinalReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportMembers" ADD CONSTRAINT "_ReportMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "FSLMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportMembers" ADD CONSTRAINT "_ReportMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SignedReports" ADD CONSTRAINT "_SignedReports_A_fkey" FOREIGN KEY ("A") REFERENCES "FSLMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SignedReports" ADD CONSTRAINT "_SignedReports_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
