function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function isPerfectSquare(num: number): boolean {
  const sqrt = Math.sqrt(num);
  return sqrt === Math.floor(sqrt);
}

function isPerfectCube(num: number): boolean {
  const cbrt = Math.round(Math.cbrt(num));
  return cbrt * cbrt * cbrt === num;
}

function evaluateMathExpression(expression: string): number {
  // Convert word operations to symbols
  let expr = expression
    .replace(/\s+/g, ' ')
    .replace(/multiplied by/gi, '*')
    .replace(/to the power of/gi, '**')
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .trim();

  // Tokenize the expression
  const tokens: (number | string)[] = [];
  const parts = expr.split(/([+\-*]+)/);
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === '') continue;
    
    if (/^[+\-*]+$/.test(trimmed)) {
      tokens.push(trimmed);
    } else {
      const num = parseFloat(trimmed);
      if (!isNaN(num)) {
        tokens.push(num);
      }
    }
  }

  // Handle power operations first (highest precedence)
  for (let i = 1; i < tokens.length - 1; i++) {
    if (tokens[i] === '**') {
      const left = tokens[i - 1] as number;
      const right = tokens[i + 1] as number;
      tokens.splice(i - 1, 3, Math.pow(left, right));
      i -= 1;
    }
  }

  // Handle multiplication (second precedence)
  for (let i = 1; i < tokens.length - 1; i++) {
    if (tokens[i] === '*') {
      const left = tokens[i - 1] as number;
      const right = tokens[i + 1] as number;
      tokens.splice(i - 1, 3, left * right);
      i -= 1;
    }
  }

  // Handle addition and subtraction (lowest precedence)
  let result = tokens[0] as number;
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i] as string;
    const operand = tokens[i + 1] as number;
    
    if (operator === '+') {
      result += operand;
    } else if (operator === '-') {
      result -= operand;
    }
  }

  return result;
}

export default function QueryProcessor(query: string): string {
  if (query.toLowerCase().includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }
  if (query.toLowerCase().includes("andrew id")) {
    return (
      "My Andrew ID is: lleong"
    );
  }

  if (query.toLowerCase().includes("name")) {
    return "lleong";
  }

  // Handle general mathematical expressions like "What is 15 plus 65 multiplied by 12?"
  const mathMatch = query.match(/what is ([\d\s]+(?:plus|minus|multiplied by|to the power of)[\d\s]+(?:(?:plus|minus|multiplied by|to the power of)[\d\s]+)*)\??/i);
  if (mathMatch) {
    try {
      const result = evaluateMathExpression(mathMatch[1]);
      return result.toString();
    } catch (e) {
      // Fall through to specific handlers if general evaluation fails
    }
  }

  // Handle addition queries like "What is 59 plus 25?" or "What is 57 plus 99 plus 40?"
  const additionMatch = query.match(/what is ([\d\s]+(?:plus[\d\s]+)+)/i);
  if (additionMatch) {
    const numbers = additionMatch[1].split(/plus/i).map(n => parseInt(n.trim()));
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum.toString();
  }

  // Handle subtraction queries like "What is 59 minus 25?"
  const subtractionMatch = query.match(/what is (\d+) minus (\d+)/i);
  if (subtractionMatch) {
    const num1 = parseInt(subtractionMatch[1]);
    const num2 = parseInt(subtractionMatch[2]);
    return (num1 - num2).toString();
  }

  // Handle multiplication queries like "What is 59 multiplied by 25?"
  const multiplicationMatch = query.match(/what is (\d+) multiplied by (\d+)/i);
  if (multiplicationMatch) {
    const num1 = parseInt(multiplicationMatch[1]);
    const num2 = parseInt(multiplicationMatch[2]);
    return (num1 * num2).toString();
  }

  // Handle power queries like "What is 81 to the power of 25?"
  const powerMatch = query.match(/what is (\d+) to the power of (\d+)/i);
  if (powerMatch) {
    const base = parseInt(powerMatch[1]);
    const exponent = parseInt(powerMatch[2]);
    return Math.pow(base, exponent).toString();
  }

  // Handle prime number queries like "Which of the following numbers are primes: 35, 70, 44, 71, 17?"
  const primeMatch = query.match(/which of the following numbers are primes[:\s]+([0-9,\s]+)/i);
  if (primeMatch) {
    const numbers = primeMatch[1].split(',').map(n => parseInt(n.trim()));
    const primes = numbers.filter(isPrime);
    return primes.join(', ');
  }

  // Handle square and cube queries like "Which of the following numbers is both a square and a cube: 729, 2937, 36?"
  const squareCubeMatch = query.match(/which of the following numbers is both a square and a cube[:\s]+([0-9,\s]+)/i);
  if (squareCubeMatch) {
    const numbers = squareCubeMatch[1].split(',').map(n => parseInt(n.trim()));
    const results = numbers.filter(n => isPerfectSquare(n) && isPerfectCube(n));
    return results.join(', ');
  }

  // Handle largest number queries like "Which of the following numbers is the largest: 68, 63, 56?"
  const largestMatch = query.match(/which of the following numbers is the largest[:\s]+([0-9,\s]+)/i);
  if (largestMatch) {
    const numbers = largestMatch[1].split(',').map(n => parseInt(n.trim()));
    const largest = Math.max(...numbers);
    return largest.toString();
  }

  return "";
}
