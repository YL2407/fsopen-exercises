import { useState } from 'react'

const Header = ({text}) => {
  return <div>
    <h1>
      {text}
    </h1>
  </div>
}

const Button = ({onClick, text}) => {
  return <>
    <button onClick={onClick}>
      {text}
    </button>
  </>
}

const StatisticLine = ({text, value}) => {
  return(<tr><td>{text}</td><td>{value}</td></tr>)
  
}

const Statistics = ({good, neutral, bad}) => {
  const total = () => good+neutral+bad;

  const calculateAverage = () => (good-bad)/total();

  const calculatePositive = () => good/total();

  return (good+neutral+bad==0? <><p>No feedback given</p></> : <>
  <table>
    <tbody>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={total()}/>
      <StatisticLine text="average" value={calculateAverage()}/>
      <StatisticLine text="positive" value={calculatePositive()+" %"}/>
    </tbody>
  </table>
    
  </>);
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (type) => ()=>{
    switch(type){
      case "good":
        setGood(good+1);
        break;
      case "neutral":
        setNeutral(neutral+1);
        break;
      case "bad":
        setBad(bad+1);
        break;
    }
  }

  

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={handleClick("good")} text="good"/>
      <Button onClick={handleClick("neutral")} text="neutral"/>
      <Button onClick={handleClick("bad")} text="bad"/>
      <Header text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App