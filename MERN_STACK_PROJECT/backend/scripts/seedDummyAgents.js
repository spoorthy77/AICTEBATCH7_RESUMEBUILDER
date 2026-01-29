/**
 * Generate Dummy Names Script
 * This script creates 100 unique first names and saves them to a CSV file
 *
 * Usage: node scripts/seedDummyAgents.js
 */

// Generate random data functions
const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily',
  'James', 'Maria', 'William', 'Jennifer', 'Christopher', 'Linda', 'Daniel',
  'Patricia', 'Matthew', 'Susan', 'Anthony', 'Margaret', 'Mark', 'Dorothy',
  'Steven', 'Barbara', 'Paul', 'Karen', 'Andrew', 'Nancy', 'Joshua', 'Betty',
  'Kevin', 'Helen', 'Brian', 'Sandra', 'George', 'Donna', 'Edward', 'Carol',
  'Ronald', 'Ruth', 'Timothy', 'Sharon', 'Jason', 'Michelle', 'Jeffrey', 'Laura',
  'Ryan', 'Kimberly', 'Nicholas', 'Deborah', 'Gary', 'Jessica', 'Eric', 'Angela',
  'Jonathan', 'Shirley', 'Stephen', 'Melissa', 'Larry', 'Brenda', 'Justin',
  'Amy', 'Scott', 'Anna', 'Brandon', 'Rebecca', 'Samuel', 'Virginia', 'Gregory',
  'Kathleen', 'Alexander', 'Pamela', 'Patrick', 'Martha', 'Jack', 'Debra',
  'Dennis', 'Amanda', 'Jerry', 'Stephanie', 'Tyler', 'Carolyn', 'Aaron',
  'Christine', 'Jose', 'Marie', 'Adam', 'Janet', 'Nathan', 'Catherine',
  'Henry', 'Frances', 'Douglas', 'Ann', 'Zachary', 'Joyce', 'Peter', 'Diane'
];

function generateName() {
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

const seedDummyAgents = async () => {
  try {
    console.log('Generating 100 dummy names...');

    const names = [];
    const usedNames = new Set();

    for (let i = 1; i <= 100; i++) {
      let name;

      // Ensure unique names
      do {
        name = generateName();
      } while (usedNames.has(name));

      usedNames.add(name);
      names.push(name);

      if (i % 10 === 0) {
        console.log(`Generated ${i} names...`);
      }
    }

    // Create CSV content
    let csvContent = 'Name\n';
    names.forEach(name => {
      csvContent += `"${name}"\n`;
    });

    // Write to CSV file
    const fs = require('fs');
    const csvPath = './../../data/dummy-names.csv';

    console.log('Writing to CSV file...');
    console.log('CSV path:', csvPath);
    console.log('CSV content length:', csvContent.length);

    fs.writeFileSync(csvPath, csvContent);

    console.log('File written successfully!');

    console.log('\n✅ Successfully generated 100 dummy names!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📄 CSV file saved to: ${csvPath}`);
    console.log('\nSample names:');
    names.slice(0, 10).forEach((name, i) => {
      console.log(`${i+1}. ${name}`);
    });
    console.log('...');
    console.log('\n⚠ All names are unique first names only.');
    console.log('⚠ No emails, passwords, or mobile numbers generated.');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error generating names:', error.message);
    process.exit(1);
  }
};

// Run the seeding function
seedDummyAgents();