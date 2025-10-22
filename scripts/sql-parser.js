/**
 * Advanced SQL Parser for MySQL Dump Files
 * Handles complex data types, escaped strings, and various SQL formats
 */

class SQLParser {
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
    const insertRegex = /INSERT INTO `(\w+)` VALUES\s*([\s\S]*?);/gi;
    let match;

    while ((match = insertRegex.exec(this.content)) !== null) {
      const tableName = match[1];
      const valuesString = match[2];

      if (this.tables[tableName]) {
        this.tables[tableName].data = this.parseInsertValues(valuesString);
      }
    }
  }

  parseInsertValues(valuesString) {
    const rows = [];
    const values = this.parseValueRows(valuesString);

    for (const valueSet of values) {
      rows.push(valueSet);
    }

    return rows;
  }

  parseValueRows(valuesString) {
    const rows = [];
    let currentRow = "";
    let inString = false;
    let stringChar = "";
    let parenCount = 0;
    let i = 0;

    while (i < valuesString.length) {
      const char = valuesString[i];
      const nextChar = valuesString[i + 1];

      if (!inString) {
        if (char === "(") {
          parenCount++;
          if (parenCount === 1) {
            currentRow = "";
            continue;
          }
        } else if (char === ")") {
          parenCount--;
          if (parenCount === 0) {
            // End of row
            const values = this.parseRowValues(currentRow);
            rows.push(values);
            currentRow = "";
            continue;
          }
        } else if (parenCount > 0) {
          currentRow += char;
        }
      } else {
        currentRow += char;
      }

      // Handle string escaping
      if (!inString && (char === "'" || char === '"')) {
        inString = true;
        stringChar = char;
        currentRow += char;
      } else if (inString && char === stringChar) {
        if (nextChar === stringChar) {
          // Escaped quote
          currentRow += char + nextChar;
          i++; // Skip next char
        } else {
          // End of string
          inString = false;
          stringChar = "";
          currentRow += char;
        }
      } else if (inString && char === "\\" && nextChar) {
        // Escaped character
        currentRow += char + nextChar;
        i++; // Skip next char
      } else if (parenCount > 0) {
        currentRow += char;
      }

      i++;
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

module.exports = SQLParser;
