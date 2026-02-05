# Calculateur de Zakât (SPA React)

Plateforme web responsive pour estimer la Zakât sur l’épargne, avec un calcul basé sur le Nisâb et une interface pédagogique en français.

## Démarrage rapide
```bash
npm install
npm run dev
```

## Mode automatique (sans clé)
L’application charge automatiquement :
- Le prix de l’or via **Free Gold API**.
- Le ratio or/argent via **Free Gold API** (pour déduire le prix de l’argent).
- Les taux de change via **ExchangeRate-API** (open access).

Si une source est indisponible, l’interface bascule en **saisie manuelle** des prix.

## Variables d’environnement (optionnelles)
Créer un fichier `.env` à la racine si vous souhaitez remplacer la source automatique :

```env
VITE_PRICE_API_URL=https://exemple-api.tld/latest
VITE_DEFAULT_CURRENCY=EUR
VITE_CACHE_TTL_HOURS=24
```

### Format attendu de l’API personnalisée
L’API doit retourner un JSON de la forme :
```json
{
  "timestamp": 1710000000,
  "currency": "EUR",
  "unit": "g",
  "metals": { "gold": 62.5, "silver": 0.75 }
}
```

## Scripts
- `npm run dev` : serveur local
- `npm run build` : build de production
- `npm run preview` : aperçu du build

## Notes
- Calculs financiers via `decimal.js` pour éviter les erreurs de flottants.
- Validation via `zod`.
- Typographie IBM Plex via Google Fonts.
