import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from 'prop-types';

interface LoadingProps {
    isLoading: boolean;
  }

function Loading({ 
    isLoading,
} : LoadingProps) {
  return (
    <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isLoading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  )
}

export default Loading

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
