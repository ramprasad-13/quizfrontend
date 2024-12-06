import './Question.css'

/* eslint-disable react/prop-types */
const Question = (props) => {
  const {question, showExplanation} = props;

  return (
    <>
    <div className="question-wrapper">
      <p className="question">{question.question}</p>
        <div className="options">
          <label className='radio-label'><input type="radio" name={question._id} value={0} /> {question.options[0]}</label><br />
          <label className='radio-label'><input type="radio" name={question._id} value={1} /> {question.options[1]}</label><br />
          <label className='radio-label'><input type="radio" name={question._id} value={2} /> {question.options[2]}</label><br />
          <label className='radio-label'><input type="radio" name={question._id} value={3} /> {question.options[3]}</label><br />
        </div>
      {showExplanation && <p className='explanation'><b>Explanation:</b> {question.explanation}</p>}
    </div>
    </>
  )
}

export default Question
