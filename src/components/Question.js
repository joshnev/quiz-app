import React, { useContext } from 'react';
import QuizContext from '../context/quizContext';

function Question() {
  const { state } = useContext(QuizContext);
  const { currentQuestion, questions } = state;
  const question = questions[currentQuestion];
  return <h1 className="text-xl font-bold">{question.question}</h1>;
}

export default Question;
