// Dossier Types
export interface DossierItem {
  id: string;
  title: string;
  type: 'REPORT' | 'MEMO' | 'BRIEF' | 'LOG' | 'BLUEPRINT' | 'TRANSCRIPT';
  date: string;
  classification: string;
  summary: string;
  content: string;
  tags: string[];
  fileName?: string;
}

export interface NodeData {
  id: string;
  label: string;
  type: 'PERSON' | 'ORG' | 'LOC' | 'FINANCE' | 'COMMS' | 'WEAPON';
  role?: string;
  threat?: number;
  details?: Record<string, string>;
  description?: string;
  dossier?: DossierItem[];
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'standard' | 'comms' | 'financial';
}

// -----------------------------------------------------------------------------
// FILE POOL - 25 Files (For original 9 nodes)
// -----------------------------------------------------------------------------
const mofaFiles = [
  { name: "5_4_2015.pdf", label: "Historic Archive 2015", type: "REPORT", role: "Archived Rec", date: "2015-05-04", desc: "Historic record from 2015 archives." },
  { name: "9_16_2025_MMC dt 25_11_25.pdf", label: "MMC Meeting 2025", type: "COMMS", role: "Meeting Log", date: "2025-11-25", desc: "Minutes of Meeting for MMC dated Nov 25." },
  { name: "Agreement Transfer of Sentenced Persons_FINAL CHECKED 28.11.25.docx", label: "Prisoner Transfer Agmt", type: "ORG", role: "Legal Doc", date: "2025-11-28", desc: "Final checked agreement for transfer of sentenced persons." },
  { name: "Allocation of PDA to IT _ Telecom.pdf", label: "IT & Telecom Allocation", type: "FINANCE", role: "Budget", date: "2025-06-15", desc: "Allocation of funds/resources to IT and Telecom sector." },
  { name: "Committee on the Visit of the President of Indonesia to Pakistan on 8_9 December 2025.pdf", label: "Indonesia Visit Comm.", type: "ORG", role: "Committee", date: "2025-12-05", desc: "Committee details for Indonesia President visit." },
  { name: "ETD Meeting Notice_ Nov 27_ 2025.pdf", label: "ETD Meeting Notice", type: "COMMS", role: "Notice", date: "2025-11-27", desc: "Notice for ETD meeting scheduled Nov 27." },
  { name: "ICPO meeting (1).pdf", label: "ICPO Coordination I", type: "ORG", role: "Meeting", date: "2025-10-10", desc: "International Criminal Police Organization meeting notes I." },
  { name: "ICPO meeting.pdf", label: "ICPO Coordination II", type: "ORG", role: "Meeting", date: "2025-10-12", desc: "International Criminal Police Organization meeting notes II." },
  { name: "Letter addressed to FS regarding 124th NMC to be held from 5 January 2026.pdf", label: "124th NMC Letter", type: "COMMS", role: "Official Letter", date: "2025-12-01", desc: "Letter to Foreign Secretary regarding 124th NMC meeting." },
  { name: "MOFA LETTER DATED 5_8_2025.pdf", label: "MOFA Directive Aug", type: "COMMS", role: "Directive", date: "2025-08-05", desc: "Official MOFA letter dated Aug 5, 2025." },
  { name: "Meeting Notice 28_11_2025.pdf", label: "Meeting Notice Nov", type: "COMMS", role: "Notice", date: "2025-11-28", desc: "General meeting notice for Nov 28." },
  { name: "Nov_Directive of the Committee on Indonesia.pdf", label: "Indonesia Directive", type: "ORG", role: "Directive", date: "2025-11-30", desc: "Directive from the Committee on Indonesia." },
  { name: "O.M dated 17_04_2025_Hungary Implementation.pdf", label: "Hungary Implementation", type: "ORG", role: "MoU Impl", date: "2025-04-17", desc: "Office Memo on Hungary agreement implementation." },
  { name: "O.M. dated 03.10.2025 to Secretaries (MoU_ Agreement signed during the visit of the President of Iran).pdf", label: "Iran MoU Implementation", type: "FINANCE", role: "Bilateral", date: "2025-10-03", desc: "OM regarding Iran President visit - MoU implementation." },
  { name: "PUC 11_2_2022.pdf", label: "PUC Record 2022", type: "REPORT", role: "Record", date: "2022-02-11", desc: "PUC record dated Feb 11, 2022." },
  { name: "Passport.pdf", label: "Subject Passport Scan", type: "PERSON", role: "Identity", date: "2024-01-15", desc: "Scanned passport copy of subject." },
  { name: "Pol_72025_Invitation for the PM (1).pdf", label: "PM Invitation (Copy)", type: "COMMS", role: "Invitation", date: "2025-07-20", desc: "Political invitation for PM - Copy." },
  { name: "Pol_72025_Invitation for the PM.pdf", label: "PM Invitation (Orig)", type: "COMMS", role: "Invitation", date: "2025-07-20", desc: "Political invitation for PM - Original." },
  { name: "Signed Minutes of 10th Pak_Russia IGC_compressed.pdf", label: "Pak-Russia IGC Minutes", type: "ORG", role: "Minutes", date: "2025-10-01", desc: "Signed minutes of 10th Pak-Russia IGC." },
  { name: "Ticket.pdf", label: "Travel Ticket", type: "LOC", role: "Travel", date: "2025-12-15", desc: "Flight ticket details." },
  { name: "UNIDROIT.pdf", label: "UNIDROIT Convention", type: "ORG", role: "Convention", date: "2024-05-20", desc: "UNIDROIT convention details." },
  { name: "appendix I (1).docx", label: "Appendix I (Supp)", type: "REPORT", role: "Appendix", date: "2025-11-20", desc: "Supplementary Appendix I document." },
  { name: "appendix I.docx", label: "Appendix I (Main)", type: "REPORT", role: "Appendix", date: "2025-11-20", desc: "Main Appendix I document." },
  { name: "tentative Visit of President of Indonesia.pdf", label: "Indonesia Visit Plan", type: "ORG", role: "Plan", date: "2025-11-15", desc: "Tentative plan for Indonesia President visit." },
  { name: "vetted draft 18.11.2025 (fair draft for MOFA).pdf", label: "Vetted MOFA Draft", type: "ORG", role: "Draft", date: "2025-11-18", desc: "Fair draft vetted for MOFA." }
] as const;

// Helper: Dates
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// Helper: File -> Dossier
const mofaFileToDossierItem = (file: typeof mofaFiles[number]): DossierItem => {
  return {
    id: `DOC-${Math.floor(Math.random() * 100000)}`,
    title: file.label.toUpperCase(),
    type: file.type === 'PERSON' ? 'BRIEF' : file.type === 'COMMS' ? 'MEMO' : 'REPORT',
    date: file.date,
    classification: "CONFIDENTIAL // NOFORN",
    summary: `Decrypted intelligence related to ${file.label}. Source credibility verified.`,
    content: `SUBJECT: ${file.label.toUpperCase()}\nDATE: ${file.date}\n\n1. CONTEXT\n${file.desc}\n\n2. KEY DATA\nFile contains critical details regarding subject interaction.\n\n3. ATTACHMENT\nAttached file: ${file.name}`,
    tags: [file.role, "verified", "mofa-intel"],
    fileName: file.name
  };
};

const distributeFilesToNodes = () => {
  const pendingFiles = [...mofaFiles];
  return (count: number) => {
    const selected = [];
    for (let i = 0; i < count; i++) {
      if (pendingFiles.length > 0) {
        const f = pendingFiles.shift();
        if (f) selected.push(mofaFileToDossierItem(f));
      }
    }
    return selected;
  };
};

const getFiles = distributeFilesToNodes();

// Helper: Generic dossier expansion
const generateDossierItems = (nodeType: string, label: string): DossierItem[] => {
  const items: DossierItem[] = [];
  const count = 5;
  for (let i = 0; i < count; i++) {
    items.push({
      id: `DOC-EXT-${Math.floor(Math.random() * 10000)}`,
      title: `FIELD REPORT: ${label} // ${['CONFIDENTIAL', 'SECRET'][Math.floor(Math.random() * 2)]}`,
      type: 'REPORT',
      date: getRandomDate(new Date(2024, 0, 1), new Date()),
      classification: "NOFORN",
      tags: ["Surveillance", nodeType],
      summary: `Document contains tactical data regarding ${label}. Verification in progress.`,
      content: `INTEL EXTRACT\n\nSUBJECT: ${label}\nTYPE: ${nodeType}\n\n1. SUMMARY\nObservations match baseline patterns. Continuous monitoring recommended.`
    });
  }
  return items;
};

// Helper: Asim Zaman Malik's 10-page Intelligence dossier
const generateAsimIntelFiles = (): DossierItem[] => {
  const files: DossierItem[] = [];

  // Page specific types/titles
  const pageTypes = [
    { title: "SOURCE CARD OVERVIEW", type: "REPORT" as const, tags: ["Overview", "Source-Card"] },
    { title: "BIOGRAPHICAL DATA", type: "REPORT" as const, tags: ["Bio", "Identity"] },
    { title: "OPERATIONAL HISTORY", type: "BRIEF" as const, tags: ["History", "Ops"] },
    { title: "COMMUNICATION LOGS", type: "LOG" as const, tags: ["Comms", "SIGINT"] },
    { title: "FINANCIAL ANALYSIS", type: "REPORT" as const, tags: ["Finance", "Audit"] },
    { title: "NETWORK MAPPING", type: "REPORT" as const, tags: ["Network", "Contacts"] },
    { title: "TRAVEL PATTERNS", type: "LOG" as const, tags: ["Movement", "Travel"] },
    { title: "SURVEILLANCE NOTES", type: "LOG" as const, tags: ["Surveillance", "Field"] },
    { title: "DIPLOMATIC BRIEF", type: "BRIEF" as const, tags: ["Diplomacy", "UN"] },
    { title: "STRATEGIC SUMMARY", type: "BRIEF" as const, tags: ["Strategy", "Intel"] }
  ];

  for (let i = 0; i < 10; i++) {
    const pageNum = i + 1;
    const pageType = pageTypes[i];

    const item: DossierItem = {
      id: `ASIM-PAGE-${pageNum}`,
      title: `${pageType.title} // PAGE ${pageNum}`,
      type: pageType.type,
      date: '2025-12-18',
      classification: "TOP SECRET // NOFORN",
      tags: [...pageType.tags, `Page-${pageNum}`, "Asim-Malik"],
      summary: `Intel extract from Page ${pageNum} of intercepted source card.`,
      content: `INTEL EXTRACT - PAGE ${pageNum}\n\nSUBJECT: Asim Zaman Malik\nSOURCE: Source Card - Asim Zaman Malik (N).pdf\n\n1. DATA ANALYSIS\nThis section contains detailed intelligence extracted from page ${pageNum} of the intercepted dossier. Observations align with identified risk patterns.`
    };

    if (i === 0) {
      item.title = "Download Source PDF & Overview";
      item.fileName = "Source Card - Asim Zaman Malik (N).pdf";
      item.content = `DOWNLOAD SOURCE PDF\n\n📄 Source Card - Asim Zaman Malik (N).pdf (13 pages)\n\n⬇️ [DOWNLOAD FULL PDF]\n\nOVERVIEW: Strategic intel for Asim Zaman Malik. UN Division Assistant Director. Active surveillance confirmed.\n\n--- CONTENT FROM PAGE 1 ---\nDetailed biographical data and threat analysis starts here. Initial source card entry for target.`;
    }

    if (i === 9) {
      item.summary += " Includes summary of pages 11-13.";
      item.content += `\n\n--- ADDITIONAL PAGES 11-13 SUMMARY ---\nPage 11: Future operational plans and potential contacts.\nPage 12: Detailed asset ledger and funding sources.\nPage 13: Final assessment and risk level confirmation. Subject has persistent links to regional multilateral networks. Annex data confirms asset liquidity.`;
    }

    files.push(item);
  }

  return files;
};

// -----------------------------------------------------------------------------
// INITIAL NODES
// -----------------------------------------------------------------------------

export const initialNodes: { data: NodeData }[] = [

  // --- Core 9 MOFA Nodes ---
  { data: { id: "ORG-MOFA-001", label: "Ministry of Foreign Affairs (MOFA)", type: "ORG", role: "Federal Ministry", threat: 48, description: "Pakistan's Ministry of Foreign Affairs responsible for diplomatic relations.", details: { "Headquarters": "Islamabad", "Status": "Active Surveillance" }, dossier: getFiles(3) } },
  { data: { id: "MOFA-FS-001", label: "Dr. Asad Majeed Khan", type: "PERSON", role: "Foreign Secretary", threat: 35, description: "Career diplomat serving as Foreign Secretary.", details: { "Designation": "Foreign Secretary", "Service": "PFS" }, dossier: getFiles(4) } },
  { data: { id: "MOFA-JS-002", label: "Joint Secretary (East Asia)", type: "PERSON", role: "JS East Asia", threat: 30, description: "Managing Indonesia President's visit.", details: { "Division": "East Asia", "Project": "Indonesia Visit" }, dossier: getFiles(3) } },
  { data: { id: "MOFA-JS-003", label: "Joint Secretary (Middle East)", type: "PERSON", role: "JS Middle East", threat: 32, description: "Overseeing Iran MoU implementation.", details: { "Division": "Middle East", "Project": "Iran MoU" }, dossier: getFiles(3) } },
  { data: { id: "MOFA-JS-001", label: "Joint Secretary (Europe)", type: "PERSON", role: "JS Europe", threat: 28, description: "Handles European affairs including Russia IGC.", details: { "Division": "Europe", "Project": "Russia IGC" }, dossier: getFiles(3) } },
  { data: { id: "LOC-MOFA-HQ", label: "MOFA HQ - Constitution Ave", type: "LOC", role: "Physical Location", threat: 25, description: "Physical premises of the Ministry.", details: { "Address": "Red Zone, Islamabad", "Security": "High" }, dossier: getFiles(2) } },
  { data: { id: "EVENT-INDO-001", label: "Indonesia President Visit", type: "ORG", role: "State Event", threat: 42, description: "High-level state visit event coordination.", details: { "Date": "Dec 8-9, 2025", "Priority": "High" }, dossier: getFiles(2) } },
  { data: { id: "FINANCE-IRAN-001", label: "Iran MoU Implementation", type: "FINANCE", role: "Financial Agreement", threat: 38, description: "Financial implementation of Iranian agreement.", details: { "Sector": "Trade/Energy", "Status": "Ongoing" }, dossier: getFiles(2) } },
  { data: { id: "COMMS-NMC-001", label: "124th NMC Meeting", type: "COMMS", role: "Committee Meeting", threat: 35, description: "Coordination for National Monitoring Committee.", details: { "Date": "Jan 5, 2026", "Type": "Inter-ministerial" }, dossier: getFiles(10) } },

  // --- Minister Root ---
  { data: { id: "MINISTER-001", label: "Minister: Ishaq Dar", type: "PERSON", role: "Minister Foreign Affairs", threat: 60, description: "Federal Minister of Foreign Affairs, Pakistan. Oversees all foreign policy.", details: { "Designation": "Federal Minister", "Party": "PML-N" }, dossier: [] } },

  // --- 4 Exclusive Divisions ---
  { data: { id: "DIV-EX-7", label: "Europe Division", type: "ORG", role: "Division", threat: 38, description: "Europe Division Affairs", details: {} } },
  { data: { id: "DIV-EX-11", label: "Counter Terrorism Division", type: "ORG", role: "Division", threat: 55, description: "CT & Security", details: {} } },
  { data: { id: "DIV-EX-12", label: "Audit & Consular Affairs", type: "ORG", role: "Division", threat: 20, description: "Audit & Consular Affairs", details: {} } },
  { data: { id: "DIV-EX-10", label: "United Nations", type: "ORG", role: "Division", threat: 36, description: "UN & Multilateral Affairs", details: {} } },

  // --- Personnel (5 per Division) ---

  // Europe Personnel
  { data: { id: "PER-EUR-1", label: "Irfan Ahmad", type: "PERSON", role: "Director Europe", threat: 10, description: "Europe Division personnel.", details: { "Designation": "Director" }, dossier: generateDossierItems('PERSON', 'Irfan Ahmad') } },
  { data: { id: "PER-EUR-2", label: "Nazia Shaikh", type: "PERSON", role: "Director", threat: 10, description: "Europe Division personnel.", details: { "Designation": "Director" }, dossier: generateDossierItems('PERSON', 'Nazia Shaikh') } },
  { data: { id: "PER-EUR-3", label: "Akbar Saeed", type: "PERSON", role: "Assistant Director", threat: 10, description: "Europe Division personnel.", details: { "Designation": "Assistant Director" }, dossier: generateDossierItems('PERSON', 'Akbar Saeed') } },
  { data: { id: "PER-EUR-4", label: "Shahbaz Hussain", type: "PERSON", role: "Deputy Director", threat: 10, description: "Europe Division personnel.", details: { "Designation": "Deputy Director" }, dossier: generateDossierItems('PERSON', 'Shahbaz Hussain') } },
  { data: { id: "PER-EUR-5", label: "Malik M Asim", type: "PERSON", role: "Section Officer", threat: 10, description: "Europe Division personnel.", details: { "Designation": "Section Officer" }, dossier: generateDossierItems('PERSON', 'Malik M Asim') } },

  // CT Personnel
  { data: { id: "PER-CT-1", label: "Dr. Fareha Bugti", type: "PERSON", role: "Director CT", threat: 45, description: "Counter Terrorism personnel.", details: { "Designation": "Director" }, dossier: generateDossierItems('PERSON', 'Dr. Fareha Bugti') } },
  { data: { id: "PER-CT-2", label: "Umer Javed", type: "PERSON", role: "Coordinator", threat: 30, description: "Counter Terrorism personnel.", details: { "Designation": "Coordinator" }, dossier: generateDossierItems('PERSON', 'Umer Javed') } },
  { data: { id: "PER-CT-3", label: "Saima Riaz", type: "PERSON", role: "Analyst", threat: 25, description: "Counter Terrorism personnel.", details: { "Designation": "Analyst" }, dossier: generateDossierItems('PERSON', 'Saima Riaz') } },
  { data: { id: "PER-CT-4", label: "Rizwan Ahmed", type: "PERSON", role: "Field Officer", threat: 40, description: "Counter Terrorism personnel.", details: { "Designation": "Field Officer" }, dossier: generateDossierItems('PERSON', 'Rizwan Ahmed') } },
  { data: { id: "PER-CT-5", label: "Farooq Malik", type: "PERSON", role: "Legal Advisor", threat: 20, description: "Counter Terrorism personnel.", details: { "Designation": "Legal Advisor" }, dossier: generateDossierItems('PERSON', 'Farooq Malik') } },

  // Audit Personnel
  { data: { id: "PER-AUD-1", label: "Wajid Ali Shah", type: "PERSON", role: "Chief Audit", threat: 15, description: "Audit & Consular personnel.", details: { "Designation": "Chief Auditor" }, dossier: generateDossierItems('PERSON', 'Wajid Ali Shah') } },
  { data: { id: "PER-AUD-2", label: "Rao Asif Iqbal", type: "PERSON", role: "Auditor", threat: 12, description: "Audit & Consular personnel.", details: { "Designation": "Auditor" }, dossier: generateDossierItems('PERSON', 'Rao Asif Iqbal') } },
  { data: { id: "PER-AUD-3", label: "Shahid Nawaz", type: "PERSON", role: "Accounts officer", threat: 10, description: "Audit & Consular personnel.", details: { "Designation": "Accounts" }, dossier: generateDossierItems('PERSON', 'Shahid Nawaz') } },
  { data: { id: "PER-AUD-4", label: "Sumaira Yousuf", type: "PERSON", role: "Auditor", threat: 12, description: "Audit & Consular personnel.", details: { "Designation": "Auditor" }, dossier: generateDossierItems('PERSON', 'Sumaira Yousuf') } },
  { data: { id: "PER-AUD-5", label: "M. Ammad Ashique", type: "PERSON", role: "Assistant", threat: 10, description: "Audit & Consular personnel.", details: { "Designation": "Assistant" }, dossier: generateDossierItems('PERSON', 'M. Ammad Ashique') } },

  // UN Personnel
  { data: { id: "PER-UN-1", label: "Faisal Hayat Khan", type: "PERSON", role: "Director UN", threat: 30, description: "United Nations personnel.", details: { "Designation": "Director" }, dossier: generateDossierItems('PERSON', 'Faisal Hayat Khan') } },
  { data: { id: "PER-UN-2", label: "Muhammad Faisal Fayyaz", type: "PERSON", role: "Deputy Director", threat: 25, description: "United Nations personnel.", details: { "Designation": "Deputy Director" }, dossier: generateDossierItems('PERSON', 'Muhammad Faisal Fayyaz') } },
  { data: { id: "PER-UN-3", label: "Asim Zaman Malik", type: "PERSON", role: "Assistant Director", threat: 35, description: "UN Division Intelligence Target - 10 Intercepted Files", details: { "Designation": "Assistant Director", "Clearance": "TOP SECRET", "Status": "Active Surveillance" }, dossier: generateAsimIntelFiles() } },
  { data: { id: "PER-UN-4", label: "Muhammad Shahsawar", type: "PERSON", role: "Section Officer", threat: 15, description: "United Nations personnel.", details: { "Designation": "Section Officer" }, dossier: generateDossierItems('PERSON', 'Muhammad Shahsawar') } },
  { data: { id: "PER-UN-5", label: "Yuman Azhar", type: "PERSON", role: "Desk Officer", threat: 15, description: "United Nations personnel.", details: { "Designation": "Desk Officer" }, dossier: generateDossierItems('PERSON', 'Yuman Azhar') } },

  // --- Abdul Rehman Khan Network (UNTOCUHED) ---
  { data: { id: "T-1001", label: "Abdul Rehman Khan", type: "PERSON", role: "High-Value Target", threat: 95, description: "Primary surveillance target. Suspected militant leader with extensive ISI connections.", details: { "Status": "Active Tracking", "Location": "AJK Region", "Threat Level": "Critical" }, dossier: generateDossierItems('PERSON', 'Abdul Rehman Khan') } },
  { data: { id: "P-002", label: "Col. Tariq Mehmood", type: "PERSON", role: "ISI Handler", threat: 78, description: "ISI intelligence officer. Known contact of Abdul Rehman Khan.", details: { "Agency": "ISI", "Rank": "Colonel", "Division": "External Operations" }, dossier: generateDossierItems('PERSON', 'Col. Tariq Mehmood') } },
  { data: { id: "P-003", label: "Maj. Imran Siddiqui", type: "PERSON", role: "Field Coordinator", threat: 72, description: "ISI field operative. Coordinates logistics for militant operations.", details: { "Agency": "ISI", "Rank": "Major", "Status": "Under Surveillance" }, dossier: generateDossierItems('PERSON', 'Maj. Imran Siddiqui') } },
  { data: { id: "O-001", label: "Al-Badr Front", type: "ORG", role: "Militant Organization", threat: 88, description: "Designated militant outfit operating in Kashmir region.", details: { "Type": "Militant Group", "Region": "AJK", "Status": "Banned" }, dossier: generateDossierItems('ORG', 'Al-Badr Front') } },
  { data: { id: "O-002", label: "Kashmir Relief Fund", type: "ORG", role: "Front Organization", threat: 65, description: "NGO suspected of channeling funds to militant groups.", details: { "Type": "NGO", "Status": "Flagged", "Registration": "Islamabad" }, dossier: generateDossierItems('ORG', 'Kashmir Relief Fund') } },
  { data: { id: "L-001", label: "Muzaffarabad Compound", type: "LOC", role: "Safe House", threat: 70, description: "Suspected training facility and safe house in Muzaffarabad.", details: { "Coordinates": "34.3703° N, 73.4711° E", "Status": "Active Monitoring" }, dossier: generateDossierItems('LOC', 'Muzaffarabad Compound') } },
  { data: { id: "F-001", label: "Account #8812-PKR", type: "FINANCE", role: "Suspicious Transaction", threat: 82, description: "Bank account flagged for suspicious fund transfers.", details: { "Bank": "Habib Bank Ltd", "Amount": "$245K", "Status": "Frozen" }, dossier: generateDossierItems('FINANCE', 'Account #8812-PKR') } },
];

export const initialEdges: { data: EdgeData }[] = [
  // Original Military Network
  { data: { id: "e1", source: "T-1001", target: "P-002", label: "COMMANDS" } },
  { data: { id: "e2", source: "T-1001", target: "P-003", label: "COMMANDS" } },
  { data: { id: "e3", source: "P-002", target: "O-001", label: "DIRECTS" } },
  { data: { id: "e4", source: "O-001", target: "O-002", label: "HANDLES" } },
  { data: { id: "e5", source: "T-1001", target: "L-001", label: "STATIONED_AT" } },
  { data: { id: "e6", source: "T-1001", target: "F-001", label: "FUNDS" } },

  // MOFA Network Connections
  { data: { id: "e7", source: "MOFA-FS-001", target: "ORG-MOFA-001", label: "HEADS" } },
  { data: { id: "e8", source: "MOFA-JS-001", target: "ORG-MOFA-001", label: "WORKS_AT" } },
  { data: { id: "e9", source: "MOFA-JS-002", target: "ORG-MOFA-001", label: "WORKS_AT" } },
  { data: { id: "e10", source: "MOFA-JS-003", target: "ORG-MOFA-001", label: "WORKS_AT" } },
  { data: { id: "e11", source: "ORG-MOFA-001", target: "LOC-MOFA-HQ", label: "OPERATES_FROM" } },

  // MOFA Project Connections
  { data: { id: "e12", source: "MOFA-JS-002", target: "EVENT-INDO-001", label: "COORDINATES" } },
  { data: { id: "e13", source: "MOFA-JS-003", target: "FINANCE-IRAN-001", label: "IMPLEMENTS" } },
  { data: { id: "e14", source: "MOFA-FS-001", target: "COMMS-NMC-001", label: "CHAIRS" } },

  // Cross-Network
  { data: { id: "e15", source: "ORG-MOFA-001", target: "T-1001", label: "COORDINATES_WITH" } },
  { data: { id: "e16", source: "ORG-MOFA-001", target: "O-001", label: "INTELLIGENCE_LIAISON" } },

  // MOFA to Minister
  { data: { id: "e-new-1", source: "ORG-MOFA-001", target: "MINISTER-001", label: "REPORTS_TO" } },

  // Minister to 4 Divisions ONLY
  { data: { id: "e-div-7", source: "MINISTER-001", target: "DIV-EX-7", label: "OVERSEES" } },
  { data: { id: "e-div-11", source: "MINISTER-001", target: "DIV-EX-11", label: "OVERSEES" } },
  { data: { id: "e-div-12", source: "MINISTER-001", target: "DIV-EX-12", label: "OVERSEES" } },
  { data: { id: "e-div-10", source: "MINISTER-001", target: "DIV-EX-10", label: "OVERSEES" } },

  // Europe Personnel
  { data: { id: "e-eur-1", source: "DIV-EX-7", target: "PER-EUR-1", label: "MEMBER" } },
  { data: { id: "e-eur-2", source: "DIV-EX-7", target: "PER-EUR-2", label: "MEMBER" } },
  { data: { id: "e-eur-3", source: "DIV-EX-7", target: "PER-EUR-3", label: "MEMBER" } },
  { data: { id: "e-eur-4", source: "DIV-EX-7", target: "PER-EUR-4", label: "MEMBER" } },
  { data: { id: "e-eur-5", source: "DIV-EX-7", target: "PER-EUR-5", label: "MEMBER" } },

  // CT Personnel
  { data: { id: "e-ct-1", source: "DIV-EX-11", target: "PER-CT-1", label: "MEMBER" } },
  { data: { id: "e-ct-2", source: "DIV-EX-11", target: "PER-CT-2", label: "MEMBER" } },
  { data: { id: "e-ct-3", source: "DIV-EX-11", target: "PER-CT-3", label: "MEMBER" } },
  { data: { id: "e-ct-4", source: "DIV-EX-11", target: "PER-CT-4", label: "MEMBER" } },
  { data: { id: "e-ct-5", source: "DIV-EX-11", target: "PER-CT-5", label: "MEMBER" } },

  // Audit Personnel
  { data: { id: "e-aud-1", source: "DIV-EX-12", target: "PER-AUD-1", label: "MEMBER" } },
  { data: { id: "e-aud-2", source: "DIV-EX-12", target: "PER-AUD-2", label: "MEMBER" } },
  { data: { id: "e-aud-3", source: "DIV-EX-12", target: "PER-AUD-3", label: "MEMBER" } },
  { data: { id: "e-aud-4", source: "DIV-EX-12", target: "PER-AUD-4", label: "MEMBER" } },
  { data: { id: "e-aud-5", source: "DIV-EX-12", target: "PER-AUD-5", label: "MEMBER" } },

  // UN Personnel
  { data: { id: "e-un-1", source: "DIV-EX-10", target: "PER-UN-1", label: "MEMBER" } },
  { data: { id: "e-un-2", source: "DIV-EX-10", target: "PER-UN-2", label: "MEMBER" } },
  { data: { id: "e-un-3", source: "DIV-EX-10", target: "PER-UN-3", label: "MEMBER" } },
  { data: { id: "e-un-4", source: "DIV-EX-10", target: "PER-UN-4", label: "MEMBER" } },
  { data: { id: "e-un-5", source: "DIV-EX-10", target: "PER-UN-5", label: "MEMBER" } },
];

// Search logic
export const searchNodes = (query: string) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return { nodes: initialNodes, edges: initialEdges };

  const searchGroups = {
    abdul: ['T-1001', 'P-002', 'P-003', 'O-001', 'O-002', 'L-001', 'F-001'],
    military: ['T-1001', 'P-002', 'P-003', 'O-001', 'O-002', 'L-001', 'F-001'],
    mofa: ['ORG-MOFA-001', 'MOFA-FS-001', 'MOFA-JS-001', 'MOFA-JS-002', 'MOFA-JS-003', 'LOC-MOFA-HQ', 'EVENT-INDO-001', 'FINANCE-IRAN-001', 'COMMS-NMC-001', 'MINISTER-001'],
  };

  let matchingNodeIds: string[] = [];
  for (const [key, nodeIds] of Object.entries(searchGroups)) {
    if (searchTerm.includes(key)) {
      matchingNodeIds = [...new Set([...matchingNodeIds, ...nodeIds])];
    }
  }

  if (matchingNodeIds.length === 0) {
    matchingNodeIds = initialNodes
      .filter(node =>
        node.data.label.toLowerCase().includes(searchTerm) ||
        node.data.description?.toLowerCase().includes(searchTerm) ||
        node.data.role?.toLowerCase().includes(searchTerm)
      )
      .map(node => node.data.id);
  }

  const filteredNodes = initialNodes.filter(node => matchingNodeIds.includes(node.data.id));
  const filteredEdges = initialEdges.filter(edge => matchingNodeIds.includes(edge.data.source) && matchingNodeIds.includes(edge.data.target));

  return { nodes: filteredNodes, edges: filteredEdges, searchTerm, matchCount: filteredNodes.length };
};

// Expansion function
export const generateExpansion = (sourceId: string) => {
  const newNodes: { data: NodeData }[] = [];
  const newEdges: { data: EdgeData }[] = [];
  const count = 3;
  for (let i = 0; i < count; i++) {
    const id = `N-EXT-${Math.floor(Math.random() * 100000)}`;
    const type = 'PERSON';
    newNodes.push({
      data: { id, label: `Asset ${id}`, type, role: "Field Asset", threat: 30, description: "Dynamically expanded node.", details: { "Linked To": sourceId }, dossier: generateDossierItems(type, `Asset ${id}`) }
    });
    newEdges.push({
      data: { id: `${sourceId}-${id}`, source: sourceId, target: id, label: "LINKED" }
    });
  }
  return { nodes: newNodes, edges: newEdges };
};
