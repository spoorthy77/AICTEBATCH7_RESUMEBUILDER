// Import required dependencies for file parsing
const csv = require('csv-parser');  // CSV parsing library
const XLSX = require('xlsx');       // Excel file parsing library
const fs = require('fs');           // File system operations

/**
 * Parse CSV file and extract data into an array of objects
 * Each row becomes an object with column headers as keys
 * @param {string} filePath - Absolute path to the CSV file to parse
 * @returns {Promise<Array>} Promise resolving to array of parsed records
 * @example
 * const data = await parseCSV('./file.csv');
 * // Returns: [{ FirstName: 'John', Phone: '+1-555-1234', Notes: '...' }, ...]
 */
exports.parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];                    // Array to store parsed records
    
    // Create read stream from file
    fs.createReadStream(filePath)
      // Pipe through CSV parser
      .pipe(csv())
      // On each row parsed, add to results array
      .on('data', (data) => results.push(data))
      // When all rows parsed, resolve promise with complete array
      .on('end', () => resolve(results))
      // If error occurs during parsing, reject promise
      .on('error', reject);
  });
};

/**
 * Parse Excel file (XLSX or XLS) and extract data from first sheet
 * @param {string} filePath - Absolute path to the Excel file to parse
 * @returns {Promise<Array>} Promise resolving to array of parsed records
 * @throws {Error} If file cannot be read or parsed
 * @example
 * const data = await parseExcel('./file.xlsx');
 * // Returns: [{ FirstName: 'John', Phone: '+1-555-1234', Notes: '...' }, ...]
 */
exports.parseExcel = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      
      // Get the name of the first sheet
      const sheetName = workbook.SheetNames[0];
      
      // Get the worksheet object for the first sheet
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert worksheet data to array of JSON objects
      const results = XLSX.utils.sheet_to_json(worksheet);
      
      // Resolve promise with parsed data
      resolve(results);
    } catch (error) {
      // If error occurs, reject promise with error details
      reject(error);
    }
  });
};

/**
 * Validate that uploaded file has an acceptable format/extension
 * Checks if file is CSV, XLSX, or XLS format
 * @param {string} fileName - Name of the file (including extension)
 * @returns {boolean} True if file format is valid, false otherwise
 * @example
 * isValidFileFormat('data.csv');     // Returns: true
 * isValidFileFormat('data.pdf');     // Returns: false
 */
exports.isValidFileFormat = (fileName) => {
  // List of acceptable file extensions
  const validExtensions = ['.csv', '.xlsx', '.xls'];
  
  // Get file extension from filename
  const ext = require('path').extname(fileName).toLowerCase();
  
  // Check if extension is in the valid list
  return validExtensions.includes(ext);
};

/**
 * Validate CSV/Excel data structure - ensures data has required fields and valid values
 * Required fields: FirstName and Phone (Notes is optional)
 * @param {Array} data - Array of records parsed from file
 * @returns {Object} { valid: boolean, errors: Array<string> }
 *   - valid: true if data passes all validation checks
 *   - errors: array of error messages describing validation failures
 * @example
 * const result = validateDataStructure([
 *   { FirstName: 'John', Phone: '+1-555-1234', Notes: 'Manager' },
 *   { FirstName: '', Phone: '+1-555-5678', Notes: 'Assistant' }  // Invalid: empty FirstName
 * ]);
 * // Returns: { 
 * //   valid: false, 
 * //   errors: ['Row 2: FirstName is required and must be valid'] 
 * // }
 */
exports.validateDataStructure = (data) => {
  const errors = [];  // Array to collect validation error messages

  // Check 1: Verify data is an array and not empty
  if (!Array.isArray(data) || data.length === 0) {
    errors.push("No data found in file");
    return { valid: false, errors };
  }

  // Check 2: Verify first record contains required column headers
  const firstRecord = data[0];
  const requiredFields = ['FirstName', 'Phone'];  // Minimum required columns

  // Check if each required field exists in the header row
  for (const field of requiredFields) {
    if (!(field in firstRecord)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check 3: Validate each data row has valid FirstName and Phone values
  data.forEach((record, index) => {
    // Trim whitespace and check FirstName field
    const firstName = (record.FirstName || '').trim();
    const phone = (record.Phone || '').trim();
    
    // FirstName validation: must be non-empty string
    if (!firstName || typeof record.FirstName !== 'string') {
      errors.push(`Row ${index + 1}: FirstName is required and must be valid`);
    }
    
    // Phone validation: must be non-empty string
    if (!phone || typeof record.Phone !== 'string') {
      errors.push(`Row ${index + 1}: Phone is required and must be valid`);
    }
  });

  // Return validation result
  return {
    valid: errors.length === 0,  // Valid only if no errors found
    errors                        // List of validation errors (if any)
  };
};
