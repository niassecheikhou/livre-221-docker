/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `editeurs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "editeurs_email_key" ON "editeurs"("email");
