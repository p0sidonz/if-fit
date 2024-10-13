import React, { useRef } from 'react';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled } from '@mui/material/styles';

// SVG Imports
import ElementOne from '../../../assets/svg/front-pages/landing-page/ElementOne'
import Lines from '../../../assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from './styles.module.css'

const FaqsData = [
  {
    id: 'panel1',
    question: 'Do you charge for each upgrade?',
    answer:
      'Lemon drops chocolate cake gummies carrot cake chupa chups muffin topping. Sesame snaps icing marzipan gummi bears macaroon dragée danish caramels powder. Bear claw dragée pastry topping soufflé. Wafer gummi bears marshmallow pastry pie.'
  },
  {
    id: 'panel2',
    question: 'What is regular license?',
    active: true,
    answer:
      'Regular license can be used for end products that do not charge users for access or service(access is free and there will be no monthly subscription fee). Single regular license can be used for single end product and end product can be used by you or your client. If you want to sell end product to multiple clients then you will need to purchase separate license for each client. The same rule applies if you want to use the same end product on multiple domains(unique setup). For more info on regular license you can check official description.'
  },
  {
    id: 'panel3',
    question: 'What is extended license?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis et aliquid quaerat possimus maxime! Mollitia reprehenderit neque repellat deleniti delectus architecto dolorum maxime, blanditiis earum ea, incidunt quam possimus cumque.'
  },
  {
    id: 'panel4',
    question: 'Which license is applicable for SASS application?',
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis et aliquid quaerat possimus maxime! Mollitia reprehenderit neque repellat deleniti delectus architecto dolorum maxime, blanditiis earum ea, incidunt quam possimus cumque.'
  }
]


const StyledSection = styled('section')(({ theme }) => ({
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(16),
  paddingTop: 100,
  paddingBottom: 100,
}));

const ImageContainer = styled('div')({
  textAlign: 'center',
  '& img': {
    width: '80%',
    maxWidth: 320,
  },
});



const Faqs = () => {
  const ref = useRef(null);

  return (
    <StyledSection id="faq" ref={ref} className={frontCommonStyles.layoutSpacing}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <ElementOne style={{ position: 'absolute', right: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, gap: 12 }}>
            <Lines />
            <Typography color="textPrimary" sx={{ fontWeight: 'medium', textTransform: 'uppercase' }}>
              Faq
            </Typography>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: { xs: 12, sm: 8 } }}>
          <Typography variant="h5">Frequently asked</Typography>
          <Typography variant="h4" fontWeight="bold">
            questions
          </Typography>
        </div>
        <Typography fontWeight="medium" align="center">
          Browse through these FAQs to find answers to commonly asked questions.
        </Typography>
      </div>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <ImageContainer>
            <img
              src="/images/front-pages/landing-page/sitting-girl-with-laptop.png"
              alt="girl with laptop"
            />
          </ImageContainer>
        </Grid>
        <Grid item xs={12} lg={7}>
          {FaqsData.map((data, index) => (
            <Accordion key={index} defaultExpanded={data.active}>
              <AccordionSummary aria-controls={`${data.id}-content`} id={`${data.id}-header`}>
                <Typography fontWeight="medium">{data.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{data.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </StyledSection>
  );
};


export default Faqs
