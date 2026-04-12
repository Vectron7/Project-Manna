# Métricas de Saúde, Fluxo e Qualidade

Este documento descreve as métricas adotadas no projeto **Pop-up Abençoado** para acompanhar a saúde do processo de desenvolvimento, a qualidade do software e a experiência do usuário.

---

## DORA Metrics

O framework **DORA** (*DevOps Research and Assessment*) é usado para medir a saúde do fluxo de entrega.

| Métrica | Sigla | Meta |
| ------- | ----- | ---- |
| Deploy Frequency | DF | ≥ 1 deploy/semana |
| Lead Time for Changes | LT | < 72 horas |
| Change Failure Rate | CFR | < 45 % |
| Mean Time To Recovery | MTTR | < 1 dia |

### Deploy Frequency (DF)

**Definição:** Frequência com que o código é entregue em produção.

**Coleta:** Contagem de disparos do pipeline de deploy na branch `main` via GitHub Actions.

**Meta:** Mínimo de **1 deploy por semana**.

---

### Lead Time (LT)

**Definição:** Tempo médio entre o primeiro commit de uma tarefa e sua chegada em produção.

**Coleta:** `timestamp do merge commit` − `timestamp do primeiro commit da branch`. Extraído via API do Git.

**Meta:** Menor que **72 horas**.

---

### Change Failure Rate (CFR)

**Definição:** Percentual de deploys que resultam em falhas — bugs críticos, rollback ou necessidade de hotfix.

**Coleta:**

```.
CFR = (Número de Hotfixes / Total de Deploys) × 100
```

Hotfixes são identificados por PRs com a label `hotfix`.

**Meta:** Menor que **45 %**.

---

### Mean Time To Recovery (MTTR)

**Definição:** Tempo médio para restaurar o serviço após uma falha em produção.

**Coleta:** Intervalo entre a abertura de um incidente e o deploy da correção.

**Meta:** Menor que **1 dia**.

---

## Métricas de Performance

| Métrica | Meta | Como medir |
| ------- | ---- | ---------- |
| Tempo de resposta total (frontend → API → frontend) | < 2 s | Devtools / logs de servidor |
| Tempo de inserção no banco de dados | < 100 ms | Log da API Route |

---

## Métricas de Recursos

| Métrica | Meta |
| ------- | ---- |
| Consumo de CPU (idle) | < 5 % |
| Consumo de RAM | < 150 MB |

---

## Métricas de Qualidade

| Métrica | Meta |
| ------- | ---- |
| Cobertura de testes automatizados | > 70 % |
| Bugs críticos em produção | 0 |

---

## Métricas de UX

| Métrica | Meta | Descrição |
| ------- | ---- | --------- |
| Tempo de interação com o popup | < 10 s | Intervalo entre exibição do popup e envio do humor |
| Taxa de respostas bem-sucedidas | > 90 % | Requisições ao `/api/mood` que retornam `HTTP 200` |

---

## Referências

- [DORA State of DevOps Report](https://dora.dev)
- [Google Cloud — DORA Metrics](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)
