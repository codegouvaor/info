# Design — Page de consultation d'une Constitution

## 1. Objectif

Cette page constitue l'interface officielle de consultation de la Constitution.

Elle doit permettre à un citoyen de :

* lire la Constitution intégralement ;
* retrouver rapidement un article précis ;
* rechercher un mot ou une expression ;
* comprendre la structure du texte ;
* identifier immédiatement la version actuellement en vigueur ;
* consulter les différentes versions historiques ;
* accéder aux modifications constitutionnelles ;
* copier ou imprimer le texte ;
* partager directement un article ou une section ;
* naviguer facilement entre les différents titres et articles.

La page doit être conçue comme une **référence juridique numérique**, et non comme une simple page éditoriale.

---

# 2. URL

## Vue principale

`/locale/republique/constitution`

Cette route présente la Constitution complète.

## Article / contenu détaillé

`/locale/republique/constitution/[slug]`

Exemples :

```text
/locale/republique/constitution/preambule
/locale/republique/constitution/article-1
/locale/republique/constitution/article-2
/locale/republique/constitution/titre-ii-president-de-la-republique
```

L'objectif est de permettre à chaque élément juridique important de disposer d'une URL stable et partageable.

---

# 3. Principes UX

### Priorité absolue : le texte

La Constitution doit être immédiatement identifiable comme le contenu principal de la page.

Éviter :

* les hero sections marketing ;
* les illustrations décoratives imposantes ;
* les animations inutiles ;
* les cartes excessivement nombreuses ;
* les éléments qui éloignent du texte juridique.

La hiérarchie doit être :

```text
Constitution
↓
Statut juridique
↓
Outils de consultation
↓
Structure du texte
↓
Texte constitutionnel
```

---

# 4. En-tête institutionnel

Utiliser l'en-tête institutionnel commun du site `info.gouv.aor`.

Il doit comporter :

* identité de la République ;
* logo / emblème officiel ;
* navigation principale ;
* moteur de recherche global ;
* accès aux paramètres d'accessibilité ;
* changement de langue si disponible.

L'en-tête doit rester relativement compact afin de maximiser l'espace disponible pour le document.

---

# 5. Fil d'Ariane

Afficher un fil d'Ariane immédiatement avant le contenu principal :

```text
Accueil
› République
› Constitution
```

Sur une page d'article :

```text
Accueil
› République
› Constitution
› Titre II — Le Président de la République
› Article 8
```

Le fil d'Ariane doit permettre de revenir rapidement à la structure supérieure.

---

# 6. En-tête du document

Créer un bloc documentaire distinct.

```text
CONSTITUTION

Constitution de la République d'Astoria

Texte fondamental de la République
```

Sous le titre :

```text
En vigueur
Version actuellement applicable

Dernière modification :
12 juin 2026
```

Utiliser un indicateur visuel clair pour le statut :

```text
● En vigueur
```

Le statut doit être immédiatement compréhensible sans nécessiter de lecture supplémentaire.

---

# 7. Métadonnées

Présenter les informations essentielles dans une zone compacte :

| Information           | Valeur               |
| --------------------- | -------------------- |
| Nature                | Constitution         |
| Autorité              | République d'Astoria |
| Statut                | En vigueur           |
| Version               | Version consolidée   |
| Entrée en vigueur     | 01/01/XXXX           |
| Dernière modification | JJ/MM/AAAA           |

Ne pas transformer cette zone en tableau administratif massif.

Sur desktop, elle peut être présentée sous forme de métadonnées horizontales.

Sur mobile, elle devient une liste verticale.

---

# 8. Barre d'actions

Sous les métadonnées :

```text
[ Rechercher dans le texte ]
[ Voir les versions ]
[ Copier ]
[ Imprimer ]
[ Partager ]
```

Les actions principales doivent être facilement accessibles.

### Action principale

La recherche dans la Constitution est l'action la plus importante.

Elle doit pouvoir être activée :

* par clic ;
* avec un raccourci clavier ;
* depuis le moteur de recherche global.

---

# 9. Recherche dans la Constitution

Créer une zone dédiée :

```text
┌──────────────────────────────────────────────────────┐
│ 🔎 Rechercher dans la Constitution                   │
│                                                      │
│ Rechercher un article, un mot ou une expression      │
└──────────────────────────────────────────────────────┘
```

Options :

```text
☐ Rechercher uniquement dans la version en vigueur
☐ Correspondance exacte
```

Lorsqu'une recherche est effectuée :

```text
Résultats
──────────────────────────────

Article 1
... organisation de la République ...

Article 3
... souveraineté nationale ...

Article 72
... organisation décentralisée ...
```

Chaque résultat doit afficher :

* numéro de l'article ;
* titre ;
* extrait ;
* terme recherché mis en évidence ;
* lien direct.

---

# 10. Navigation dans la Constitution

La structure de la Constitution doit être présentée comme un véritable sommaire.

Exemple :

```text
SOMMAIRE

Préambule

Titre I
De la souveraineté
Articles 1 à 4

Titre II
Du Président de la République
Articles 5 à 19

Titre III
Du Gouvernement
Articles 20 à 23

Titre IV
Du Parlement
Articles 24 à 33

...
```

Chaque titre doit être repliable.

Sur desktop, prévoir idéalement une navigation persistante à gauche.

---

# 11. Navigation latérale

### Desktop

Layout :

```text
┌────────────────────────────────────────────────────────────┐
│ En-tête                                                    │
├────────────────────────────────────────────────────────────┤
│ Breadcrumbs                                                │
├───────────────────────┬────────────────────────────────────┤
│ SOMMAIRE              │ Constitution                       │
│                       │                                    │
│ Préambule             │ Article 1                          │
│                       │                                    │
│ Titre I               │ Texte...                           │
│  Article 1            │                                    │
│  Article 2            │                                    │
│  Article 3            │                                    │
│                       │                                    │
│ Titre II              │ Article 2                          │
│  Article 5            │ Texte...                           │
│  Article 6            │                                    │
└───────────────────────┴────────────────────────────────────┘
```

La navigation latérale doit indiquer la position actuelle.

Exemple :

```text
Titre II
└── Article 8  ← actif
```

---

# 12. Mobile

Sur mobile, supprimer la sidebar persistante.

La remplacer par :

```text
[ ☰ Sommaire de la Constitution ]
```

Le sommaire s'ouvre dans un panneau ou une modale.

La lecture du texte doit rester prioritaire.

---

# 13. Structure des articles

Chaque article doit disposer d'une structure visuelle extrêmement claire.

Exemple :

```text
Article 8

Le Président de la République nomme le Premier ministre.
Il met fin à ses fonctions sur la présentation par celui-ci
de la démission du Gouvernement.

Sur la proposition du Premier ministre, il nomme les autres
membres du Gouvernement et met fin à leurs fonctions.
```

L'article constitue une unité autonome.

---

# 14. Ancre permanente

Chaque article doit disposer d'une ancre stable.

Exemple :

```text
#article-8
```

Un bouton discret doit permettre de copier le lien :

```text
Article 8                         [ 🔗 ]
```

Cliquer sur le bouton copie :

```text
https://info.gouv.aor/locale/republique/constitution/article-8
```

L'URL doit ouvrir directement l'article concerné.

---

# 15. Numérotation

La numérotation doit être très visible mais secondaire par rapport au texte.

Exemple :

```text
ARTICLE 8
```

ou :

```text
Article 8
```

La typographie doit permettre de scanner rapidement plusieurs articles.

---

# 16. Titres constitutionnels

Les titres doivent fonctionner comme des séparateurs structurels.

Exemple :

```text
────────────────────────────────────────

TITRE II

Du Président de la République

Articles 5 à 19

────────────────────────────────────────
```

Le titre doit être identifiable sans être excessivement décoratif.

---

# 17. Préambule

Le Préambule doit être traité comme une partie spécifique de la Constitution.

Présentation :

```text
PRÉAMBULE

Le peuple d'Astoria proclame...

[Texte]

Références
...
```

Le Préambule doit apparaître dans le sommaire avant le premier titre.

---

# 18. Historique des versions

Créer une fonctionnalité permettant de consulter les différentes versions.

Interface :

```text
Versions de la Constitution

● Version actuelle
  12 juin 2026

○ Version précédente
  03 avril 2024

○ Version précédente
  17 septembre 2021

○ Version originale
  01 janvier 2000
```

Deux modes :

```text
Voir une version
Comparer deux versions
```

---

# 19. Comparaison des versions

Le mode comparaison doit afficher :

```text
Version du 12/06/2026
             VS
Version du 03/04/2024
```

Les modifications doivent être clairement identifiables.

Exemple :

```text
Le Président est élu pour ~~sept~~ **cinq** ans.
```

Prévoir une représentation plus structurée que de simples couleurs afin de respecter l'accessibilité.

---

# 20. État d'un article

Lorsqu'un article a été modifié :

```text
Article 12

En vigueur depuis le 12/06/2026

Modifié par :
Révision constitutionnelle du 12 juin 2026
```

Lorsqu'un article n'est plus en vigueur :

```text
Article 42

ABROGÉ

Article abrogé le 03/04/2024
```

Les articles abrogés doivent être masqués par défaut dans la vue principale, avec une option :

```text
Afficher les articles abrogés
```

---

# 21. Références et modifications

Sous chaque article concerné :

```text
Historique

12 juin 2026
Révision constitutionnelle n°2026-01

03 avril 2024
Révision constitutionnelle n°2024-02
```

Chaque événement doit être cliquable.

---

# 22. Liens entre textes

Lorsqu'un article fait référence à un autre article :

```text
Voir également l'article 16
```

Le lien doit être directement cliquable.

Créer automatiquement des liens internes lorsque le moteur juridique identifie :

* un article ;
* un titre ;
* une loi constitutionnelle ;
* une décision ;
* une disposition référencée.

---

# 23. Copie du texte

Le bouton `Copier` doit permettre de copier :

* l'article ;
* le titre ;
* plusieurs articles sélectionnés ;
* l'intégralité du texte.

Lorsqu'un article est copié, conserver son contexte :

```text
Constitution de la République d'Astoria
Article 8

[texte]
```

Cela évite qu'un extrait copié perde sa référence juridique.

---

# 24. Impression

L'impression doit produire une version particulièrement sobre.

Supprimer :

* navigation ;
* recherche ;
* boutons ;
* éléments interactifs ;
* décorations.

Conserver :

```text
Constitution de la République d'Astoria

Version en vigueur au JJ/MM/AAAA

Article X
...
```

Ajouter en pied de page :

```text
info.gouv.aor
Version consultée le JJ/MM/AAAA
```

---

# 25. Partage

Le partage doit utiliser l'URL canonique.

Exemple :

```text
Partager l'article 8

[ Copier le lien ]
[ Partager ]
```

Le lien doit toujours pointer vers une URL stable.

---

# 26. Barre de progression

Pour la lecture intégrale de la Constitution, une indication discrète peut être affichée :

```text
Lecture : 37 %
```

Cette fonctionnalité est optionnelle.

Elle ne doit jamais devenir un élément visuel dominant.

---

# 27. Typographie

La Constitution doit bénéficier d'une typographie particulièrement lisible.

Principes :

* texte relativement large ;
* interligne généreux ;
* largeur de ligne limitée ;
* contraste élevé ;
* titres clairement hiérarchisés ;
* numérotation facilement identifiable.

Largeur recommandée du texte :

```text
60–75 caractères par ligne
```

Éviter les colonnes trop larges.

---

# 28. Mise en page desktop

Structure recommandée :

```text
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Constitution de la République d'Astoria                    │
│ Texte fondamental de la République                         │
│                                                             │
│ ● En vigueur · Version consolidée                           │
│                                                             │
│ [Rechercher] [Versions] [Copier] [Imprimer] [Partager]     │
│                                                             │
├───────────────────────┬─────────────────────────────────────┤
│                       │                                     │
│ Sommaire              │ Préambule                           │
│                       │                                     │
│ Préambule             │ Texte...                            │
│                       │                                     │
│ Titre I               │                                     │
│  Article 1            │ TITRE I                             │
│  Article 2            │ De la souveraineté                  │
│                       │                                     │
│ Titre II              │ Article 1                           │
│  Article 5            │ Texte...                            │
│  Article 6            │                                     │
│                       │                                     │
│ ...                   │ Article 2                           │
│                       │ Texte...                            │
│                       │                                     │
└───────────────────────┴─────────────────────────────────────┘
```

---

# 29. Mise en page mobile

```text
Header

Breadcrumb

Constitution de la République d'Astoria

● En vigueur

[ Rechercher ]
[ Sommaire ]

Préambule

Texte...

Titre I
De la souveraineté

Article 1

Texte...

Article 2

Texte...
```

Les contrôles doivent être facilement utilisables au doigt.

---

# 30. Accessibilité

La page doit être conçue pour être utilisable au clavier et avec les technologies d'assistance.

Obligatoire :

* navigation clavier complète ;
* focus visible ;
* titres HTML correctement hiérarchisés ;
* boutons correctement nommés ;
* liens explicites ;
* contrastes conformes ;
* aucune information transmise uniquement par la couleur ;
* compatibilité avec lecteurs d'écran ;
* respect de `prefers-reduced-motion`.

Les articles doivent être des unités sémantiques clairement identifiables.

---

# 31. Responsive design

Breakpoints indicatifs :

```text
Mobile       < 768px
Tablet       768–1199px
Desktop      ≥ 1200px
Large        ≥ 1440px
```

Sur grand écran, ne pas augmenter indéfiniment la largeur du texte.

Le contenu doit rester centré.

---

# 32. États particuliers

Prévoir explicitement :

### Article inexistant

```text
Article introuvable

L'article demandé n'existe pas ou n'est plus disponible.

[ Retour à la Constitution ]
```

### Version historique

Afficher clairement :

```text
VERSION HISTORIQUE

Cette version n'est plus en vigueur.

Version du 03 avril 2024
```

### Article abrogé

Afficher :

```text
ARTICLE ABROGÉ

Cet article n'est plus en vigueur.
```

### Recherche sans résultat

```text
Aucun résultat

Aucun passage ne correspond à votre recherche.

Essayez un autre terme ou une expression différente.
```

---

# 33. Architecture des composants

Prévoir une architecture réutilisable :

```text
ConstitutionPage
├── Breadcrumb
├── LegalDocumentHeader
│   ├── DocumentStatus
│   ├── DocumentMetadata
│   └── DocumentActions
│
├── ConstitutionSearch
│
├── ConstitutionLayout
│   ├── ConstitutionToc
│   └── ConstitutionContent
│       ├── Preamble
│       ├── ConstitutionTitle
│       └── ConstitutionArticle
│
├── VersionHistory
├── VersionComparison
└── DocumentFooter
```

Chaque composant doit être indépendant autant que possible.

---

# 34. Modèle de données

La structure doit permettre d'évoluer vers un véritable système documentaire juridique.

Exemple conceptuel :

```ts
interface Constitution {
  id: string
  title: string
  status: "active" | "archived"
  effectiveFrom: string
  lastModified: string
  versions: ConstitutionVersion[]
  sections: ConstitutionSection[]
}

interface ConstitutionVersion {
  id: string
  date: string
  status: "active" | "historical"
  source?: string
}

interface ConstitutionSection {
  id: string
  number?: string
  title: string
  articles: ConstitutionArticle[]
}

interface ConstitutionArticle {
  id: string
  number: string
  slug: string
  title?: string
  content: string
  status: "active" | "repealed"
  effectiveFrom?: string
  effectiveTo?: string
  modifications?: Modification[]
}
```

L'objectif est de ne pas stocker la Constitution comme un simple bloc HTML.

---

# 35. SEO et référencement

Chaque article doit disposer de :

* titre HTML spécifique ;
* URL canonique ;
* description adaptée ;
* données structurées lorsque pertinentes ;
* métadonnées de partage ;
* ancre stable.

Exemple :

```text
Constitution de la République d'Astoria — Article 8
```

Les moteurs de recherche doivent pouvoir indexer directement les articles.

---

# 36. Performance

La Constitution peut représenter une quantité importante de contenu.

Le rendu doit donc être pensé pour :

* SSR / génération statique lorsque possible ;
* chargement rapide du contenu initial ;
* recherche côté serveur ou indexée ;
* navigation instantanée entre articles ;
* absence de JavaScript obligatoire pour lire le texte.

**Principe important :**

> La Constitution doit rester lisible même si JavaScript est désactivé.

---

# 37. Architecture d'information globale

Cette page doit être considérée comme le niveau documentaire principal :

```text
République
│
├── Constitution
│   ├── Préambule
│   ├── Titre I
│   │   ├── Article 1
│   │   ├── Article 2
│   │   └── ...
│   │
│   ├── Titre II
│   ├── Titre III
│   └── ...
│
├── Institutions
├── Gouvernement
├── Parlement
├── Justice
└── Textes juridiques
```

La Constitution devient ainsi la **porte d'entrée vers le droit constitutionnel astorien**.

---

# 38. Différenciation par rapport à Légifrance

La référence fonctionnelle est Légifrance, mais l'interface ne doit pas être une copie.

L'approche Astoria doit privilégier :

### Légifrance

```text
Base juridique
↓
Très forte densité documentaire
↓
Interface principalement orientée recherche
```

### Info.gouv.aor

```text
Référence institutionnelle
↓
Compréhension
↓
Lecture
↓
Recherche
↓
Navigation juridique
```

La page doit donc être plus accessible au citoyen tout en conservant la rigueur nécessaire à un usage juridique.

---

# 39. Principe directeur

La page doit donner l'impression suivante :

> **« Voici le texte fondamental de la République. Vous pouvez le lire, le comprendre, rechercher une disposition précise et vérifier exactement dans quelle version elle est applicable. »**

Il ne s'agit pas de créer une page spectaculaire.

Il s'agit de créer **la référence numérique officielle de la Constitution**.

---

# 40. Résultat attendu

À terme, un utilisateur doit pouvoir arriver sur :

```text
info.gouv.aor/locale/republique/constitution
```

et comprendre immédiatement :

```text
CONSTITUTION DE LA RÉPUBLIQUE D'ASTORIA

● EN VIGUEUR

Dernière modification : JJ/MM/AAAA

[ Rechercher dans la Constitution ]

────────────────────────────────────────────

SOMMAIRE

Préambule
Titre I — ...
Titre II — ...
Titre III — ...
...

────────────────────────────────────────────

PRÉAMBULE

...

TITRE I
...

Article 1

...

Article 2

...
```

L'ensemble doit être suffisamment robuste pour évoluer ultérieurement vers une **plateforme juridique complète** : Constitution, lois constitutionnelles, lois, règlements, jurisprudence, versions historiques et liens entre textes.
