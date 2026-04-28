-- Add archivedAt columns
ALTER TABLE "editeurs" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "livres" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "clients" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "commandes" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- Add indexes for active/archived filtering
CREATE INDEX "editeurs_archivedAt_idx" ON "editeurs"("archivedAt");
CREATE INDEX "livres_archivedAt_idx" ON "livres"("archivedAt");
CREATE INDEX "clients_archivedAt_idx" ON "clients"("archivedAt");
CREATE INDEX "commandes_archivedAt_idx" ON "commandes"("archivedAt");
