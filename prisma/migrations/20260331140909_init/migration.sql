-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_COURS', 'EXPEDIEE', 'LIVREE', 'ANNULEE');

-- CreateTable
CREATE TABLE "editeurs" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "editeurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livres" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,
    "qteStock" INTEGER NOT NULL,
    "editeurId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresseLivraison" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandes" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL,
    "montantTotal" DECIMAL(10,2) NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_COURS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "editeurs_code_key" ON "editeurs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "livres_isbn_key" ON "livres"("isbn");

-- CreateIndex
CREATE INDEX "livres_editeurId_idx" ON "livres"("editeurId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE INDEX "commandes_clientId_idx" ON "commandes"("clientId");

-- CreateIndex
CREATE INDEX "commandes_livreId_idx" ON "commandes"("livreId");

-- CreateIndex
CREATE INDEX "commandes_statut_idx" ON "commandes"("statut");

-- AddForeignKey
ALTER TABLE "livres" ADD CONSTRAINT "livres_editeurId_fkey" FOREIGN KEY ("editeurId") REFERENCES "editeurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "livres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
