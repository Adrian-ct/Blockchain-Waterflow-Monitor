const Background = ({ children }: any) => {
  return (
    <div className="min-h-screen p-10 pt-16 w-full bg-[url('../images/bg.svg')] bg-cover text-black">
      {children}
    </div>
  );
};
export default Background;
