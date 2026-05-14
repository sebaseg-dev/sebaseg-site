---
title: Essai de SonarQube
publishDate: 2026-03-23
img: /0-sonarqube/sonarqube_miniature.webp
img_alt: Bannière représentant les logos d'Éclaireur Public, de Data For Good, d'Anticor et de Transparency International France
description: Essai de SonarQube mené sur le projet Symfony La Soute
tags:
  - Code Quality
  - CI/CD
  - New tooling
order: 0
period: "03-2026"
---

## Préambule

_J'ai essayé sur un projet fermé l'outil SonarQube. Afin de rendre accessible, je copie mon extrait de la documentation du projet sur une partie Blog de mon site._

## Contexte

J'ai repéré une offre d'emploi qui me plaît beaucoup auprès du Ministère de la Transition Écologique qui met en avant la **mise en place de metrics SonarQube et exploitation des résultats**. Avant de postuler à cette offre, je souhaite mettre en place et tester [SonarQube Community Edition](https://www.sonarsource.com/open-source-editions/sonarqube-community-edition/) sur La Soute.

## Choix du projet

J'ai choisi mon projet de SaaS legalTech `La Soute`, sur la partie back écrite en PHP avec Symfony, pour correspondre d'une part à la stack de l'offre d'emploi repérée, mais aussi car dans la configuration d'un projet de SonarQube, l'option vers un langage PHP correspond aux choix "Autres", ainsi cela permet de voir une expérience peut être moins intégrée à l'outil pour se faire un meilleur avis de sa versatilité.

À noter pour un potentiel lecteur extérieur de cette page que le projet `La Soute` est un projet privé, dont le développement est en pause suite à une information négative sur le plan commercial. L'outil ayant été prévu pour être co-construit, et arrêté dans un état où ne sera pas déployé, aucune stratégie de test n'a été développée pour le moment – il est resté en stade de POC. D'où l'absence de metrics dans les captures liées au test coverage.

## Installation de l'environnement

Je passerai par des conteneurs Docker en local pour tester l'outil.

L'utilisation d'un network bridge (`sonar-net`) permet d'isoler la communication entre le scanner et le serveur, garantissant que le flux reste interne au moteur Docker sans exposer inutilement les services sur l'hôte:

```bash
docker network create sonar-net
```

```bash
docker run -d --name sonarqube --network sonar-net -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

L'interface d'administration est disponible sur `localhost:9000` _(utiliser Chrome)_.

## Configuration du scanner en local

Via docker:

```bash
docker run \
    --rm \
    --network sonar-net \
    -v "<PROJECT_PATH>:/usr/src" \
    -w "/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.host.url="http://sonarqube:9000" \
    -Dsonar.token="<SONAR_TOKEN>"
```

## Résultats

![Premiers résultats de SonarQube](/0-sonarqube/sonarqube_first_results.png)

On peut retrouver beaucoup d'informations sur la qualité du code. Par exemple, cette issue:

![Première issue SonarQube](/0-sonarqube/sonarqube_first_issue.png)

On peut ensuite suivre les corrections apportées à la base du code ainsi que celles introduites par le nouveau code:

![Première correction SonarQube](/0-sonarqube/sonarqube_first_fix.png)

_Dashboard après la correction d'1 issue (passage de 50 à 49 issues)_

## Parcours de l'outil SonarQube

### Quality Gates

L'outil permet de paramétrer finement des `Quality Gates` afin d'intégrer des règles automatiques en CI:

![Exemple de quality gate dans SonarQube](/0-sonarqube/sonarqube_quality_gates.png)

### Clean as you Go

On peut personnaliser les périodes afin de distinguer l'`Overall Code` du `New Code` et ainsi plus facilement embarquer l'outil dans des projets existants:

![Paramètrage de ce qui est considéré comme New Code dans SonarQube](/0-sonarqube/sonarqube_clean_as_you_go.png)

### Metrics

Beaucoup de vues existent pour mesurer et évaluer l'évolution du projet.

Dans la première manipulation, nous avons supprimé un ancien controller qui avait été simplement commenté lors de l'opération de déplacement (passant les issues de 50 à 49). En fonction du projet et des problématiques rencontrées, on peut facilement suivre l'évolution sur des metrics pertinentes:

![Analyse des metrics avec SonarQube](/0-sonarqube/sonarqube_metrics.png)

_Sur cette vue sont représentées les lignes commentées (en baisse suite au correctif – de 316 à 295) ainsi que les blocs dupliqués (aucun)._

### Code complexity

L'outil propose une visualisation de la dette technique où il mesure le temps nécessaire à la résolution des issues (Effort de remédiation) qu'il a relevées:

![Vue Technical Debt de SonarQube](/0-sonarqube/sonarqube_technical_debt.png)

On peut affiner la compréhension de cette métrique globale avec la tag automatique de la complexité vue sous deux angles:
- la complexité cognitive: code difficile à comprendre
- la complexité cyclomatique: code moins performant à parcourir

![Vue Complexity de SonarQube](/0-sonarqube/sonarqube_complexity.png)

Par ces aspects, SonarQube aide à réduire la dette technique, ce qui limite la complexité du code et, par extension, l'énergie nécessaire pour le maintenir et l'exécuter. Ce qui permet d'assurer une démarche de **Green Code**.

## Perspectives

La prochaine étape serait l'automatisation de ce scan via une pipeline CI/CD (GitHub Actions ou GitLab CI) pour bloquer automatiquement tout merge ne respectant pas le Quality Gate défini. Au-delà des aspects de lint/formattage (usage de prettier/eslint), de scan de vulnérabilités (où je me repose actuellement sur GitHub Dependabot principalement, analyse portée donc que sur les dépendances aux bibliothèques tierces) et de vue des test coverage, SonarQube propose une approche intégrée d'analyse statique, sans pour autant avoir l'air d'être un outil "usine-à-gaz", qui fournirait une profusion de KPIs au détriment de la clarté des informations nécessaires au pilotage de la base de code.