import { Monaco } from "@monaco-editor/react";
import { Theme } from "../../../types";

export interface LanguageConfig {
  [x: string]: any;
  extension: any;
  id: string;
  label: string;
  logoPath: string;
  pistonRuntime: {
    language: string;
    version: string;
  };
  monacoLanguage: string;
  defaultCode: string;
}

export const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    logoPath: "/javascript.png",
    pistonRuntime: { language: "javascript", version: "18.15.0" }, // api that we're gonna be using
    monacoLanguage: "javascript",
    defaultCode: `// JavaScript Playground
const numbers = [1, 2, 3, 4, 5];

// Map numbers to their squares
const squares = numbers.map(n => n * n);
console.log('Original numbers:', numbers);
console.log('Squared numbers:', squares);

// Filter for even numbers
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Calculate sum using reduce
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('Sum of numbers:', sum);`,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    logoPath: "/typescript.png",
    pistonRuntime: { language: "typescript", version: "5.0.3" },
    monacoLanguage: "typescript",
    defaultCode: `// TypeScript Playground
interface NumberArray {
  numbers: number[];
  sum(): number;
  squares(): number[];
  evenNumbers(): number[];
}

class MathOperations implements NumberArray {
  constructor(public numbers: number[]) {}

  sum(): number {
    return this.numbers.reduce((acc, curr) => acc + curr, 0);
  }

  squares(): number[] {
    return this.numbers.map(n => n * n);
  }

  evenNumbers(): number[] {
    return this.numbers.filter(n => n % 2 === 0);
  }
}

const math = new MathOperations([1, 2, 3, 4, 5]);

console.log('Original numbers:', math.numbers);
console.log('Squared numbers:', math.squares());
console.log('Even numbers:', math.evenNumbers());
console.log('Sum of numbers:', math.sum());`,
  },
  python: {
    id: "python",
    label: "Python",
    logoPath: "/python.png",
    pistonRuntime: { language: "python", version: "3.10.0" },
    monacoLanguage: "python",
    defaultCode: `# Python Playground
numbers = [1, 2, 3, 4, 5]

# Map numbers to their squares
squares = [n ** 2 for n in numbers]
print(f"Original numbers: {numbers}")
print(f"Squared numbers: {squares}")

# Filter for even numbers
even_numbers = [n for n in numbers if n % 2 == 0]
print(f"Even numbers: {even_numbers}")

# Calculate sum
numbers_sum = sum(numbers)
print(f"Sum of numbers: {numbers_sum}")`,
  },
  java: {
    id: "java",
    label: "Java",
    logoPath: "/java.png",
    pistonRuntime: { language: "java", version: "15.0.2" },
    monacoLanguage: "java",
    defaultCode: `public class Main {
  public static void main(String[] args) {
      // Create array
      int[] numbers = {1, 2, 3, 4, 5};
      
      // Print original numbers
      System.out.print("Original numbers: ");
      printArray(numbers);
      
      // Calculate and print squares
      int[] squares = new int[numbers.length];
      for (int i = 0; i < numbers.length; i++) {
          squares[i] = numbers[i] * numbers[i];
      }
      System.out.print("Squared numbers: ");
      printArray(squares);
      
      // Print even numbers
      System.out.print("Even numbers: ");
      for (int n : numbers) {
          if (n % 2 == 0) System.out.print(n + " ");
      }
      System.out.println();
      
      // Calculate and print sum
      int sum = 0;
      for (int n : numbers) sum += n;
      System.out.println("Sum of numbers: " + sum);
  }
  
  private static void printArray(int[] arr) {
      for (int n : arr) System.out.print(n + " ");
      System.out.println();
  }
}`,
  },
  go: {
    id: "go",
    label: "Go",
    logoPath: "/go.png",
    pistonRuntime: { language: "go", version: "1.16.2" },
    monacoLanguage: "go",
    defaultCode: `package main

import "fmt"

func main() {
  // Create slice
  numbers := []int{1, 2, 3, 4, 5}
  
  // Print original numbers
  fmt.Println("Original numbers:", numbers)
  
  // Calculate squares
  squares := make([]int, len(numbers))
  for i, n := range numbers {
      squares[i] = n * n
  }
  fmt.Println("Squared numbers:", squares)
  
  // Filter even numbers
  var evenNumbers []int
  for _, n := range numbers {
      if n%2 == 0 {
          evenNumbers = append(evenNumbers, n)
      }
  }
  fmt.Println("Even numbers:", evenNumbers)
  
  // Calculate sum
  sum := 0
  for _, n := range numbers {
      sum += n
  }
  fmt.Println("Sum of numbers:", sum)
}`,
  },
  rust: {
    id: "rust",
    label: "Rust",
    logoPath: "/rust.png",
    pistonRuntime: { language: "rust", version: "1.68.2" },
    monacoLanguage: "rust",
    defaultCode: `fn main() {
    // Create vector
    let numbers = vec![1, 2, 3, 4, 5];
    
    // Print original numbers
    println!("Original numbers: {:?}", numbers);
    
    // Calculate squares
    let squares: Vec<i32> = numbers
        .iter()
        .map(|&n| n * n)
        .collect();
    println!("Squared numbers: {:?}", squares);
    
    // Filter even numbers
    let even_numbers: Vec<i32> = numbers
        .iter()
        .filter(|&&n| n % 2 == 0)
        .cloned()
        .collect();
    println!("Even numbers: {:?}", even_numbers);
    
    // Calculate sum
    let sum: i32 = numbers.iter().sum();
    println!("Sum of numbers: {}", sum);
}`,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    logoPath: "/cpp.png",
    pistonRuntime: { language: "cpp", version: "10.2.0" },
    monacoLanguage: "cpp",
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    // Create vector
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    // Print original numbers
    std::cout << "Original numbers: ";
    for(int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    
    // Calculate squares
    std::vector<int> squares;
    std::transform(numbers.begin(), numbers.end(), 
                  std::back_inserter(squares),
                  [](int n) { return n * n; });
    
    std::cout << "Squared numbers: ";
    for(int n : squares) std::cout << n << " ";
    std::cout << std::endl;
    
    // Filter even numbers
    std::vector<int> evenNumbers;
    std::copy_if(numbers.begin(), numbers.end(),
                 std::back_inserter(evenNumbers),
                 [](int n) { return n % 2 == 0; });
    
    std::cout << "Even numbers: ";
    for(int n : evenNumbers) std::cout << n << " ";
    std::cout << std::endl;
    
    // Calculate sum
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Sum of numbers: " << sum << std::endl;
    
    return 0;
}`,
  },
  csharp: {
    id: "csharp",
    label: "C#",
    logoPath: "/csharp.png",
    pistonRuntime: { language: "csharp", version: "6.12.0" },
    monacoLanguage: "csharp",
    defaultCode: `using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        // Create array
        int[] numbers = { 1, 2, 3, 4, 5 };
        
        // Print original numbers
        Console.WriteLine($"Original numbers: {string.Join(" ", numbers)}");
        
        // Calculate squares
        var squares = numbers.Select(n => n * n);
        Console.WriteLine($"Squared numbers: {string.Join(" ", squares)}");
        
        // Filter even numbers
        var evenNumbers = numbers.Where(n => n % 2 == 0);
        Console.WriteLine($"Even numbers: {string.Join(" ", evenNumbers)}");
        
        // Calculate sum
        var sum = numbers.Sum();
        Console.WriteLine($"Sum of numbers: {sum}");
    }
}`,
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    logoPath: "/ruby.png",
    pistonRuntime: { language: "ruby", version: "3.0.0" },
    monacoLanguage: "ruby",
    defaultCode: `# Create array
numbers = [1, 2, 3, 4, 5]

# Print original numbers
puts "Original numbers: #{numbers.join(' ')}"

# Calculate squares
squares = numbers.map { |n| n * n }
puts "Squared numbers: #{squares.join(' ')}"

# Filter even numbers
even_numbers = numbers.select { |n| n.even? }
puts "Even numbers: #{even_numbers.join(' ')}"

# Calculate sum
sum = numbers.sum
puts "Sum of numbers: #{sum}"`,
  },
  php: {
    id: "php",
    label: "PHP",
    logoPath: "/php.png",
    pistonRuntime: { language: "php", version: "8.2.3" },
    monacoLanguage: "php",
    defaultCode: `<?php
// Create array
$numbers = [1, 2, 3, 4, 5];

// Print original numbers
echo "Original numbers: " . implode(", ", $numbers) . "\n";

// Calculate squares
$squares = array_map(function($n) {
    return $n * $n;
}, $numbers);
echo "Squared numbers: " . implode(", ", $squares) . "\n";

// Filter even numbers
$evenNumbers = array_filter($numbers, function($n) {
    return $n % 2 === 0;
});
echo "Even numbers: " . implode(", ", $evenNumbers) . "\n";

// Calculate sum
$sum = array_sum($numbers);
echo "Sum of numbers: " . $sum . "\n";`,
  },
  swift: {
    id: "swift",
    label: "Swift",
    logoPath: "/swift.png",
    pistonRuntime: { language: "swift", version: "5.5" },
    monacoLanguage: "swift",
    defaultCode: `// Create array
let numbers = [1, 2, 3, 4, 5]

// Print original numbers
print("Original numbers: \(numbers)")

// Calculate squares
let squares = numbers.map { $0 * $0 }
print("Squared numbers: \(squares)")

// Filter even numbers
let evenNumbers = numbers.filter { $0 % 2 == 0 }
print("Even numbers: \(evenNumbers)")

// Calculate sum
let sum = numbers.reduce(0, +)
print("Sum of numbers: \(sum)")`,
  },
  kotlin: {
    id: "kotlin",
    label: "Kotlin",
    logoPath: "/kotlin.png",
    pistonRuntime: { language: "kotlin", version: "1.8.20" },
    monacoLanguage: "kotlin",
    defaultCode: `fun main() {
    // Create list
    val numbers = listOf(1, 2, 3, 4, 5)
    
    // Print original numbers
    println("Original numbers: $numbers")
    
    // Calculate squares
    val squares = numbers.map { it * it }
    println("Squared numbers: $squares")
    
    // Filter even numbers
    val evenNumbers = numbers.filter { it % 2 == 0 }
    println("Even numbers: $evenNumbers")
    
    // Calculate sum
    val sum = numbers.sum()
    println("Sum of numbers: $sum")
}`,
  },
};

// Update versions on app initialization
import { updateLanguageVersions } from '../_utils/updateVersions';
updateLanguageVersions().catch(console.error);

export const THEMES: Theme[] = [
  { id: 'vs-dark', label: 'VS Dark', color: '#1E1E1E' },
  { id: 'github-dark', label: 'GitHub Dark', color: '#24292E' },
  { id: 'monokai', label: 'Monokai', color: '#272822' },
  { id: 'light', label: 'Light', color: '#FFFFFF' }
];

export const THEME_DEFINITIONS = {
  'vs-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {}
  },
  'github-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A737D' },
      { token: 'keyword', foreground: 'F97583' },
      { token: 'string', foreground: '9ECBFF' },
      { token: 'number', foreground: 'B392F0' },
      { token: 'type', foreground: '79B8FF' }
    ],
    colors: {
      'editor.background': '#24292E',
      'editor.foreground': '#E1E4E8',
      'editorLineNumber.foreground': '#6A737D',
      'editor.selectionBackground': '#444D56',
      'editor.inactiveSelectionBackground': '#373E47'
    }
  },
  'monokai': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '88846F' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'type', foreground: '66D9EF' }
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
      'editorLineNumber.foreground': '#90908A',
      'editor.selectionBackground': '#49483E',
      'editor.inactiveSelectionBackground': '#3E3D32'
    }
  },
  'light': {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '008000' },
      { token: 'keyword', foreground: '0000FF' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'type', foreground: '267F99' }
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
      'editorLineNumber.foreground': '#237893',
      'editor.selectionBackground': '#ADD6FF',
      'editor.inactiveSelectionBackground': '#E5EBF1'
    }
  }
};

// Helper function to define themes in Monaco
export const defineMonacoThemes = (monaco: Monaco) => {
  Object.entries(THEME_DEFINITIONS).forEach(([themeName, themeData]) => {
    monaco.editor.defineTheme(themeName, {
      base: themeData.base,
      inherit: themeData.inherit,
      rules: themeData.rules,
      colors: themeData.colors,
    });
  });
};

export default LANGUAGE_CONFIG;
