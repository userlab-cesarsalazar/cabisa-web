import React from 'react'
import { Button } from "antd";

function  LoadMoreButton(props) {
  
  const handler = () => {
    props.handlerButton()
  }
  
  return(
    <div className='text-center margin-top-30'>
      <Button
        disabled={!props.moreInfo}
        className=' load-more-info-btn'
        onClick={handler}>
        Cargar más
      </Button>
    </div>
  )
}

export default LoadMoreButton