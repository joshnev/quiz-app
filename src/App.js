import React, { useReducer } from 'react';
import Progress from './components/Progress';
import Question from './components/Question';
import Answers from './components/Answers';
import {
  SET_ANSWERS,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWER,
  SET_ERROR,
  SET_SHOW_RESULTS,
  RESET_QUIZ,
} from './reducers/types.js';
import quizReducer from './reducers/quizReducer';
import QuizContext from './context/quizContext';

function App() {
  const questions = [
    {
      id: 1,
      question: 'Which statment about Hooks is not true?',
      answer_a:
        'Hooks are 100% backwards compatable and can be used along side classes',
      answer_b: 'Hooks are still in beta and cannot be used yet',
      answer_c:
        'Hooks are already assigned when called, there is no need to write them out manually',
      answer_d: 'All of the above',
      correct_answer: 'b',
    },
    {
      id: 2,
      question: 'Which is not a Hook?',
      answer_a: 'useState()',
      answer_b: 'useConst()',
      answer_c: 'useReducer',
      answer_d: 'All of the above',
      correct_answer: 'b',
    },
    {
      id: 3,
      question: 'Which Hook should be used for data fetching?',
      answer_a: 'useDataFetching()',
      answer_b: 'useApi()',
      answer_c: 'useEffect',
      answer_d: 'useRequest',
      correct_answer: 'c',
    },
  ];

  const initialState = {
    questions,
    currentQuestion: 0,
    currentAnswer: '',
    answers: [],
    showResults: false,
    error: '',
  };

  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { currentQuestion, currentAnswer, answers, showResults, error } = state;

  const question = questions[currentQuestion];

  const renderError = () => {
    if (!error) {
      return;
    }
    return <div>{error}</div>;
  };

  const renderResultScore = (question, answer) => {
    if (question.correct_answer === answer.answer) {
      return (
        <span className="bg-green-500 text-white text-3xl justify-center max-w-[110px] p-3 rounded-[8px] flex">
          Correct
        </span>
      );
    }
    return (
      <span className="bg-red-500 text-white justify-center items-center max-w-[100px] max-h-[40px] p-1 rounded-[8px] flex">
        Incorrect
      </span>
    );
  };

  const renderResultsData = () => {
    return answers.map((answer) => {
      const question = questions.find(
        (question) => question.id === answer.questionId
      );

      return (
        <div key={question.id}>
          {question.question} - {renderResultScore(question, answer)}
        </div>
      );
    });
  };

  const restart = () => {
    dispatch({ type: RESET_QUIZ });
  };

  const next = () => {
    const answer = { questionId: question.id, answer: currentAnswer };

    if (!currentAnswer) {
      dispatch({
        type: SET_ERROR,
        error: (
          <div className="bg-red-500 text-2xl py-2 text-white flex justify-center rounded-md">
            Please choose an answer!
          </div>
        ),
      });
      return;
    }

    answers.push(answer);
    dispatch({ type: SET_ANSWERS, answers });
    dispatch({ type: SET_CURRENT_ANSWER, currentAnswer: '' });

    if (currentQuestion + 1 < questions.length) {
      dispatch({
        type: SET_CURRENT_QUESTION,
        currentQuestion: currentQuestion + 1,
      });
      return;
    }
    dispatch({ type: SET_SHOW_RESULTS, showResults: true });
  };

  if (showResults) {
    return (
      <div className="flex flex-col px-5 py-5 rounded-[8px] drop-shadow-md  mx-auto mt-10 min-h-[300px] bg-blue-300 max-w-[400px]">
        <h2 className="text-white text-4xl  px-1 py-1 drop-shadow-sl mt-2">
          Results
        </h2>
        <ul className="mt-4 flex flex-col leading-[50px]">
          {renderResultsData()}
        </ul>
        <button
          className=" text-white mt-5 mx-auto px-1 py-1  rounded-[8px] hover:bg-green-600 bg-green-600/80 min-w-[250px] "
          onClick={restart}
        >
          Restart
        </button>
      </div>
    );
  } else {
    return (
      <QuizContext.Provider value={{ state, dispatch }}>
        <div className="flex flex-col px-5 py-5 rounded-[8px] drop-shadow-md  mx-auto mt-10 min-h-[300px] bg-blue-300 max-w-[400px]">
          <Progress total={questions.length} current={currentQuestion + 1} />
          <Question />
          {renderError()}
          <Answers />
          <button
            className=" text-white outline mt-5 p-1 rounded-full outline-black hover:text-white hover:bg-green-600 bg-green-600/70"
            onClick={next}
          >
            Confirm and continue
          </button>
        </div>
      </QuizContext.Provider>
    );
  }
}

export default App;
