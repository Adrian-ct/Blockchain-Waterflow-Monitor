type Props = {
  title: string;
  text: string;
};

const Card = ({ title, text }: Props) => {
  return (
    <article className="card rounded-none hover:scale-125 hover:rounded-xl transition-all ease-in hover:z-50 bg-white text-black">
      <section className="card-body max-h-48 p-5 overflow-scroll text-[0.9rem]">
        <h2 className="card-title text-[1rem]">{title}</h2>
        <p>{text}</p>
      </section>
    </article>
  );
};

export default Card;
