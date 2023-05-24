type Props = {
  text: string;
};

const EmptyPlaceholder = ({ text }: Props) => {
  return (
    <h1 className="text-xl text-white bg-slate-700 p-3 rounded-xl">{text}</h1>
  );
};

export default EmptyPlaceholder;
