import ReactTypingEffect from "react-typing-effect";
import { useMediaQuery } from "react-responsive";
export const Home = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center p-5">
      <div
        style={isDesktopOrLaptop ? { fontSize: `4vw` } : { fontSize: `8vw` }}
        className="fw-bold "
      >
        <div className="text-center">Create instant,realtime</div>
      </div>
      <div
        style={isDesktopOrLaptop ? { fontSize: `4vw` } : { fontSize: `8vw` }}
        className="fw-bold"
      >
        <span className="text-success">polls </span>
        <span>for </span>
        <ReactTypingEffect
          text={["free", "work", "fun", "feedback"]}
          eraseDelay={2000}
          typingDelay={700}
          className="text-warning"
        />
      </div>
      <div
        className="bg-success text-light p-2 p-md-3 text-center m-2  fs-4 fw-bold "
        style={{ borderRadius: `5px` }}
      >
        <span>Create Poll</span>
      </div>
    </div>
  );
};
