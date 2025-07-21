import { Step, StepLabel, Stepper } from '@mui/material'
import React from 'react'

export default function RenderStepper({
    steps=[],
    active
}) {
  return (
    <Stepper activeStep={active} alternativeLabel>
        {
            steps?.map((label)=>(
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))
        }
    </Stepper>
  )
};
