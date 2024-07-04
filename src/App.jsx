import { useState, useEffect } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import { TrendingUp } from 'lucide-react';

function App() {

  // Team Names
  let Team1 = "Pakistan";
  let Team2 = "India"
  const Overs = 2;

  // Total Over of match
  const [totalOvers, setTotalOvers] = useState(() => { return Overs });

  // Current Over State
  const [currentOver, setCurrentOver] = useState(() => { return [] })
  // Current Over lenght, increases if there is a wide or No ball.
  const [CurrentOverLength, setCurrentOverLength] = useState(() => { return 6 })
  // Ball Bowled in current over
  const [ballsBowled, setBallsBowled] = useState(() => { return 0 })

  // Overs Bowled currently
  const [oversBowled, setOversBowled] = useState(() => { return 0 })

  // Current Wickets
  const [currentWickets, setCurrentWickets] = useState(() => { return 0 })
  // Wickets before the start of current over
  const [previousWickets, setPreviousWickets] = useState(() => { return 0 })

  // Current Score
  const [currentScore, setCurrentScore] = useState(() => { return 0 })
  // Score before the start of current over
  const [previousScore, setPreviousScore] = useState(() => { return 0 })

  // Score and Wickets in each over
  const [overScore, setOverScore] = useState(() => { return [] })
  const [overWickets, setOverWickets] = useState(() => { return [] })

  // Current Batting Team
  const [currentTeam, setCurrentTeam] = useState(() => { return Team1 })

  // Target set by team 1
  const [target, setTarget] = useState(() => { return 0 });
  const [startNewInnings, setStartNewInnings] = useState(() => { return false })
  const [isNextOver, setIsNextOver] = useState(() => { return false })

  // Super over scene
  const [isSuperOver,setIsSuperOver] = useState(() => {return false})

  // Super Over Number
  const [superOverNum,setSuperOverNum] = useState(() => {return 0})

  // Winner
  const [winner,setWinner] = useState(() => {return ""})

  // Next match
  const[isNextMatch,setIsNextMatch] = useState(() => {return false})

  useEffect(() => {
    if (ballsBowled == 6) {
      setIsNextOver(true)
      
      setBallsBowled(0)
      const thisOverScore = currentScore - previousScore;
      const thisOverWickets = currentWickets - previousWickets;

      setOverScore([...overScore, thisOverScore]);
      setOverWickets([...overWickets, thisOverWickets]);

      setPreviousScore(currentScore);
      setPreviousWickets(currentWickets);

      setOversBowled(prevOvers => {
        const newOversBowled = prevOvers + 1;
  
        // Handle total overs check within the setOversBowled function
        if (newOversBowled == totalOvers) {
          setStartNewInnings(true);
          if (currentTeam == Team1) {
            setTarget(currentScore + 1);
          }
        }
  
        return newOversBowled;
      });
    }

    if (currentWickets == 10) {
      setIsNextOver(true)
      setStartNewInnings(true)
      if (currentTeam == Team1)
        setTarget(currentScore + 1);
    }

    if (currentTeam == Team2 && currentScore >= target) {
      setIsNextOver(true)
      setStartNewInnings(true)
    }

    
    if(currentTeam == Team2 && ((oversBowled  == totalOvers || currentWickets == 10) && currentScore == target - 1)){
      setIsSuperOver(true);
      setSuperOverNum(prevNum => prevNum + 1);
      setTotalOvers(1);
      setIsNextOver(true)
      setStartNewInnings(true)
      setWinner("")
    }

    if(currentTeam == Team2 && currentScore >= target)
    {
      setWinner(Team2)
      setIsNextMatch(true);
    }

    if(currentTeam == Team2 && (((overScore.length) == totalOvers || currentWickets == 10) && currentScore < target - 1)){
      setWinner(Team1);
      setIsNextMatch(true);
    }

  }, [currentOver, currentWickets, currentScore,oversBowled])

  const handleAddRun = (run) => {
    if (run == "W") {
      setCurrentWickets(prevWickets => prevWickets + 1)
      setBallsBowled(prevBallsBowled => prevBallsBowled + 1)
    }
    else if (run == "WD" || run == "NB") {
      setCurrentOverLength(prevOverLength => prevOverLength + 1)
      setCurrentScore(prevScore => prevScore + 1)
    }
    else if (run !== "W" && run !== "WD" && run !== "NB" && run !== ".") {
      setCurrentScore(prevScore => prevScore + parseInt(run));
      setBallsBowled(prevBallsBowled => prevBallsBowled + 1)
    }
    else if (run === ".")
      setBallsBowled(prevBallsBowled => prevBallsBowled + 1)

    setCurrentOver(prevOver => [...prevOver, run])
  }

  const handleNewOver = () => {
    setIsNextOver(false);
    setCurrentOver([]);
    setCurrentOverLength(6);

    if(isNextMatch)
      setIsNextMatch(false)

    if(!isSuperOver)
      setWinner("")

    if(winner !== ""){
      setIsSuperOver(false);
      setTotalOvers(Overs);
    }

    if (startNewInnings) {
      if (currentTeam == Team1)
        setCurrentTeam(Team2);
      else {
        setCurrentTeam(Team1);
        setTarget(0)
      }

      setOverScore([]);
      setOverWickets([]);

      setPreviousScore(0);
      setPreviousWickets(0);

      setOversBowled(0);
      setBallsBowled(0);
      setCurrentScore(0);
      setCurrentWickets(0);
      setStartNewInnings(false);
    }
  }

  return (
    <>
      <div className='flex justify-center items-center w-full h-screen bg-slate-700'>
        <div className='w-full max-w-md  flex flex-col gap-4  rounded justify-center items-center bg-white p-3'>
          <p className='m-2 font-bold text-xl'>Team {currentTeam}  Batting <span className='text-white'>_____</span>Total Overs: {totalOvers}</p>
          {isSuperOver && (
            <p className='font-bold text-xl'>Super Over</p>
          )}
          {target !== 0 && (
            <p className='font-bold text-xl'>Target = {target}</p>
          )}
          <div className="currentOver flex gap-5 items-center">
            {currentOver.map((run, index) => (
              <span className='font-bold text-2xl' key={index}>{run}</span>
            ))}
          </div>

          <div className="runButtons flex items-center gap-5">
            <Button onClick={() => handleAddRun(1)} disabled={isNextOver}>1</Button>
            <Button onClick={() => handleAddRun(2)} disabled={isNextOver}>2</Button>
            <Button onClick={() => handleAddRun(3)} disabled={isNextOver}>3</Button>
            <Button onClick={() => handleAddRun(4)} disabled={isNextOver}>4</Button>
            <Button onClick={() => handleAddRun(5)} disabled={isNextOver}>5</Button>
            <Button onClick={() => handleAddRun(6)} disabled={isNextOver}>6</Button>
          </div>

          <div className="otherButtons flex items-center justify-between gap-1">
            <Button onClick={() => handleAddRun(".")} disabled={isNextOver}>Dot Ball</Button>
            <Button onClick={() => handleAddRun("WD")} disabled={isNextOver}>Wide</Button>
            <Button onClick={() => handleAddRun("W")} disabled={isNextOver}>Wicket</Button>
            <Button onClick={() => handleAddRun("NB")} disabled={isNextOver}>No Ball</Button>
            {((isNextOver || startNewInnings) && !isNextMatch) && !isSuperOver && (<Button onClick={() => handleNewOver()} >{startNewInnings ? "New Innings" : "New Over"}</Button>)}

            {((isNextOver || startNewInnings) && isSuperOver && !isNextMatch) && (<Button onClick={() => handleNewOver()} >Super Over {superOverNum > 1 && (<p>{ superOverNum}</p>)}</Button>)}

            {isNextMatch && (
              <Button onClick={() => handleNewOver()}>
              Next Match</Button>
            )}

          </div>

          <div className="details">
            {isNextOver && (
              <div >
                {overScore.map((score, index) => (
                  <p className='m-2' key={index}>Over {index + 1}: {score} Runs and {overWickets[index]} Wicket{overWickets[index] > 1 && (<span>s</span>)} </p>
                ))}
              </div>
            )}
          </div>

          <div className="currentScoreAndWickets">
            <p className='font-bold'>Score: {currentScore}-{currentWickets} <span className='text-white'>_____</span>Overs:  {oversBowled}.{ballsBowled}</p>
          </div>

          <div className="winner">
            {winner == Team2 && (
              <p className='font-bold text-3xl'> {Team2} Won by {10 - currentWickets} Wickets {isSuperOver && (
                <p>In Super Over</p>
              )}</p>
            )}

            {winner == Team1 && (
              <p className='font-bold text-3xl'> {Team1} Won by {target - currentScore - 1} Runs {isSuperOver && (
                <p>In Super Over</p>
              )}</p>
            )}

            {currentTeam == Team2 && (((overScore.length) == totalOvers || currentWickets == 10) && currentScore == target - 1) && (
              <p className='font-bold text-3xl'> Match Tied</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
