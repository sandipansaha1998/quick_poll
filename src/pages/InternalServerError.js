export const InternalServerError = () => {
  return (
    <div className="mt-5">
      <h1
        style={{ fontSize: "4.5rem" }}
        className="text-center fw-bold text-primary"
      >
        500{" "}
      </h1>{" "}
      <h4 className="text-center text-danger">Internal Server Error</h4>
    </div>
  );
};
