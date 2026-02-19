const form = document.querySelector(".quiz-form");
const questions =  document.querySelectorAll(".question");
const result = document.querySelector(".result");
const correctAnswers = ['D','B','C','B','D'];

form.addEventListener('submit', (e) =>{
    // Your code
    e.preventDefault();

    let res = 0;

   correctAnswers.forEach((answer,index) => {
        const useranswer=form[`q${index+1}`].value;
        questions[index].classList.remove("correct", "wrong");

        if(useranswer===answer){
            res+=20;
            questions[index].classList.add("correct");
        }
        else {
            questions[index].classList.add("wrong");
        }
        
    });

    result.classList.remove("hide");
    result.querySelector("p").textContent = `You scored ${res}% 🎯`;

    window.scrollTo({
        top:0,
        behavior: "smooth"
    });

document.body.scrollTop = 0; // For Safari
document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

});