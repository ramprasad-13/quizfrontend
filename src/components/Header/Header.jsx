import './Header.css'
import logo from '../../assets/quiz.png'
import { useEffect, useState } from 'react'
import axios from 'axios'


//importing env variables

//Importing env variable
const id = import.meta.env.VITE_QUIZID;
const deploymentType = import.meta.env.VITE_DEPLOYMENT;
const url = import.meta.env.VITE_URL;
const localUrl = import.meta.env.VITE_LOCALURL;

const Header = () => {
  const [quizName,setQuizname] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    async function fetchQuizDetails(){
      try {

        //this is quiz id 673df27301355dfb90c14b8b
        const env = deploymentType==="prod"?url:localUrl;
        
        const quizDetails = await axios.get(`${env}/api/quiz/get/${id}`);

        setQuizname(quizDetails.data.quiz?.quizName || '')
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching quiz Details:', error)
        setIsLoading(false);
      }
    }
    fetchQuizDetails();
  },[]);


  if (isLoading) {
    return <div>Loading questions...</div>;
  }
  
  return (
    <div className="header">
      <div className="left">
        <img style={{width:'3rem', height:'3rem'}} src={`${logo}`} alt="Logo" />
      </div>
      <div className="right">
        <h1>{quizName}</h1>
      </div>
    </div>
  )
}

export default Header
