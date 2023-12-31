import ReactTypingEffect from "react-typing-effect";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
export const Home = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return (
    <div className=" d-flex flex-column align-items-center justify-content-center ">
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
        <Link to="/poll/create-new" className="text-decoration-none text-light">
          <span>Create Poll</span>
        </Link>
      </div>
    </div>
  );
};
