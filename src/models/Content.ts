import { query } from "@/lib/db";

export interface TermsSectionRow {
  id: number;
  section_id: string;
  title: string;
  content: string;
  sort_order: number;
  updated_at: Date;
}

export interface PolicySectionRow {
  id: number;
  section_id: string;
  title: string;
  content: string;
  sort_order: number;
  updated_at: Date;
}

function toTermsCamel(r: TermsSectionRow) {
  return { id: r.section_id, title: r.title, content: r.content };
}
function toPolicyCamel(r: PolicySectionRow) {
  return { id: r.section_id, title: r.title, content: r.content };
}

export async function findAllTermsSections() {
  const { rows } = await query<TermsSectionRow>(
    "SELECT * FROM terms_sections ORDER BY sort_order ASC, id ASC"
  );
  return rows.map(toTermsCamel);
}

export async function updateTermsSection(sectionId: string, data: { title?: string; content?: string }) {
  const { rows } = await query<TermsSectionRow>(
    `UPDATE terms_sections SET title = COALESCE($2, title), content = COALESCE($3, content), updated_at = NOW()
     WHERE section_id = $1 RETURNING *`,
    [sectionId, data.title, data.content]
  );
  return rows[0] ? toTermsCamel(rows[0]) : null;
}

export async function upsertTermsSection(sectionId: string, title: string, content: string, sortOrder: number) {
  const { rows } = await query<TermsSectionRow>(
    `INSERT INTO terms_sections (section_id, title, content, sort_order)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (section_id) DO UPDATE SET title = $2, content = $3, sort_order = $4, updated_at = NOW()
     RETURNING *`,
    [sectionId, title, content, sortOrder]
  );
  return rows[0] ? toTermsCamel(rows[0]) : null;
}

export async function findAllPolicySections() {
  const { rows } = await query<PolicySectionRow>(
    "SELECT * FROM policy_sections ORDER BY sort_order ASC, id ASC"
  );
  return rows.map(toPolicyCamel);
}

export async function updatePolicySection(sectionId: string, data: { title?: string; content?: string }) {
  const { rows } = await query<PolicySectionRow>(
    `UPDATE policy_sections SET title = COALESCE($2, title), content = COALESCE($3, content), updated_at = NOW()
     WHERE section_id = $1 RETURNING *`,
    [sectionId, data.title, data.content]
  );
  return rows[0] ? toPolicyCamel(rows[0]) : null;
}

export async function upsertPolicySection(sectionId: string, title: string, content: string, sortOrder: number) {
  const { rows } = await query<PolicySectionRow>(
    `INSERT INTO policy_sections (section_id, title, content, sort_order)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (section_id) DO UPDATE SET title = $2, content = $3, sort_order = $4, updated_at = NOW()
     RETURNING *`,
    [sectionId, title, content, sortOrder]
  );
  return rows[0] ? toPolicyCamel(rows[0]) : null;
}
