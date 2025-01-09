// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import axios from 'axios'


// ** Demo Imports
import FAQS from 'src/views/pages/faq/Faqs'
import FaqHeader from 'src/views/pages/faq/FaqHeader'
import FaqFooter from 'src/views/pages/faq/FaqFooter'
import { faqData } from 'src/data/faqs'

const FAQ = ({ apiData }) => {
  // ** States
  const [data, setData] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('payment')


  useEffect(() => {
    if (searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase();
      const filteredData = {
        faqData: Object.fromEntries(
          Object.entries(faqData).map(([category, categoryData]) => [
            category,
            {
              ...categoryData,
              qandA: categoryData.qandA.filter(qa => 
                qa.question.toLowerCase().includes(searchLower) ||
                qa.answer.toLowerCase().includes(searchLower)
              )
            }
          ]).filter(([_, categoryData]) => categoryData.qandA.length > 0)
        )
      };
      
      if (Object.keys(filteredData.faqData).length > 0) {
        setData(filteredData);
        setActiveTab(Object.keys(filteredData.faqData)[0]);
      } else {
        setData(null);
      }
    } else {
      setData({ faqData });
    }
  }, [searchTerm]);

  const handleChange = (event, newValue) => {
    console.log(newValue)
    setActiveTab(newValue)
  }

  const renderNoResult = (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
      <Icon icon='mdi:alert-circle-outline' />
      <Typography variant='h6'>No Results Found!!</Typography>
    </Box>
  )

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} sx={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : part
    );
  };

  return (
    <Fragment>
      <FaqHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {faqData !== null ? <FAQS data={{
        faqData: faqData
      }} activeTab={activeTab} handleChange={handleChange} /> : renderNoResult}
      <FaqFooter />
    </Fragment>
  )
}

export const getStaticProps = async () => {
  
  const apiData = []  

  return {
    props: {
      apiData
    }
  }
}

export default FAQ
