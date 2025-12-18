-- TasteFlow - Hardening pós-migração (Supabase/Postgres)
-- Objetivo: eliminar NULLs em colunas booleanas que quebram filtros (ex.: WHERE "IsActive" AND NOT "IsDeleted")
-- e padronizar DEFAULTs para reduzir instabilidade e “bugs fantasma” em todos os módulos.
--
-- Como usar:
-- 1) Rode primeiro a seção "Diagnóstico" (não altera nada) e veja quais tabelas estão com NULL.
-- 2) Rode a seção "Correção segura" (UPDATE + DEFAULT).
-- 3) Se estiver tudo ok, rode opcionalmente "Enrijecer schema" (SET NOT NULL).
--
-- Observação: este script assume schema "public" e colunas com nomes exatos "IsActive" e "IsDeleted"
-- (PascalCase, comuns em migrations do EF).

/* =========================
   Diagnóstico (read-only)
   ========================= */
DO $$
DECLARE
  r RECORD;
  sql TEXT;
BEGIN
  RAISE NOTICE '--- Diagnóstico: NULLs em booleanos (IsActive/IsDeleted) ---';

  FOR r IN
    SELECT c.table_schema, c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.data_type = 'boolean'
      AND c.column_name IN ('IsActive', 'IsDeleted')
    GROUP BY c.table_schema, c.table_name
    ORDER BY c.table_schema, c.table_name
  LOOP
    sql := format(
      'SELECT ''%s.%s'' AS table, ' ||
      '(SELECT COUNT(*) FROM %I.%I WHERE "IsActive" IS NULL) AS isactive_nulls, ' ||
      '(SELECT COUNT(*) FROM %I.%I WHERE "IsDeleted" IS NULL) AS isdeleted_nulls;',
      r.table_schema, r.table_name,
      r.table_schema, r.table_name,
      r.table_schema, r.table_name
    );

    BEGIN
      EXECUTE sql;
    EXCEPTION
      WHEN undefined_column THEN
        -- a tabela pode ter só uma das colunas; vamos ignorar no diagnóstico agregado
        NULL;
    END;
  END LOOP;
END $$;

/* =========================
   Correção segura (UPDATE + DEFAULT)
   ========================= */
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE '--- Correção: UPDATE NULLs + DEFAULTs ---';

  -- IsActive: NULL -> true, DEFAULT true
  FOR r IN
    SELECT c.table_schema, c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.data_type = 'boolean'
      AND c.column_name = 'IsActive'
    ORDER BY c.table_schema, c.table_name
  LOOP
    EXECUTE format('UPDATE %I.%I SET "IsActive" = true WHERE "IsActive" IS NULL;', r.table_schema, r.table_name);
    EXECUTE format('ALTER TABLE %I.%I ALTER COLUMN "IsActive" SET DEFAULT true;', r.table_schema, r.table_name);
  END LOOP;

  -- IsDeleted: NULL -> false, DEFAULT false
  FOR r IN
    SELECT c.table_schema, c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.data_type = 'boolean'
      AND c.column_name = 'IsDeleted'
    ORDER BY c.table_schema, c.table_name
  LOOP
    EXECUTE format('UPDATE %I.%I SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;', r.table_schema, r.table_name);
    EXECUTE format('ALTER TABLE %I.%I ALTER COLUMN "IsDeleted" SET DEFAULT false;', r.table_schema, r.table_name);
  END LOOP;
END $$;

/* =========================
   Enrijecer schema (opcional): SET NOT NULL
   =========================
   Rode essa parte só depois de confirmar que não existem NULLs e que isso não vai quebrar integrações.
*/
-- DO $$
-- DECLARE
--   r RECORD;
-- BEGIN
--   RAISE NOTICE '--- Enrijecer: SET NOT NULL ---';
--   FOR r IN
--     SELECT c.table_schema, c.table_name, c.column_name
--     FROM information_schema.columns c
--     WHERE c.table_schema = 'public'
--       AND c.data_type = 'boolean'
--       AND c.column_name IN ('IsActive', 'IsDeleted')
--     ORDER BY c.table_schema, c.table_name, c.column_name
--   LOOP
--     EXECUTE format('ALTER TABLE %I.%I ALTER COLUMN "%s" SET NOT NULL;', r.table_schema, r.table_name, r.column_name);
--   END LOOP;
-- END $$;


