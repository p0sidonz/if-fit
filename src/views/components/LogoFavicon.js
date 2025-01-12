import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const LogoFavicon = ({ width = '100%', height = '100%', color = '#666CFF' }) => {
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
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ margin: 'auto' }}
      >
        <rect x="0" y="0" width="100%" height="100%" fill={backgroundColor} fillOpacity="1" className="background" />
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
        
      </svg>
    </Box>
  )
}

export default LogoFavicon
