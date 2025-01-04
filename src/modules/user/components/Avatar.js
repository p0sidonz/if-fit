import {useState, useEffect} from 'react'
import { CardContent } from '@mui/material'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import {useUpdateProfilePicture} from '../hooks/useUserData'


const ImgStyled = styled("img")(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(5),
    borderRadius: theme.shape.borderRadius,
  }));
  
  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  }));
  
  const ResetButtonStyled = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: 0,
      textAlign: "center",
      marginTop: theme.spacing(4),
    },
  }));

const AvatarComponent = ({avatarUrl}) => {
    const updateProfilePicture = useUpdateProfilePicture();
    const [inputValue, setInputValue] = useState("");
    const [imgSrc, setImgSrc] = useState("/images/avatars/1.png");

    const handleInputImageChange = (file) => {
        const reader = new FileReader();
        const { files } = file.target;
        if (files && files.length !== 0) {
          reader.onload = () => setImgSrc(reader.result);
          reader.readAsDataURL(files[0]);
          handleUploadImage(files[0]);

          if (reader.result !== null) {
            setInputValue(reader.result);
          }

        }
      };
      useEffect(() => {
        if (avatarUrl) {
          setImgSrc(avatarUrl);
        } else {
          setImgSrc("/images/avatars/1.png");
        }
      }, [avatarUrl]);
    
      const handleInputImageReset = () => {
        setInputValue("");
        setImgSrc("/images/avatars/1.png");
      };

      const handleUploadImage = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data);
        await updateProfilePicture.mutate(formData);
      }

      
    return (
        <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ImgStyled src={imgSrc} alt="Profile Pic" />
          <div>
            <ButtonStyled
              component="label"
              variant="contained"
              htmlFor="account-settings-upload-image"
            >
              Upload New Photo
              <input
                hidden
                type="file"
                value={inputValue}
                accept="image/png, image/jpeg"
                onChange={handleInputImageChange}
                id="account-settings-upload-image"
              />
            </ButtonStyled>
            <ResetButtonStyled
              color="secondary"
              variant="outlined"
              onClick={handleInputImageReset}
            >
              Reset
            </ResetButtonStyled>
            <Typography sx={{ mt: 5, color: "text.disabled" }}>
              Allowed PNG or JPEG. Max size of 800K.
            </Typography>
          </div>
        </Box>
      </CardContent>
    )

}

export default AvatarComponent
