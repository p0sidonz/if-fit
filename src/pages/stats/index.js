import React from 'react'
import UserStat from 'src/modules/userStat/index';


const StatPage = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    return (<UserStat/>)
  }

export default StatPage