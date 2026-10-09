# Project Engineering Rules / Reglas de ingenieria del proyecto

These project rules operationalize the approved standards in [`../../verificacions-phase2.md`](../../verificacions-phase2.md) and the contributor workflow in [`../../AGENTS.md`](../../AGENTS.md). Both language versions are normative and must remain equivalent.

Estas reglas concretan los estandares aprobados en [`../../verificacions-phase2.md`](../../verificacions-phase2.md) y el flujo para colaboradores definido en [`../../AGENTS.md`](../../AGENTS.md). Ambas versiones son normativas y deben mantenerse equivalentes.

Each rule states its name, scope, justification, project-specific guidance, and repository evidence. Treat evidence as a snapshot of the current implementation, not as a reason to preserve a known mismatch.

Cada regla indica nombre, alcance, justificacion, guia especifica del proyecto y evidencia del repositorio. La evidencia describe el estado actual; no es motivo para conservar una inconsistencia conocida.

## 1. Source code language / Idioma del codigo fuente

- **Name / Nombre:** `source-code-in-english` / `codigo-fuente-en-ingles`
- **Scope / Alcance:** Source identifiers, comments, docstrings, technical messages, API names, and tests. User-facing text follows the product's selected locale. / Identificadores, comentarios, docstrings, mensajes tecnicos, nombres de API y pruebas. Los textos para usuarios siguen el idioma elegido para el producto.
- **Justification / Justificacion:** Consistent technical language improves searchability and collaboration across the codebase. / Un idioma tecnico uniforme facilita busqueda y colaboracion en todo el codigo.
- **Project guidance / Guia especifica:** Use English names and technical text in frontend and backend. Do not translate API field names or domain identifiers; keep customer-facing UI copy separate from source-code language. / Usa nombres y textos tecnicos en ingles en frontend y backend. No traduzcas nombres de campos API ni identificadores de dominio; separa el idioma del codigo del texto visible para usuarios.
- **Repository evidence / Evidencia:** API literals and model fields are English in [routes.py](../../backend/app/routes.py); dashboard labels are English in [kpi-row.tsx](../../frontend/src/components/dashboard/kpi-row.tsx).

## 2. Bilingual project documentation / Documentacion bilingue

- **Name / Nombre:** `bilingual-project-docs` / `documentacion-bilingue`
- **Scope / Alcance:** Project-authored documentation for setup, contribution, operation, and standards. / Documentacion del proyecto sobre instalacion, colaboracion, operacion y estandares.
- **Justification / Justificacion:** Contributors can use either project language without documentation drifting between versions. / Los colaboradores pueden usar cualquiera de los idiomas sin que las versiones documentales diverjan.
- **Project guidance / Guia especifica:** Provide English and Spanish sections in one file or a paired file. Update both in the same change, preserving equivalent facts, commands, links, and section coverage. / Incluye secciones en ingles y espanol en un mismo archivo o en archivos pareados. Actualiza ambos en el mismo cambio y conserva equivalencia de hechos, comandos, enlaces y secciones.
- **Repository evidence / Evidencia:** [README.md](../../README.md) and [README.es.md](../../README.es.md) link to each other; this rule file and [AGENTS.md](../../AGENTS.md) also contain both languages.

## 3. Naming conventions / Convenciones de nombres

- **Name / Nombre:** `idiomatic-naming` / `nombres-idiomaticos`
- **Scope / Alcance:** Source filenames, components, types, functions, variables, and tests. / Nombres de archivos, componentes, tipos, funciones, variables y pruebas.
- **Justification / Justificacion:** Language-idiomatic names make existing code easier to read and extend. / Los nombres idiomaticos hacen que el codigo existente sea mas facil de leer y ampliar.
- **Project guidance / Guia especifica:** Use PascalCase for React components and exported types, kebab-case for component filenames, camelCase for TypeScript variables and functions, and snake_case for Python functions and variables. Use `test_*.py` for backend tests and `*.test.ts` or `*.test.tsx` for frontend tests. / Usa PascalCase para componentes React y tipos exportados, kebab-case para nombres de archivos de componentes, camelCase para variables y funciones TypeScript, y snake_case para funciones y variables Python. Usa `test_*.py` para pruebas backend y `*.test.ts` o `*.test.tsx` para frontend.
- **Repository evidence / Evidencia:** [kpi-card.tsx](../../frontend/src/components/dashboard/kpi-card.tsx) exports `KPICard`; [routes.py](../../backend/app/routes.py) defines `generate_mock_movements`; tests include [test_routes.py](../../backend/tests/test_routes.py) and [financial-utils.test.ts](../../frontend/src/lib/financial-utils.test.ts).

## 4. Frontend responsibility boundaries / Limites de responsabilidad frontend

- **Name / Nombre:** `separate-ui-domain-and-types` / `separar-ui-dominio-y-tipos`
- **Scope / Alcance:** React screen composition, reusable components, domain calculations, and domain types. / Composicion de pantallas React, componentes reutilizables, calculos de dominio y tipos del dominio.
- **Justification / Justificacion:** Keeping responsibilities separate makes logic independently testable and prevents presentation components from accumulating business behavior. / Separar responsabilidades permite probar la logica de forma independiente y evita acumular reglas de negocio en componentes visuales.
- **Project guidance / Guia especifica:** Keep screen composition in `App.tsx` or feature entry components, calculations in `src/lib`, and shared domain types in the appropriate type module. Keep substantial financial calculations out of chart and card rendering code. / Mantiene la composicion en `App.tsx` o componentes de entrada de la funcionalidad, los calculos en `src/lib` y los tipos compartidos en el modulo correspondiente. Evita calculos financieros sustanciales dentro de tarjetas y graficas.
- **Repository evidence / Evidencia:** [App.tsx](../../frontend/src/App.tsx) composes the page; [financial-utils.ts](../../frontend/src/lib/financial-utils.ts) computes KPIs and monthly data; [financial-types.ts](../../frontend/src/lib/financial-types.ts) declares domain types.

## 5. Frontend feature structure / Estructura de funcionalidades frontend

- **Name / Nombre:** `group-components-by-feature` / `agrupar-componentes-por-funcionalidad`
- **Scope / Alcance:** Frontend components and shared UI primitives. / Componentes frontend y primitivas UI compartidas.
- **Justification / Justificacion:** Feature grouping keeps related UI discoverable while shared primitives avoid duplication. / Agrupar por funcionalidad facilita encontrar componentes relacionados y las primitivas compartidas evitan duplicaciones.
- **Project guidance / Guia especifica:** Put dashboard-specific components under `src/components/dashboard`; put broadly reusable primitives under `src/components/ui`. Keep the structure proportional to feature size; do not create extra abstraction layers for a single trivial component. / Coloca los componentes especificos del dashboard en `src/components/dashboard` y las primitivas reutilizables en `src/components/ui`. Mantiene la estructura proporcional al tamano de la funcionalidad y no crea capas adicionales para un componente trivial.
- **Repository evidence / Evidencia:** [kpi-row.tsx](../../frontend/src/components/dashboard/kpi-row.tsx) composes dashboard cards; [card.tsx](../../frontend/src/components/ui/card.tsx) is a shared UI primitive.

## 6. Backend module boundaries / Limites de modulos backend

- **Name / Nombre:** `explicit-api-boundaries-with-proportional-layers` / `limites-api-explicitos-y-capas-proporcionales`
- **Scope / Alcance:** FastAPI routes, request/response models, validation, and domain helpers. / Rutas FastAPI, modelos de entrada/salida, validacion y funciones auxiliares de dominio.
- **Justification / Justificacion:** Explicit API boundaries protect the contract; proportional module structure avoids both monolith growth and premature architecture. / Los limites explicitos protegen el contrato API; una estructura proporcional evita tanto el crecimiento desordenado como la arquitectura prematura.
- **Project guidance / Guia especifica:** Keep route parameters and response models explicit. Split routers or domain services when routes.py becomes difficult to navigate or responsibilities require independent ownership; do not add repository/service layers without a concrete use case. / Mantiene explicitos los parametros y modelos de respuesta. Separa routers o servicios cuando `routes.py` sea dificil de navegar o las responsabilidades necesiten gestion independiente; no agrega capas de repositorio/servicio sin un caso concreto.
- **Repository evidence / Evidencia:** [routes.py](../../backend/app/routes.py) currently contains models, data helpers, and endpoints; [main.py](../../backend/app/main.py) registers the router.

## 7. Typed API contracts / Contratos API tipados

- **Name / Nombre:** `validate-api-contracts` / `validar-contratos-api`
- **Scope / Alcance:** HTTP query parameters, request/response schemas, and frontend domain representations. / Parametros HTTP, esquemas de solicitud/respuesta y representaciones frontend del dominio.
- **Justification / Justificacion:** Typed, validated contracts catch invalid inputs and reduce accidental frontend/backend mismatch. / Los contratos tipados y validados detectan entradas invalidas y reducen diferencias accidentales entre frontend y backend.
- **Project guidance / Guia especifica:** Use Pydantic models and FastAPI `response_model` for API payloads, constrain finite values with `Literal` or equivalent validation, and update corresponding TypeScript types when the payload changes. / Usa modelos Pydantic y `response_model` de FastAPI para los payloads, restringe valores finitos con `Literal` u otra validacion equivalente y actualiza los tipos TypeScript cuando cambie el payload.
- **Repository evidence / Evidencia:** [routes.py](../../backend/app/routes.py) declares Pydantic response models and `Literal` filters; frontend shapes are in [financial-types.ts](../../frontend/src/lib/financial-types.ts).

## 8. Frontend imports and shared visual system / Imports y sistema visual frontend

- **Name / Nombre:** `reuse-configured-imports-and-ui` / `reutilizar-alias-e-interfaz-configurados`
- **Scope / Alcance:** Frontend imports, class composition, shared components, and theme values. / Imports frontend, composicion de clases, componentes compartidos y valores del tema.
- **Justification / Justificacion:** Reusing configured paths and visual tokens reduces brittle imports and inconsistent styling. / Reutilizar rutas y tokens visuales configurados reduce imports fragiles y estilos inconsistentes.
- **Project guidance / Guia especifica:** Use `@/` for imports rooted at `src`, `cn()` when merging conditional Tailwind classes, shared `Card`/`Skeleton` components where applicable, and existing CSS variables for colors. / Usa `@/` para imports desde `src`, `cn()` al combinar clases Tailwind condicionales, los componentes compartidos `Card`/`Skeleton` cuando apliquen y las variables CSS existentes para colores.
- **Repository evidence / Evidencia:** Alias configuration is in [vite.config.ts](../../frontend/vite.config.ts) and [tsconfig.app.json](../../frontend/tsconfig.app.json); `cn()` is in [utils.ts](../../frontend/src/lib/utils.ts); theme tokens are in [index.css](../../frontend/src/index.css).

## 9. Behavior-focused tests / Pruebas centradas en comportamiento

- **Name / Nombre:** `test-changed-behavior-at-its-layer` / `probar-el-comportamiento-en-su-capa`
- **Scope / Alcance:** Changed frontend calculations/components and backend helpers/endpoints. / Calculos/componentes frontend y funciones auxiliares/endpoints backend modificados.
- **Justification / Justificacion:** Tests at the owning layer provide focused regression coverage and make expected behavior explicit. / Las pruebas en la capa responsable ofrecen cobertura de regresion focalizada y explicitan el comportamiento esperado.
- **Project guidance / Guia especifica:** Put backend tests in `backend/tests/` and use pytest with FastAPI `TestClient` for route behavior. Place frontend unit tests beside the module they cover and use Vitest. Add cases for relevant boundaries and errors, not only happy-path response shape. / Coloca pruebas backend en `backend/tests/` y usa pytest con `TestClient` de FastAPI para rutas. Coloca pruebas unitarias frontend junto al modulo probado y usa Vitest. Agrega casos para limites y errores pertinentes, no solo para la forma de una respuesta exitosa.
- **Repository evidence / Evidencia:** [test_routes.py](../../backend/tests/test_routes.py) exercises routes and filters; [financial-utils.test.ts](../../frontend/src/lib/financial-utils.test.ts) tests frontend calculations and formatters.

## 10. Honest verification reporting / Informes honestos de verificacion

- **Name / Nombre:** `report-only-executed-checks` / `informar-solo-comprobaciones-ejecutadas`
- **Scope / Alcance:** Agent and contributor summaries of validation. / Resumenes de validacion de agentes y colaboradores.
- **Justification / Justificacion:** Clear evidence distinguishes code inspection from runtime behavior and prevents unsupported claims. / La evidencia clara distingue la inspeccion del codigo del comportamiento en ejecucion y evita afirmaciones sin respaldo.
- **Project guidance / Guia especifica:** State which checks were run, their commands, and results. Label static review and existing-but-unrun tests accurately; never call an unrun test passing. / Indica que comprobaciones se ejecutaron, sus comandos y resultados. Identifica correctamente la revision estatica y los tests existentes pero no ejecutados; nunca afirmes que paso un test que no corriste.
- **Repository evidence / Evidencia:** [verifications.md](../../verifications.md) records a static review and explicitly states tests were not executed.

## 11. Synthetic data boundaries / Limites de datos sinteticos

- **Name / Nombre:** `keep-mocks-out-of-production-data-flows` / `mantener-mocks-fuera-de-flujos-de-produccion`
- **Scope / Alcance:** Demo generators, fixtures, and mock datasets. / Generadores de demo, fixtures y conjuntos mock.
- **Justification / Justificacion:** Demo data must not be mistaken for real financial records or become an undocumented source of truth. / Los datos de demo no deben confundirse con registros financieros reales ni convertirse en una fuente de verdad no documentada.
- **Project guidance / Guia especifica:** Mark generated/fixture data as demo or test data, keep one intentional source per active flow, and make data provenance clear in UI/documentation. / Marca los datos generados/fixtures como datos de demo o prueba, conserva una fuente intencional por flujo activo y aclara su procedencia en la interfaz/documentacion.
- **Repository evidence / Evidencia:** [routes.py](../../backend/app/routes.py) generates seeded data; [mock-data.ts](../../frontend/src/lib/mock-data.ts) is not imported by the active flow in [App.tsx](../../frontend/src/App.tsx).

## 12. Local development entry point / Punto de entrada de desarrollo local

- **Name / Nombre:** `document-compose-as-local-entrypoint` / `documentar-compose-como-punto-de-entrada-local`
- **Scope / Alcance:** Local setup and service access instructions. / Instrucciones de instalacion local y acceso a servicios.
- **Justification / Justificacion:** A repeatable entry point shortens onboarding and keeps environments aligned. / Un punto de entrada repetible facilita la incorporacion y mantiene alineados los entornos.
- **Project guidance / Guia especifica:** Keep `docker compose up --build`, service URLs, API docs URL, and any required environment configuration in both README languages. / Mantiene `docker compose up --build`, URL de servicios, URL de documentacion API y configuracion de entorno necesaria en ambos README.
- **Repository evidence / Evidencia:** [docker-compose.yml](../../docker-compose.yml) defines frontend/backend services; [README.md](../../README.md) and [README.es.md](../../README.es.md) document the launch command.

## 13. Secrets and environment configuration / Secretos y configuracion de entorno

- **Name / Nombre:** `never-hardcode-secrets-or-deployment-values` / `no-hardcodear-secretos-ni-valores-de-despliegue`
- **Scope / Alcance:** Source, tests, documentation, fixtures, configuration, and logs. / Codigo fuente, pruebas, documentacion, fixtures, configuracion y logs.
- **Justification / Justificacion:** Hardcoded credentials or environment-specific values can leak and make deployments unsafe or difficult to change. / Las credenciales o valores especificos del entorno hardcodeados pueden filtrarse y volver inseguros o dificiles de cambiar los despliegues.
- **Project guidance / Guia especifica:** Never commit real credentials, tokens, API keys, private URLs, or environment-specific secrets. Read them from environment variables or an approved secret store; commit placeholders/examples only, and do not print secret values in logs or reports. / Nunca versiona credenciales reales, tokens, claves API, URL privadas ni secretos especificos del entorno. Leelos desde variables de entorno o un gestor aprobado; versiona solo ejemplos/placeholders y no imprimas secretos en logs ni informes.
- **Repository evidence / Evidencia:** [.gitignore](../../.gitignore) excludes `.env` and `.env.*` while allowing `.env.example`; [README.md](../../README.md) documents `VITE_API_BASE_URL`.

## 14. Secure production configuration / Configuracion segura de produccion

- **Name / Nombre:** `separate-development-and-production-security-settings` / `separar-configuracion-segura-de-desarrollo-y-produccion`
- **Scope / Alcance:** CORS, debug servers, autoreload, ports, and deployment configuration. / CORS, servidores de depuracion, autoreload, puertos y configuracion de despliegue.
- **Justification / Justificacion:** Development conveniences can expose services or weaken security if copied into production. / Las facilidades de desarrollo pueden exponer servicios o debilitar la seguridad si se trasladan a produccion.
- **Project guidance / Guia especifica:** Restrict CORS to approved origins outside local development. Disable debugpy, autoreload, and debug ports in production. Keep deployment-specific values out of source and make environment mode explicit. / Restringe CORS a origenes aprobados fuera del desarrollo local. Desactiva debugpy, autoreload y puertos de depuracion en produccion. Mantiene los valores de despliegue fuera del codigo y explicita el modo de entorno.
- **Repository evidence / Evidencia:** [main.py](../../backend/app/main.py) currently configures wildcard CORS; [backend/Dockerfile](../../backend/Dockerfile) starts Uvicorn with autoreload and debugpy. These are development settings, not production defaults.

## 15. AI-assisted change discipline / Disciplina de cambios asistidos por IA

- **Name / Nombre:** `ground-ai-changes-in-repository-context` / `basar-cambios-de-ia-en-el-contexto-del-repositorio`
- **Scope / Alcance:** Coding agents analyzing, editing, testing, and reporting repository changes. / Agentes de codigo que analizan, editan, prueban e informan cambios del repositorio.
- **Justification / Justificacion:** Context-grounded, narrow changes reduce hallucinated behavior, unrelated refactors, and accidental loss of user work. / Los cambios acotados y basados en contexto reducen comportamiento inventado, refactorizaciones ajenas y perdida accidental de trabajo del usuario.
- **Project guidance / Guia especifica:** Follow [AGENTS.md](../../AGENTS.md) and this rules file first. Read the owning implementation and nearby tests before editing; state the behavior hypothesis; make the smallest relevant change; preserve unrelated/user modifications; run the cheapest focused check; report uncertainty and actual results. Do not invent APIs or claim support based only on unused code. / Sigue primero [AGENTS.md](../../AGENTS.md) y este archivo. Lee la implementacion responsable y las pruebas cercanas antes de editar; define la hipotesis de comportamiento; realiza el cambio relevante mas pequeno; conserva cambios ajenos/del usuario; ejecuta la comprobacion focalizada mas barata e informa incertidumbre y resultados reales. No inventes APIs ni afirmes soporte basandote solo en codigo sin uso.
- **Repository evidence / Evidencia:** [AGENTS.md](../../AGENTS.md) requires preserving existing user changes and reporting executed checks; [App.tsx](../../frontend/src/App.tsx) calls only `/api/metrics` although additional routes exist in [routes.py](../../backend/app/routes.py).

## 16. Verification reports are evidence / Los informes de verificacion son evidencia

- **Name / Nombre:** `keep-findings-separate-from-policy` / `separar-hallazgos-de-politicas`
- **Scope / Alcance:** Repository reviews, implementation inventories, and standards documents. / Revisiones del repositorio, inventarios de implementacion y documentos de estandares.
- **Justification / Justificacion:** Observed behavior can change; approved rules should remain explicit and independently maintainable. / El comportamiento observado puede cambiar; las reglas aprobadas deben mantenerse explicitas e independientes.
- **Project guidance / Guia especifica:** Use [verifications.md](../../verifications.md) for dated findings and evidence. Use this file for normative rules. When implementation changes, update evidence instead of silently rewriting policy. / Usa [verifications.md](../../verifications.md) para hallazgos fechados y evidencia. Usa este archivo para reglas normativas. Cuando cambie la implementacion, actualiza la evidencia en lugar de modificar la politica silenciosamente.
- **Repository evidence / Evidencia:** [verifications.md](../../verifications.md) labels its scope, static-review method, unexecuted tests, endpoint catalog, and limitations.

## Excluded in this phase / Excluido en esta fase

Do not add a mandatory automated formatting/lint policy or backend dependency-pinning policy based on this document. The team explicitly deferred both decisions.

No agregues una politica obligatoria de formato/lint automatizado ni de fijacion de dependencias backend basandote en este documento. El equipo aplazo explicitamente ambas decisiones.
