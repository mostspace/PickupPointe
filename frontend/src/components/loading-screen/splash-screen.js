import { loadingLogo } from 'src/assets'; // Ensure this logo is optimized (SVG or small PNG)

// ----------------------------------------------------------------------

export default function SplashScreen({ sx, ...other }) {
  return (
    <div
      className="w-full min-h-[100vh] flex justify-center items-center"
      style={{
        backgroundColor: '#fff', // Optionally, set a background color for better UX during loading
        ...sx, // Accept and apply additional styles if passed via props
      }}
      {...other}
    >
      {/* Add animation for better UX */}
      <img
        src={loadingLogo}
        className="w-[20%] md:w-[12%]" // Example of subtle spinning animation
        alt="Loading"
      />
    </div>
  );
}