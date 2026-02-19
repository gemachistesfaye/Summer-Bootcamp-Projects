        const overlay = document.getElementById('globalOverlay');
        const display = document.getElementById('overlayCodeDisplay');

        function openCode(contentId) {
            display.innerHTML = document.getElementById(contentId).innerHTML;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeCode() {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function copyCurrentCode() {
            const text = display.innerText;
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
            const toast = document.getElementById('toast');
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2000);
        }

        overlay.addEventListener('click', (e) => { if(e.target === overlay) closeCode(); });

        const logToBox = (boxId, msg) => {
            const el = document.getElementById(boxId);
            el.innerHTML = `<span class="text-slate-500 mr-2">></span> ${msg}`;
        };

        function uiNumberCheck() { logToBox('numOutput', number1(Number(document.getElementById('numInput').value))); }
        function uiVoteCheck() { logToBox('voteOutput', vote(Number(document.getElementById('voteInput').value))); }
        function uiTempCheck() { logToBox('tempOutput', temp(Number(document.getElementById('tempInput').value))); }
        function uiFactorial() { logToBox('factOutput', factorial(Number(document.getElementById('factInput').value))); }
        function uiFibonacci() { logToBox('rangeOutput', fibonacci(Number(document.getElementById('rangeInput').value))); }
        function uiPrimeRange() { logToBox('rangeOutput', prime(Number(document.getElementById('rangeInput').value))); }
        function uiAverage() { logToBox('funcOutput', average(Number(document.getElementById('avgA').value), Number(document.getElementById('avgB').value))); }
        function uiSinglePrime() { logToBox('funcOutput', singlePrime(Number(document.getElementById('singlePrimeInput').value))); }

   
        function number1(num) {
            if (num > 0) return "The number u input is POSITIVE";
            else if (num == 0) return "The number u input is ZERO";
            else return "The number u input is NEGATIVE";
        }

        function vote(age) {
            if (age >= 18) return "u are eligible for vote🎉";
            else if (age < 18 && age >= 0) return "u are not eligible for vote🚫";
            else return "invalid input⚡";
        }

        function temp(tp) {
            if (tp > 0) return "above freezing point 🌡️";
            else if (tp == 0) return "equal to freezing point ❄️";
            else return "below freezing point 🧊";
        }

        function factorial(a) {
            if (a < 0) return "factorial is not for negative number👎";
            if (a == 0) return "factorial of 0 is 1 ✅";
            let result = 1;
            for (let i = 1; i <= a; i++) result *= i;
            return `factorial of ${a} is ${result} ✅`;
        }

        function fibonacci(a) {
            if (a <= 0) return "enter number greater than 0 ❌";
            if (a == 1) return "0";
            if (a == 2) return "0,1";
            let ab = [0, 1];
            for (let i = 2; i < a; i++) ab.push(ab[i - 1] + ab[i - 2]);
            return ab.join(", ");
        }

        function prime(a) {
            if (a < 2) return "no prime number for this❌";
            let ab = [];
            for (let i = 2; i <= a; i++) {
                let isP = true;
                for (let j = 2; j <= Math.sqrt(i); j++) if (i % j == 0) { isP = false; break; }
                if (isP) ab.push(i);
            }
            return `primes till ${a}: ${ab.join(", ")}`;
        }

        function average(a, b) {
            if (isNaN(a) || isNaN(b)) return "enter valid number❌";
            return `average of ${a} and ${b} = ${(a + b) / 2}`;
        }

        const singlePrime = function(a) {
            if (isNaN(a) || !Number.isInteger(a)) return "enter valid number❌";
            if (a <= 1) return "enter number greater than 1⚡";
            for (let i = 2; i <= Math.sqrt(a); i++) {
                if (a % i == 0) return `${a} not prime number👎`;
            }
            return `${a} is prime number✅`;
        }

  
        let numb = [5, 11, 14, 6, 9, 19, 4];
        function updateArrayDisplay() { document.getElementById('displayArray').innerText = JSON.stringify(numb); }
        function resetArray() { 
            numb = [5, 11, 14, 6, 9, 19, 4]; 
            updateArrayDisplay(); 
            document.getElementById('arrayConsole').innerHTML = 'Matrix log reset...'; 
        }
        
        function runOp(op) {
            let res = "";
            if(op==='map') res = "Squared: " + JSON.stringify(numb.map(a => a * a));
            if(op==='filter') res = "Odds: " + JSON.stringify(numb.filter(a => a % 2 !== 0));
            if(op==='reduce') res = "Sum: " + numb.reduce((a, b) => a + b, 0);
            if(op==='find') res = "First > 10: " + (numb.find(a => a > 10) || "None");
            if(op==='findIndex') res = "Index of first even: " + numb.findIndex(a => a % 2 == 0);
            if(op==='includes') res = "Contains 11? " + numb.includes(11);
            if(op==='slice') res = "First three: " + JSON.stringify(numb.slice(0, 3));
            if(op==='sort') { numb.sort((a,b)=>a-b); res = "Sorted (in-place)"; updateArrayDisplay(); }
            if(op==='splice') { 
                let removed = numb.splice(numb.length - 1, 1, 21);
                res = "Removed " + removed + ", Added 21"; 
                updateArrayDisplay(); 
            }
            
            const consoleEl = document.getElementById('arrayConsole');
            consoleEl.innerHTML += `<div><span class="text-sky-400 font-bold">> ${op}():</span> ${res}</div>`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        updateArrayDisplay();