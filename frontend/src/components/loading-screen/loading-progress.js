import { loadingProgress } from 'src/assets';

// ----------------------------------------------------------------------

export default function LoadingProgress({ sx, ...other }) {
  return (
    <div
      className="absolute"
      style={{
        backgroundColor: 'transparent',
        ...sx,
      }}
      {...other}
    >
      <img
        src={loadingProgress}
        className="w-[90px]"
        alt="Loading"
      />
    </div>
  );
}