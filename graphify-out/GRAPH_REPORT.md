# Graph Report - Arquite  (2026-11-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 201 nodes · 569 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8

## God Nodes (most connected - your core abstractions)
1. `DataRepository` - 30 edges
2. `JourneyData` - 21 edges
3. `Button()` - 19 edges
4. `Card()` - 19 edges
5. `compilerOptions` - 19 edges
6. `react` - 18 edges
7. `Badge()` - 17 edges
8. `UserProfile` - 14 edges
9. `isValidNarrative()` - 14 edges
10. `App()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `DataRepository` --references--> `ReplacementConsent`  [EXTRACTED]
  src/lib/storage.ts → src/types/domain.ts
- `DataRepository` --references--> `JourneyData`  [EXTRACTED]
  src/lib/storage.ts → src/types/domain.ts
- `DataRepository` --references--> `UserProfile`  [EXTRACTED]
  src/lib/storage.ts → src/types/domain.ts
- `ExplorationComparisonItem` --references--> `ContextKey`  [EXTRACTED]
  src/domain/comparison.ts → src/types/domain.ts
- `ExplorationMeta` --references--> `ContextKey`  [EXTRACTED]
  src/domain/constants.ts → src/types/domain.ts

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (24): lucide-react, react, App(), Badge(), BadgeProps, Button(), ButtonProps, Card() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (29): calculateDiamondProgress(), calculateGlobalProgress(), calculateInterventionsProgress(), calculateLettersProgress(), calculateThresholdsProgress(), CANONICAL_THRESHOLDS, createInitialInterventions(), createInitialThresholds() (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (25): name, private, scripts, build, dev, preview, type, version (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.21
Nodes (3): DataRepository, AuditEvent, Dimension

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (14): ChoiceComparisonItem, compareDiamondVersions(), computeDiff(), DiffStatus, ExplorationComparisonItem, CANONICAL_STAGES, ExplorationMeta, DiamondComparisonViewProps (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (12): AppHeader(), AppHeaderProps, NavTab, AdminViewProps, DiamondViewProps, InterventionsViewProps, LettersViewProps, PanoramaViewProps (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (12): dependencies, clsx, lucide-react, motion, @radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-tabs, @radix-ui/react-tooltip (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (9): devDependencies, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom, typescript, vite (+1 more)

## Knowledge Gaps
- **12 isolated node(s):** `clsx`, `motion`, `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip` (+7 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 76 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 0` to `Community 1`, `Community 2`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **What connects `clsx`, `motion`, `@radix-ui/react-accordion` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12773109243697478 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Community 0` to `Community 2`, `Community 6`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07126436781609195 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Community 7` to `Community 2`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._