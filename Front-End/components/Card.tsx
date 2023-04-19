type Props = {
  title: string;
  text: string;
};
const Card = ({ title, text }: Props) => {
  return (
    <div className="card rounded-none hover:scale-110 transition-all ease-in hover:z-50 bg-white text-black">
      <div className="card-body max-h-48 p-5 overflow-scroll text-[0.9rem]">
        <h2 className="card-title text-[1rem]">{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Card;
