
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const workbook = XLSX.readFile('public/mof_org.xlsx');
const data = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

// Target divisions
const divisions = {
    'Europe': [],
    'Counter Terrorism': [],
    'Audit & Consular Affairs': [],
    'United Nations': []
};

// Extract personnel from each division
data.forEach(row => {
    const divisionName = row['ACDIS'] || row['__EMPTY']; // Column A
    const name = row['__EMPTY_3'] || row[Object.keys(row)[3]]; // Column D (Name)

    // Match divisions (case-insensitive includes)
    if (divisionName && name) {
        if (divisionName.toLowerCase().includes('europe') && divisions['Europe'].length < 5) {
            divisions['Europe'].push(name);
        } else if (divisionName.toLowerCase().includes('counter terrorism') && divisions['Counter Terrorism'].length < 5) {
            divisions['Counter Terrorism'].push(name);
        } else if ((divisionName.toLowerCase().includes('audit') || divisionName.toLowerCase().includes('consular')) && divisions['Audit & Consular Affairs'].length < 5) {
            divisions['Audit & Consular Affairs'].push(name);
        } else if (divisionName.toLowerCase().includes('united nations') && divisions['United Nations'].length < 5) {
            divisions['United Nations'].push(name);
        }
    }
});

// Output results
console.log('\n=== EXTRACTED PERSONNEL ===\n');
for (const [division, names] of Object.entries(divisions)) {
    console.log(`${division}:`);
    names.forEach((name, i) => {
        console.log(`  ${i + 1}. ${name}`);
    });
    console.log('');
}
