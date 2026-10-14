import { useState }from "react"

function counting(){
    const[count,setCount]=useState(0);
    function increment(){
        setCount(count+1);
    }
    function decrement(){
        setCount(count-1);
    }
    return(<>
    <h1>Anurag University</h1>
    <h1>Counting Application</h1>
    
    <button onClick={increment}>Inc</button>
    <button onClick={decrement}>Dec</button>
    <button onClick={reset}>Reset</button>
    <h2>Count::</h2></>
    )
}
export default App;