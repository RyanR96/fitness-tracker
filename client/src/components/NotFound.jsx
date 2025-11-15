function NotFound(props) {
  const { message } = props;
  return (
    <div className="text-center mt-10">
      <h1 className="text-xl font-bold">Hello!!! Not real page!! {message}</h1>
    </div>
  );
}

export default NotFound;
