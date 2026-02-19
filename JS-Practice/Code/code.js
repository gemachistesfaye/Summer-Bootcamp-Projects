/* JavaScript Exercises
Part 1: Understanding Type Coercion
Task: Find the answers for the following operations. Fill in the blanks with the expected output. */

console.log('5' + 7);      // print => 57
console.log(Boolean(0));    // print => false
console.log('10' - '2');    // print=> 8
console.log('5' == 5);      // print => true
console.log('5' === 5);     // print => false
console.log(Boolean(''));    // print => false
console.log('5' + true);    // print => 5true
console.log('5' * 2);       // print => 10
console.log(0 == false);     // print => true
console.log(Boolean(NaN));   // print => false

console.log("         ")
console.log("         ")

/* Part 2: Conditional Checks
Task: Write code for the following scenarios. You can choose to complete any two of the three tasks. */

//  1. Check if a number is positive, negative, or zero.

function number1(num) {

if (num>0) { console.log("The number u input is POSITIVE")}
else if (num==0) { console.log("The number u input is ZERO")}
else  { console.log( "The number u input is NEGATIVE")}
}

number1(1)     // print => The number u input is POSITIVE
number1(-6)     //  print => The number u input is NEGATIVE
number1(0)     //  print => The number u input is ZERO


console.log("         ")
console.log("         ")


//  2.Check if a person is eligible to vote (age 18 or older).

function vote(age)     {

    if (age>=18) {console.log("u are elegible for vote🎉")}
    else if (age<18 && age>=0) {console.log ("u are not eligible for vote🚫")}
    else {console.log("invalid input⚡")}
}

vote(20)    // print => u are elegible for vote🎉
vote(10)   // print => u are not eligible for vote🚫
vote(18)    // print=>  u are elegible for vote🎉
vote(-4)   // print=> invalid input⚡

console.log("         ")
console.log("         ")


// 3.Check if a temperature is above, below, or equal to freezing point (0°C).

function temp(tp) {

    if (tp>0) {console.log("above freezing point 🌡️")}
    else if (tp==0) {console.log("equal to freezing point ❄️")}
    else  {console.log("below freezing point 🧊")}
}

temp(37)
temp(0)
temp(-48)


console.log("         ")
console.log("         ")

/* Part 3: Loop Exercises
Task 1: Factorial of a Number
Note: The factorial of a non-negative integer n is the product of all positive integers less than or equal to n (e.g., 5! = 5 × 4 × 3 × 2 × 1 = 120). */

function factorial(a) {

    if(a<0) {console.log("factorial is not for negative number👎")}
    else if (a==0) {console.log("factorial of 0 is 1 ✅")}
    else {
     let result=1;
     for(let i=1; i<=a; i++){
        result*=i;
     }   
     console.log(`factorial of ${a} is ${result} ✅`)
    }
}

factorial(1)  // print=> factorial of 1 is 1 ✅
factorial(0)   // print => factorial of 1 is 1 ✅
factorial(-5)  // print=> factorial is not for negative number👎
factorial(8)  //print => factorial of 8 is 40320 ✅

console.log("         ")
console.log("         ")

/* 
Task 2: Fibonacci Sequence
Note: The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the previous two (e.g., 0, 1, 1, 2, 3, 5, 8, ...). */

function fibonacci(a) {
    
    if (a<=0) {console.log("enter number greater than 0 ❌")}
    else if(a==1) {console.log("0")}
    else if(a==2) {console.log("0,1")}
    else {
        let ab=[0,1]
        for (let i=2;i<a;i++){
            let abc=ab[i-1]+ab[i-2]
            ab.push(abc)
        }
        console.log(`${ab.join(",")}`)
    } 
}

fibonacci(0) // print => enter number greater than 0 ❌
fibonacci(1)  // print=> 0
fibonacci(2)  //print=> 0,1
fibonacci(3)  // print => 0,1,1
fibonacci(4)    // print => 0,1,1,2
fibonacci(5)   //print => 0,1,1,2,3,
fibonacci(6)    // print => 0,1,1,2,3,5
fibonacci(10)    // print => 0,1,1,2,3,5,8,13,21,34
fibonacci(-100) // print => enter number greater than 0 ❌


console.log("         ")
console.log("         ")


/* Task 3: Find Prime Numbers
Note: A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. */

function prime(a) {
    if(a<2) { console.log("no prime number for this❌")} 
    else {
     let ab=[]
     for (let i=2; i<=a; i++)   
        { let abc=true; for (let j=2; j<= Math.sqrt(i); j++) {
            if(i%j ==0) {
                abc=false 
                break;
            }
        }
        if(abc) {
        ab.push(i)
        }
    }
    console.log(`prime numbers till ${a} is ${ab.join(", ")}`)
}
}

prime(0)   // print => no prime number for this❌
prime(1)   // print => no prime number for this❌
prime(3)   // prime=> numbers till 3 is 2, 3
prime(10)   //prime =>numbers till 10 is 2, 3, 5, 7
prime(20)  // prime=> numbers till 20 is 2, 3, 5, 7, 11, 13, 17, 19

console.log("         ")
console.log("         ")


/* Part 4: Function Tasks
Task 1: Calculate Average of Two Numbers

Write a function named average that takes two numbers and returns their average. Include exception handling to ensure the inputs are valid numbers. */

function average(a,b) {

    if (typeof a!=="number" || typeof b!="number" || isNaN(b) || isNaN(a) || isNaN(b))
    {console.log("enter valid number❌") ;return;}

    let avg =(a+b)/2;
    console.log(`average of ${a} and ${b} = ${avg}`)
} 

average(2,5)   // average of 2 and 5 = 3.5
average(5,10) // average of 5 and 10 = 7.5
average(0,0)  //average of 0 and 0 = 0
average(-6,-5)  //average of -6 and -5 = -5.5
average(-2.0986354,2.5097)  //average of -2.0986354 and 2.5097 = 0.2055323


console.log("         ")
console.log("         ")


/* Task 2: Calculate Factorial
Write an arrow function named factorial that calculates the factorial of a given number. Include exception handling to ensure the input is a non-negative integer. */


const factorial1 = (a) => {
  if (typeof a !== "number" || !Number.isInteger(a)) 
    {console.log("enter valid number❌"); return; }

  if (a < 0) {
    console.log("no factorial for negative❌"); return; }

  let result = 1;
   for (let i = 2; i <= a; i++) {result *= i; }
    console.log(`factorial of ${a} is ${result}`) ;
};

factorial1(8)   //print => factorial of 8 is 40320
factorial1(-4)  //print=>no factorial for negative❌
factorial1(0)  //factorial of 0 is 1
factorial1(4)  //factorial of 4 is 24


console.log("         ")
console.log("         ")



/* Task 3: Find Prime Numbers
Write a function expression named isPrime that checks if a number is prime. Include exception handling to ensure the input is a positive integer. */
const prime1 = function(a) {

    if (typeof a!=="number"||!Number.isInteger(a)) 
    {console.log("enter valid number❌") ; return ;}

    if(a<=1) {console.log("enter number greater than 1⚡"); return;}

    for (let i=2; i<=Math.sqrt(a); i++) {
        if(a%i==0) {console.log(`${a} not prime number👎`);return;}
    }
console.log(`${a} is prime number✅`);
};

prime1(0)  //print =>enter number greater than 1⚡
prime1(1)//print=> enter number greater than 1⚡
prime1(2)     //print => 2 is prime number✅ 
prime1(3)   //print => 3 is prime number✅
prime1(4)   //print =>  4 not prime number👎
prime1(5)   //print  ==> 5 is prime number✅
prime1(15)    //print  ==> 15 not prime number👎
prime1(17)     //print  ==> 17 is prime number✅
prime1("w")    //print => enter valid number❌


console.log("         ")
console.log("         ")

/* 
Part 5: Array Operations
Task: Create an array of numbers and perform the following operations:  */

let numb=[5,11,14,6,9,19,4]

//1.Use forEach() to print each number. 

console.log("each number")
numb.forEach(num=>console.log(num));        
/* print  
each number
 5
11
14
6
9
19
4 */

console.log("         ")
 //2.Use map() to create a new array with each number squared.

let squared=numb.map(a=>a*a);
 console.log("squared numb from array is",squared)

/*print
squared numb from array is [
  25, 121, 196, 36,
  81, 361,  16
]
*/

console.log("         ")
// 3.Use filter() to create a new array containing only odd numbers.

let odd=numb.filter(a=>a%2!==0)
 console.log("odd numb form array is =", odd)

 // print=>  odd numb form array is = [ 5, 11, 9, 19 ]

 console.log("         ")

//4.Use reduce() to find the sum of the numbers.


let sum=numb.reduce((a,b)=>a+b,0)
console.log("sum of all numb in array is = ",sum)

// print sum of all numb in array is =  68

console.log("         ")

//5.Use find() to get the first number greater than 10.

let abcd=numb.find(a=>a>10)
console.log("from aary first number which greater than 10 is =",abcd)

// print==> from aary first number which greater than 10 is = 11
console.log("         ")

//6.Use findIndex() to get the index of the first even number.

let even=numb.findIndex(a=>a%2==0)
console.log("index of first even num is =",even)

//print=>index of first even num is = 2

console.log("         ")

//7.Use includes() to check if a specific number is present.

let check=numb.includes(3)
let check1=numb.includes(11)
console.log("is 3 found in array list = ",check)
console.log("is 11 found in array list = ",check1)

//print => is 3 found in array list =  false
//print => is 11 found in array list =  true

console.log("         ")

//8.Use slice() to get a subarray of the first three elements.

let  slic=numb.slice(0,3)
console.log("three first num from array is = ",slic)

//print=> three first num from array is =  [ 5, 11, 14 ]


console.log("         ")

//9.Use splice() to remove the last number and add a new number.

let spli=numb.splice(numb.length-1, 1,21)
console.log("array value replaced by 21 =",spli)
console.log("array list after replaced 21 by last index values =",numb)

//print => array value replaced by 21 = [ 4 ]

/* print 
array list after replaced 21 by last index values = [
  5, 11, 14, 6,
  9, 19, 21
]
  */

console.log("         ")

// 10.Use sort() to sort the numbers in ascending order.

let sort=[...numb].sort((a,b)=>a-b)
console.log("sorted arrray element ascendingly =",sort)

/*print=>sorted arrray element ascendingly = [
   5,  6,  9, 11,
  14, 19, 21
*/

console.log("         ")

//11.Use join() to create a string of all numbers separated by commas

let join=numb.join(", ")
console.log("joined arr list",join)

//print =>joined arr list 5, 11, 14, 6, 9, 19, 21

