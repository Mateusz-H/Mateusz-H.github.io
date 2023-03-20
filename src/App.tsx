import {ActionSender, joinRoom,selfId} from 'trystero'
import {useEffect, useRef, useState} from "react";

const config = {appId: 'abcdefghijlmnoprst'}

let room = joinRoom(config, 'room' + 2137)
room.onPeerJoin(()=>console.log('onJoin'))
room.onPeerLeave(()=>console.log('onLeave'))
console.log(room.getPeers())
let testFunction: ActionSender<unknown> | null =null
function App() {
  const mountRef = useRef(false)
  const inputRef = useRef<HTMLInputElement|null>(null)
  const [msgs,setMsgs] = useState([])
  useEffect(()=>{
    if(mountRef.current || !import.meta.env.DEV){
      const [sendMessage, getMessage] = room.makeAction('msg')
      testFunction = sendMessage;
      getMessage((data,peerId)=>{
        console.log('data',data)
        //@ts-ignore
        setMsgs(prev=>[...prev,<div><p>id: {peerId}</p><p>msg: {data as any}</p></div>])
      })


    }
  return ()=>{
    mountRef.current = true
  }
  },[])


  return (
    <div className="App">
      <div>
        {msgs}
      </div>
      <form onSubmit={e=> {
        e.preventDefault();
        if(testFunction) {

          //@ts-ignore
          setMsgs(prev=>[...prev,<div><p>id: {selfId}</p><p>msg: {inputRef.current?.value as any}</p></div>])

          testFunction(inputRef.current?.value)
        }
      }}>
      <input ref={inputRef}></input>
      <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default App
