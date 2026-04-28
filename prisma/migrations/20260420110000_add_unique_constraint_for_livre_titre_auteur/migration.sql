-- Enforce uniqueness for the pair (titre, auteur)
CREATE UNIQUE INDEX "livres_titre_auteur_key" ON "livres"("titre", "auteur");
