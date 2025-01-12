import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Logo = ({ width = 230, height = 165, color = '#666CFF' }) => {
  const theme = useTheme()
  const backgroundColor =  'transparent'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={width}
        height={height}
        viewBox="0 0 230 165"
        preserveAspectRatio="xMidYMid meet"
        style={{ margin: 'auto' }}
      >
        <rect x="0" y="0" width="100%" height="100%" fill={backgroundColor} fillOpacity="1" className="background" />
        <g fill={color} className="newinitialsvg-g newinitialsvg" transform="translate(40,40)">
          <g className="tp-name" transform="translate(0,0)">
            <g transform="translate(0, 0)">
              <g dataGra="path-name" fill={color} transform="translate(0,15)">
                <g transform="scale(1)" fill={color}>
                  <path d="M10.68-28.44L10.68-3.66Q10.68-2.10 9.66-1.05Q8.64 0 7.08 0L7.08 0Q5.52 0 4.50-1.05Q3.48-2.10 3.48-3.66L3.48-3.66L3.48-28.44Q3.48-30 4.50-31.05Q5.52-32.10 7.08-32.10L7.08-32.10Q8.64-32.10 9.66-31.05Q10.68-30 10.68-28.44L10.68-28.44ZM7.02-36L7.02-36Q4.98-36 4.14-36.66Q3.30-37.32 3.30-39L3.30-39L3.30-40.14Q3.30-41.88 4.23-42.51Q5.16-43.14 7.08-43.14L7.08-43.14Q9.18-43.14 10.02-42.48Q10.86-41.82 10.86-40.14L10.86-40.14L10.86-39Q10.86-37.26 9.96-36.63Q9.06-36 7.02-36Z" transform="translate(-3.3, 44.4)" fill={color}></path>
                </g>
              </g>
            </g>
          </g>
          <g className="tp-graph" transform="translate(11.559999999999999, 0)" fill={color}>
            <defs>
              <mask id="letterMask">
                <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                <g transform="translate(2.9999995803832995,15)">
                  <g transform="scale(1)">
                    <path d="M20.40-44.40L20.40-44.40Q21.72-44.40 22.98-44.04Q24.24-43.68 25.08-42.87Q25.92-42.06 25.92-40.74L25.92-40.74Q25.92-39.24 25.05-38.37Q24.18-37.50 23.04-37.50L23.04-37.50Q22.50-37.50 21.42-37.77Q20.34-38.04 19.32-38.04L19.32-38.04Q17.82-38.04 17.01-37.38Q16.20-36.72 15.90-35.85Q15.60-34.98 15.60-34.32L15.60-34.32L15.60-3.66Q15.60-2.10 14.58-1.05Q13.56 0 12 0L12 0Q10.44 0 9.42-1.05Q8.40-2.10 8.40-3.66L8.40-3.66L8.40-34.26Q8.40-38.52 11.40-41.46Q14.40-44.40 20.40-44.40ZM5.16-31.50L21.06-31.50Q22.50-31.50 23.46-30.57Q24.42-29.64 24.42-28.20L24.42-28.20Q24.42-26.76 23.46-25.83Q22.50-24.90 21.06-24.90L21.06-24.90L5.16-24.90Q3.72-24.90 2.76-25.83Q1.80-26.76 1.80-28.20L1.80-28.20Q1.80-29.64 2.76-30.57Q3.72-31.50 5.16-31.50L5.16-31.50Z" transform="translate(-1.7999999999999998, 44.4)" fill="black"/>
                  </g>
                </g>
              </mask>
            </defs>
            <polyline 
              dataGra="graph-name" 
              fillOpacity="1" 
              fill={color} 
              x="0" 
              y="0" 
              width="30.119999999999997" 
              height="51" 
              points="0,0 30.119999999999997,12 30.119999999999997,63 0,75 0,12"
              mask="url(#letterMask)"
            />
          </g>
          <g transform="translate(45.68, 0)" fill={color}>
            <g dataGra="path-name" fill={color} transform="translate(0,15)">
              <g transform="scale(1)" fill={color}>
                <path d="M18.72 0.60L18.72 0.60Q13.62 0.60 9.87-1.53Q6.12-3.66 4.11-7.32Q2.10-10.98 2.10-15.60L2.10-15.60Q2.10-21 4.29-24.81Q6.48-28.62 10.02-30.66Q13.56-32.70 17.52-32.70L17.52-32.70Q20.58-32.70 23.31-31.44Q26.04-30.18 28.14-27.99Q30.24-25.80 31.47-22.92Q32.70-20.04 32.70-16.80L32.70-16.80Q32.64-15.36 31.56-14.46Q30.48-13.56 29.04-13.56L29.04-13.56L6.12-13.56L4.32-19.56L26.34-19.56L25.02-18.36L25.02-19.98Q24.90-21.72 23.79-23.10Q22.68-24.48 21.03-25.29Q19.38-26.10 17.52-26.10L17.52-26.10Q15.72-26.10 14.16-25.62Q12.60-25.14 11.46-24Q10.32-22.86 9.66-20.94Q9-19.02 9-16.08L9-16.08Q9-12.84 10.35-10.59Q11.70-8.34 13.83-7.17Q15.96-6 18.36-6L18.36-6Q20.58-6 21.90-6.36Q23.22-6.72 24.03-7.23Q24.84-7.74 25.50-8.10L25.50-8.10Q26.58-8.64 27.54-8.64L27.54-8.64Q28.86-8.64 29.73-7.74Q30.60-6.84 30.60-5.64L30.60-5.64Q30.60-4.02 28.92-2.70L28.92-2.70Q27.36-1.38 24.54-0.39Q21.72 0.60 18.72 0.60Z" transform="translate(-2.1, 44.4)" fill={color}></path>
              </g>
            </g>
          </g>
          <g transform="translate(80.28, 0)" fill={color}>
            <g dataGra="path-name" fill={color} transform="translate(0,15)">
              <g transform="scale(1)" fill={color}>
                <path d="M4.26-31.50L4.26-31.50L18.48-31.50Q19.92-31.50 20.88-30.54Q21.84-29.58 21.84-28.14L21.84-28.14Q21.84-26.76 20.88-25.83Q19.92-24.90 18.48-24.90L18.48-24.90L4.26-24.90Q2.82-24.90 1.86-25.86Q0.90-26.82 0.90-28.26L0.90-28.26Q0.90-29.64 1.86-30.57Q2.82-31.50 4.26-31.50ZM10.68-39L10.68-39Q12.24-39 13.23-37.95Q14.22-36.90 14.22-35.34L14.22-35.34L14.22-8.64Q14.22-7.80 14.55-7.26Q14.88-6.72 15.45-6.48Q16.02-6.24 16.68-6.24L16.68-6.24Q17.40-6.24 18-6.51Q18.60-6.78 19.38-6.78L19.38-6.78Q20.22-6.78 20.91-6Q21.60-5.22 21.60-3.84L21.60-3.84Q21.60-2.16 19.77-1.08Q17.94 0 15.84 0L15.84 0Q14.58 0 13.05-0.21Q11.52-0.42 10.17-1.23Q8.82-2.04 7.92-3.72Q7.02-5.40 7.02-8.34L7.02-8.34L7.02-35.34Q7.02-36.90 8.07-37.95Q9.12-39 10.68-39Z" transform="translate(-0.8999999999999999, 44.4)" fill={color}></path>
              </g>
            </g>
          </g>
          <g transform="translate(105.22, 0)" fill={color}>
            <g dataGra="path-name" fill={color} transform="translate(0,15)">
              <g transform="scale(1)" fill={color}>
                <path d="M17.88-32.70L17.88-32.70Q21.30-32.70 23.85-31.98Q26.40-31.26 27.81-29.97Q29.22-28.68 29.22-26.88L29.22-26.88Q29.22-25.68 28.50-24.63Q27.78-23.58 26.40-23.58L26.40-23.58Q25.44-23.58 24.81-23.85Q24.18-24.12 23.70-24.54Q23.22-24.96 22.56-25.32L22.56-25.32Q21.96-25.68 20.73-25.89Q19.50-26.10 18.90-26.10L18.90-26.10Q15.84-26.10 13.71-24.78Q11.58-23.46 10.44-21.21Q9.30-18.96 9.30-16.02L9.30-16.02Q9.30-13.14 10.47-10.89Q11.64-8.64 13.71-7.32Q15.78-6 18.48-6L18.48-6Q19.98-6 21.06-6.18Q22.14-6.36 22.86-6.72L22.86-6.72Q23.70-7.20 24.36-7.74Q25.02-8.28 26.34-8.28L26.34-8.28Q27.90-8.28 28.74-7.29Q29.58-6.30 29.58-4.86L29.58-4.86Q29.58-3.36 27.90-2.13Q26.22-0.90 23.49-0.15Q20.76 0.60 17.58 0.60L17.58 0.60Q12.84 0.60 9.36-1.59Q5.88-3.78 3.99-7.56Q2.10-11.34 2.10-16.02L2.10-16.02Q2.10-20.94 4.11-24.69Q6.12-28.44 9.69-30.57Q13.26-32.70 17.88-32.70Z" transform="translate(-2.1, 44.4)" fill={color}></path>
              </g>
            </g>
          </g>
          <g transform="translate(136.7, 0)" fill={color}>
            <g dataGra="path-name" fill={color} transform="translate(0,15)">
              <g transform="scale(1)" fill={color}>
                <path d="M20.76-32.70L20.76-32.70Q25.08-32.70 27.33-30.84Q29.58-28.98 30.42-25.89Q31.26-22.80 31.26-19.02L31.26-19.02L31.26-3.66Q31.26-2.10 30.24-1.05Q29.22 0 27.66 0L27.66 0Q26.10 0 25.08-1.05Q24.06-2.10 24.06-3.66L24.06-3.66L24.06-19.02Q24.06-21 23.58-22.59Q23.10-24.18 21.84-25.14Q20.58-26.10 18.24-26.10L18.24-26.10Q15.96-26.10 14.34-25.14Q12.72-24.18 11.91-22.59Q11.10-21 11.10-19.02L11.10-19.02L11.10-3.66Q11.10-2.10 10.08-1.05Q9.06 0 7.50 0L7.50 0Q5.94 0 4.92-1.05Q3.90-2.10 3.90-3.66L3.90-3.66L3.90-40.74Q3.90-42.30 4.92-43.35Q5.94-44.40 7.50-44.40L7.50-44.40Q9.06-44.40 10.08-43.35Q11.10-42.30 11.10-40.74L11.10-40.74L11.10-25.86L10.20-26.04Q10.74-27.06 11.70-28.23Q12.66-29.40 14.04-30.42Q15.42-31.44 17.10-32.07Q18.78-32.70 20.76-32.70Z" transform="translate(-3.9, 44.4)" fill={color}></path>
              </g>
            </g>
          </g>
        </g>
        <g dataGra="path-slogan" fillRule="evenodd" className="tp-slogan" fill={color} transform="translate(40,120)">
          <rect x="0" height="1" y="3.5" width="45" fill={color}></rect>
          <rect height="1" y="3.5" width="45" x="108" fill={color}></rect>
          <g transform="translate(68.33,0)" fill={color}>
            <g transform="scale(0.8)" fill={color}>
              <path d="M0.78-0.60C0.78-0.38 0.85-0.21 0.99-0.07C1.13 0.07 1.30 0.14 1.50 0.14C1.69 0.14 1.86 0.07 2.00-0.07C2.14-0.21 2.21-0.38 2.21-0.60C2.21-0.83 2.14-1.02 2.00-1.16C1.86-1.30 1.69-1.37 1.50-1.37C1.30-1.37 1.13-1.30 0.99-1.16C0.85-1.02 0.78-0.83 0.78-0.60ZM4.07-7.87L4.07 0L5.06 0L5.06-3.53L8.06-3.53L8.06-4.37L5.06-4.37L5.06-7.03L8.60-7.03L8.60-7.87ZM10.00-7.87L10.00 0L10.99 0L10.99-7.87ZM14.78-7.03L14.78 0L15.79 0L15.79-7.03L18.17-7.03L18.17-7.87L12.41-7.87L12.41-7.03Z" transform="translate(-0.78, 7.872)" fill={color}></path>
            </g>
          </g>
        </g>
      </svg>
    </Box>
  )
}

export default Logo
