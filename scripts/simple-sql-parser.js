/**
 * Simple SQL Parser for MySQL Dump Files
 * Handles the specific format of your SQL dump
 */

class SimpleSQLParser {
  constructor(sqlContent) {
    this.content = sqlContent;
    this.tables = {};
  }

  parse() {
    console.log("Parsing SQL file...");

    // Extract table structures
    this.parseTableStructures();

    // Extract table data
    this.parseTableData();

    console.log(`Parsed ${Object.keys(this.tables).length} tables`);
    return this.tables;
  }

  parseTableStructures() {
    const createTableRegex = /CREATE TABLE `(\w+)` \(([\s\S]*?)\) ENGINE/gi;
    let match;

    while ((match = createTableRegex.exec(this.content)) !== null) {
      const tableName = match[1];
      const structure = match[2];

      this.tables[tableName] = {
        structure: this.parseTableStructure(structure),
        data: [],
      };
    }
  }

  parseTableStructure(structure) {
    const columns = [];
    const lines = structure.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("`") && trimmed.includes("`")) {
        const columnMatch = trimmed.match(
          /`(\w+)`\s+(\w+(?:\([^)]+\))?)\s*(.*)/
        );
        if (columnMatch) {
          columns.push({
            name: columnMatch[1],
            type: columnMatch[2],
            attributes: columnMatch[3].trim(),
          });
        }
      }
    }

    return columns;
  }

  parseTableData() {
    // Look for INSERT statements
    const insertRegex = /INSERT INTO `(\w+)` VALUES\s*([\s\S]*?);/gi;
    let match;

    while ((match = insertRegex.exec(this.content)) !== null) {
      const tableName = match[1];
      const valuesString = match[2];

      if (this.tables[tableName]) {
        this.tables[tableName].data = this.parseInsertValues(valuesString);
        console.log(`Parsed ${this.tables[tableName].data.length} records for table: ${tableName}`);
      }
    }
  }

  parseInsertValues(valuesString) {
    const rows = [];
    
    // Split by ),( to get individual rows
    const rowStrings = valuesString.split(/\),\s*\(/);
    
    for (let i = 0; i < rowStrings.length; i++) {
      let rowString = rowStrings[i];
      
      // Clean up the first and last row
      if (i === 0) {
        rowString = rowString.replace(/^\(/, '');
      }
      if (i === rowStrings.length - 1) {
        rowString = rowString.replace(/\)$/, '');
      }
      
      // Parse the row values
      const values = this.parseRowValues(rowString);
      if (values.length > 0) {
        rows.push(values);
      }
    }

    return rows;
  }

  parseRowValues(rowString) {
    const values = [];
    let currentValue = "";
    let inString = false;
    let stringChar = "";
    let i = 0;

    while (i < rowString.length) {
      const char = rowString[i];
      const nextChar = rowString[i + 1];

      if (!inString) {
        if (char === "," && !inString) {
          values.push(this.parseValue(currentValue.trim()));
          currentValue = "";
        } else {
          currentValue += char;
        }
      } else {
        currentValue += char;
      }

      // Handle string escaping
      if (!inString && (char === "'" || char === '"')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar) {
        if (nextChar === stringChar) {
          // Escaped quote
          currentValue += char + nextChar;
          i++; // Skip next char
        } else {
          // End of string
          inString = false;
          stringChar = "";
        }
      } else if (inString && char === "\\" && nextChar) {
        // Escaped character
        currentValue += char + nextChar;
        i++; // Skip next char
      }

      i++;
    }

    // Add the last value
    if (currentValue.trim()) {
      values.push(this.parseValue(currentValue.trim()));
    }

    return values;
  }

  parseValue(value) {
    if (value === "NULL") {
      return null;
    }

    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1).replace(/''/g, "'");
    }

    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1).replace(/""/g, '"');
    }

    // Try to parse as number
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }

    return value;
  }
}

module.exports = SimpleSQLParser;
