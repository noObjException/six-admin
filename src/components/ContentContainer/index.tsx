import React, { FC, ReactNode } from "react";
import BaseProps from "types/base-props";


interface IProps extends BaseProps {
  title?: string,
  extra?: string | ReactNode
}

const ContentContainer: FC<IProps> = (props) => {

  return (
    <div className={`m-4 p-4 bg-white shadow pb-2 ${props.className}`}>
      <div className='flex justify-between items-center mb-4 pb-2 border-b border-solid border-gray'>
        <div className='text-lg'>{props.title}</div>
        <div className=''>{props.extra}</div>
      </div>
      <div className='overflow-scroll h-content'>
        {props.children}
      </div>
    </div>
  )
}

export default ContentContainer
