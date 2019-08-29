import React, { FC } from "react";


const ContentContainer: FC = (props) => {

  return (
    <div className='m-4 p-4 bg-white min-h-content shadow'>
      {props.children}
    </div>
  )
}

export default ContentContainer
