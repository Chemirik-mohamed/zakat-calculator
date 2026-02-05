# Spécification technique — Plateforme Web de Calcul de Zakât

## 1. Contexte et objectifs
Plateforme web responsive destinée aux musulmans francophones pour calculer la Zakât sur l’épargne. L’outil est gratuit, simple, accessible et conforme aux principes islamiques (fatâwâ), avec un affichage pédagogique et des sources religieuses claires.

Objectifs fonctionnels :
1. Calculer la Zakât (2,5%) lorsque l’épargne dépasse le Nisâb.
2. Utiliser un Nisâb basé sur l’or (83 g) par défaut.
3. Permettre un choix manuel de la date de référence Hijri (jour + mois).
4. Charger les prix de l’or et de l’argent via une API publique sans clé (Free Gold API + ratio or/argent), avec cache local 24h, sinon saisir manuellement.
5. Afficher un résultat clair, compréhensible et spirituellement respectueux.

Objectifs techniques :
1. SPA Vite + React + TypeScript.
2. Validation robuste avec Zod.
3. Calculs financiers fiables (éviter les flottants).
4. UX mobile-first et conforme WCAG.

## 2. Architecture globale
### 2.1 Structure des dossiers
- `src/components` : composants UI.
- `src/hooks` : hooks de récupération et calcul.
- `src/lib` : utilitaires (arrondi, cache, conversions).
- `src/schemas` : schémas Zod.
- `src/data` : FAQ, textes pédagogiques, sources.
- `src/styles` : tokens Tailwind et styles globaux.

### 2.2 Flux de données
Diagramme textuel :
```
UI → useGoldSilverPrices → cache localStorage (TTL 24h) → API → normalisation → state → affichage
```

### 2.3 Choix technologiques
- Vite : démarrage rapide, bundle optimisé, simple à déployer.
- React + TypeScript : sûreté et maintenabilité.
- Zod : validation explicite des entrées et réponses API.
- `decimal.js` : calculs fiables pour éviter les erreurs de flottants.

## 3. Composants React
Liste des composants clés et responsabilités :
1. `ZakatCalculator` : orchestration de l’état global et logique métier.
2. `CalculationForm` : formulaire (montant, devise, date Hijri, base Nisâb).
3. `NisabDisplay` : affichage du Nisâb courant (en devise sélectionnée).
4. `ResultDisplay` : résultat final, statut “dû / non dû”, résumé lisible.
5. `PriceStatusBadge` : état des prix (chargement, cache, erreur).
6. `FAQSection` : accordéons pédagogiques et sources religieuses.

## 4. Hooks personnalisés
1. `useGoldSilverPrices`
   - Récupération des prix (or/argent).
   - Cache localStorage avec TTL 24h.
   - Fallback sur cache si l’API échoue, sinon bascule en saisie manuelle.
   - Expose : `data`, `loading`, `error`, `isFromCache`.

2. `useZakatCalculation`
   - Calcule le Nisâb selon la base choisie.
   - Vérifie le franchissement du Nisâb.
   - Calcule la Zakât (2,5%).
   - Expose : `isDue`, `nisab`, `zakat`, `reason`.

## 5. Schémas Zod
### 5.1 Formulaire
Champs :
1. Montant : nombre positif, 2 décimales max.
2. Devise : liste contrôlée (`EUR`, `USD`, `GBP`, `CHF`, `CAD`, `MAD`).
3. Base Nisâb : `gold` ou `silver` (par défaut `gold`).
4. Date Hijri : jour 1–30, mois 1–12.
5. Confirmation du Hawl : checkbox obligatoire.

### 5.2 Réponse API
Validation minimale :
1. `timestamp` valide.
2. `currency` non vide.
3. `gold` et `silver` en nombre.
4. `unit` en grammes si possible.

## 6. Logique métier
### 6.1 Règles religieuses
- Zakât obligatoire si l’épargne atteint le Nisâb.
- Nisâb or : 83 g (par défaut).
- Nisâb argent : 595 g (option utilisateur).
- Condition du Hawl : épargne détenue une année lunaire complète.

### 6.2 Pseudo-code
```ts
getPrices(currency):
  if cacheValid(24h) return cache
  try fetch API
    validate schema
    store cache
    return prices
  catch
    if cacheExists return cache + warning
    return error

computeNisab(basis, prices):
  grams = basis === "gold" ? 83 : 595
  return prices[basis] * grams

computeZakat(amount, nisab, hawlConfirmed):
  if !hawlConfirmed return not_due
  if amount < nisab return not_due
  return round(amount * 0.025, 2)
```

## 7. Design Tailwind
### 7.1 Palette
- Navy : `#0B1F2A`
- Gold : `#C9A44C`
- Sand : `#F6F1E8`
- Slate : `#475569`

### 7.2 Typographies
- Titres : `IBM Plex Serif`
- Texte : `IBM Plex Sans`

### 7.3 Composants visuels
- Card : fond `sand`, bord `slate` léger.
- Bouton primaire : fond `gold`, texte `navy`.
- Inputs : focus state visible + erreur en rouge.
- Badge : vert si Zakât due, gris si non due.

## 8. Accessibilité & UX
1. Labels explicites et aria-describedby pour erreurs.
2. Contrastes vérifiés (WCAG AA).
3. Messages d’erreur et d’aide en français.
4. Animation légère pour l’apparition du résultat.

## 9. Gestion des erreurs et edge cases
1. API indisponible : utiliser le cache ou basculer en saisie manuelle avec avertissement.
2. Pas de cache : afficher un message d’échec clair.
3. Montant invalide : message Zod personnalisé.
4. Date Hijri non choisie : bloquer le calcul.
5. Hawl non confirmé : résultat “non due”.

## 10. Tests & validation
Scénarios de test :
1. Montant inférieur, égal et supérieur au Nisâb.
2. Cache valide et expiré.
3. API indisponible.
4. Montants avec décimales limites (ex: 0.01).
5. Formulaire incomplet.
6. Mobile 320px.

## 11. Déploiement
Environnements :
- `VITE_DEFAULT_CURRENCY`
- `VITE_DEFAULT_NISAB_BASIS`
- `VITE_CACHE_TTL_HOURS`
- `VITE_PRICE_API_URL` (ou service choisi)

Options :
1. Client-only sans clé (Free Gold API + ExchangeRate-API) + mode manuel.
2. Proxy serverless si clé nécessaire.

## 12. Sources religieuses (à afficher en FAQ)
1. Obligation de la Zakât : Qur’an 2:43 et 9:103.
2. Catégories de bénéficiaires : Qur’an 9:60.
3. Nisâb et Hawl : hadiths authentifiés sur les seuils.

Avertissement : “Cet outil est informatif. Consultez un savant en cas de situation complexe.”

## 13. Hypothèses et limites
1. Nisâb or par défaut.
2. Arrondi au centime (2 décimales).
3. Date Hijri simple (jour/mois).
4. API optionnelle, sans clé. Mode manuel si indisponible.
