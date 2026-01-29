const fs = require('fs');
const path = require('path');

// Function to generate dummy data
function generateDummyData(count, startPhone = 7001) {
  const firstNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eric', 'Fiona', 'George', 'Helen',
    'Ian', 'Julia', 'Kevin', 'Laura', 'Mike', 'Nancy', 'Oliver', 'Paula',
    'Quinn', 'Rachel', 'Steve', 'Tina', 'Ursula', 'Victor', 'Wendy', 'Xavier',
    'Yara', 'Zach', 'Aaron', 'Bella', 'Caleb', 'Daisy', 'Ethan', 'Faith',
    'Gavin', 'Hannah', 'Isaac', 'Jasmine', 'Kyle', 'Lily', 'Mason', 'Nora',
    'Owen', 'Piper', 'Quincy', 'Riley', 'Samuel', 'Tessa', 'Uriah', 'Violet',
    'Wyatt', 'Xena', 'Yosef', 'Zoe', 'Adrian', 'Brianna', 'Cameron', 'Delilah',
    'Elijah', 'Gabriella', 'Hunter', 'Isabella', 'Jackson', 'Katherine',
    'Liam', 'Madison', 'Nathan', 'Olivia', 'Parker', 'Quinn', 'Ryan', 'Sophia',
    'Tyler', 'Uma', 'Vincent', 'Willow', 'Xander', 'Yasmine', 'Zane', 'Abigail',
    'Benjamin', 'Charlotte', 'Daniel', 'Emma', 'Felix', 'Grace', 'Henry', 'Ivy',
    'Jacob', 'Kayla', 'Logan', 'Maya', 'Noah', 'Natalie', 'Oscar', 'Peyton',
    'Quentin', 'Rebecca', 'Sebastian', 'Samantha', 'Theodore', 'Taylor',
    'Ulysses', 'Valentina', 'William', 'Ximena', 'Yusuf', 'Zara'
  ];

  const notes = [
    'Morning call preferred', 'Email first before calling', 'Available weekends',
    'Decision maker', 'Technical contact', 'Finance department', 'HR representative',
    'Operations manager', 'Sales lead', 'Support team', 'Marketing director',
    'IT specialist', 'Account manager', 'Project coordinator', 'Customer service',
    'New client inquiry', 'Follow-up required', 'Contract renewal', 'Product demo scheduled',
    'Technical support needed', 'Billing question', 'Feature request', 'Complaint resolution',
    'Upgrade inquiry', 'Partnership discussion', 'Integration support', 'Training session',
    'Account setup', 'Data migration help', 'Performance issue', 'Security question',
    'API documentation', 'Custom development', 'Consultation request', 'Referral inquiry',
    'High priority lead', 'Follow up next week', 'Decision pending', 'Budget approved',
    'Technical review', 'Contract sent', 'Awaiting signature', 'Implementation phase',
    'Training scheduled', 'Support ticket', 'Billing inquiry', 'Feature demo', 'Upgrade path',
    'Integration planning', 'Data transfer', 'Security setup', 'Access control', 'User management',
    'Performance tuning', 'Optimization review', 'Monitoring setup', 'Alert configuration',
    'Backup strategy', 'Disaster recovery', 'System health check', 'Maintenance window',
    'Update schedule', 'Patch management', 'Version upgrade', 'Compatibility test',
    'Load testing', 'Stress testing', 'Security scan', 'Vulnerability check', 'Penetration test',
    'Code review', 'Quality assurance', 'UAT feedback', 'Beta testing', 'Production deployment',
    'Go-live support', 'Post-launch review', 'User feedback', 'Enhancement request',
    'Bug fix priority', 'Hotfix needed', 'Release planning', 'Roadmap discussion',
    'Strategy meeting', 'Annual review', 'Prefers morning calls', 'Available afternoons only',
    'Contact via email first', 'Decision maker for purchases', 'Technical queries',
    'Billing department', 'Product feedback', 'Partnership opportunities', 'Urgent response needed',
    'Training coordinator', 'Quality assurance', 'Legal department', 'Operations lead',
    'Regional manager', 'Procurement specialist'
  ];

  const data = ['FirstName,Phone,Notes'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const phone = `+1-555-${String(startPhone + i).padStart(4, '0')}`;
    const note = notes[i % notes.length];
    data.push(`${firstName},${phone},${note}`);
  }

  return data.join('\n');
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node generateDummyData.js <count> [startPhone]');
  process.exit(1);
}

const count = parseInt(args[0]);
const startPhone = args[1] ? parseInt(args[1]) : 7001;

// Generate data
const csvData = generateDummyData(count, startPhone);

// Write to file
const fileName = `test-data-${count}.csv`;
const filePath = path.join(__dirname, '../../data/test', fileName);

fs.writeFileSync(filePath, csvData, 'utf8');

console.log(`Generated ${count} dummy data entries in ${fileName}`);