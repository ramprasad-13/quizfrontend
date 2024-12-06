import { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Question from './components/Main/Question';

import axios from 'axios';


//Importing env variable
const id = import.meta.env.VITE_QUIZID;
const deploymentType = import.meta.env.VITE_DEPLOYMENT;
const url = import.meta.env.VITE_URL;
const localUrl = import.meta.env.VITE_LOCALURL;



function App() {
  // State to store questions and loading state
  const [questions, setQuestions] = useState([]);
  const [quizDetails, setQuizdetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIssubmitted] = useState(false);
  //const [buttonText, setButtontext] = useState("Submit");
  const [correctAnswers, setCorrectanswers]= useState(0)
  const [wrongAnswers, setWronganswers]= useState(0)

  // Fetch questions from API on component mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        //this is quiz id 673df27301355dfb90c14b8b
        const env = deploymentType==="prod"?url:localUrl
        const response = await axios.get(`${env}/api/question/get/${id}`);
        const quizDetails = await axios.get(`${env}/api/quiz/get/${id}`);

        setQuizdetails(quizDetails.data?.quiz || {});
        setQuestions(response.data.quizWithQuestions || []);  // Assuming the API returns an array of questions under 'questions'
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [isSubmitted]); // Empty dependency array to run once when component mounts


  // Handling form submission (evaluation)
  function evaluate(e) {
    e.preventDefault();
    setIssubmitted((prevValue)=>{
      if(prevValue){
        e.target.reset()
        return false;
      }
      return !prevValue
    });

    const formData = new FormData(e.currentTarget);

    // Convert FormData to a simple object for easier handling
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });


    function checkScore(data) {
      let correctAnswers = 0;
      let wrongAnswers = 0;

      questions.forEach((question) => {
        // Match answer with the question's answer
        if (data[question._id] == question.answer) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      });

      return { correctAnswers, wrongAnswers };
    }
    const result = checkScore(data);
    setCorrectanswers(result.correctAnswers);
    setWronganswers(result.wrongAnswers);
    // console.log(result);
    // alert(`Correct: ${result.correctAnswers}, Wrong: ${result.wrongAnswers}`);
  }

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  const showQuestions = questions.map((question, index) => {
    return <Question key={index} question={question} showExplanation={isSubmitted} index={index + 1} />;
  });

  return (
    <>
      <Header />
      <main>
        <div className="container">
          {questions.length>0?
          <>
          <h1 style={{ textAlign: 'center', marginTop: '20px' }}>{quizDetails.description}</h1>
          <div style={{textAlign:'right', fontSize:'1.2rem', margin:'1rem'}}>
            {isSubmitted && 
            <div>
            <p>Correct answers: {correctAnswers}</p>
            <p>Wrong answers: {wrongAnswers}</p>
            </div>
            }
            {!isSubmitted && 
            <div>
            <p>Assigned By: {quizDetails?.assignedBy}</p>
            <p>Number of Questions: {questions.length}</p>
            <p>Duration : {quizDetails?.duration}</p>
            </div>
            }
          </div>
          <form onSubmit={evaluate} method="post">
            {showQuestions}
            <button className="button" type="submit">
              {isSubmitted?"Reset":"Submit"}
            </button>
          </form>
          </>
          :<h1 className='noquestions'>No questions added to this Quiz!</h1>}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
