import React,{useEffect} from 'react'
async function call(){
    window.location.replace("http://localhost:3000/dashboard/new")
}
function Home() {
        useEffect(()=>{
            call()
        },[])
    return (
        <div>
            home
        </div>
    )
}

export default Home
