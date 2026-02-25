import {useEffect} from 'react'

function UseEffectDemo() {

  useEffect(() => {
    console.log("useEffect called");
  }, []);
  return (
    <div>UseEffectDemo</div>
  )
}

export default UseEffectDemo