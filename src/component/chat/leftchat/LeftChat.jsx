import React,{useState} from 'react'
import './LeftChat.css'
import LeftFriend from './LeftFriend'
const LeftChat = ({conversation,FacebookUserId,setConversationId}) => {
    const [search, setSearch] = useState("")
    return (
        <>
       <div className="leftChat">
       <div className="leftChatbox">
       <div className="form-group">
          
            <input type="text" placeholder="Search By Name" className="form-control" name="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>
      <br /><br />
      <div className="conversation">
        {
          conversation.map((c,ind)=>{
            return(
              <>
              <LeftFriend key={ind} setConversationId={setConversationId} conversation={c} FacebookUserId={FacebookUserId} />

              </>
            )
          })
        }
        
      </div>
       </div>
       </div>
            
        </>
    )
}

export default LeftChat

